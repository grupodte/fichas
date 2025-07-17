import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4';

        const {
            nombre_cliente,
            numero_cliente,
            monto_ingreso,
            cuenta_ingreso,
            tipo_ingreso,
            monto_egreso,
            cuenta_egreso,
            tipo_egreso,
            concepto
        } = req.body;

        if (!nombre_cliente) {
            return res.status(400).json({ error: 'El nombre del cliente es obligatorio.' });
        }

        if (monto_ingreso && isNaN(parseFloat(monto_ingreso))) {
            return res.status(400).json({ error: 'El monto de ingreso debe ser un número.' });
        }

        if (monto_egreso && isNaN(parseFloat(monto_egreso))) {
            return res.status(400).json({ error: 'El monto de egreso debe ser un número.' });
        }

        const fecha = new Date().toLocaleDateString('es-UY');
        const resultado = (parseFloat(monto_ingreso || 0) - parseFloat(monto_egreso || 0)).toFixed(2);

        const values = [
            [
                fecha,
                numero_cliente || '',
                nombre_cliente || '',
                monto_ingreso || '',
                cuenta_ingreso || '',
                tipo_ingreso || '',
                monto_egreso || '',
                cuenta_egreso || '',
                tipo_egreso || '',
                resultado,
            ]
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'TRANSACCIONES!B2',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values }
        });

        res.status(200).json({ mensaje: 'Transacción registrada', response });
    } catch (error) {
        console.error('ERROR REGISTRAR TRANSACCIÓN:', error);
        res.status(500).json({ error: 'Error al registrar la transacción', detalle: error.message });
    }
}
