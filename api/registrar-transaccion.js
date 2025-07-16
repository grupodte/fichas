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
        const spreadsheetId = '1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4'; // Tu ID real

        const {
            nombre_cliente,
            monto_ingreso,
            cuenta_ingreso,
            tipo_ingreso,
            monto_egreso,
            cuenta_egreso,
            tipo_egreso,
            concepto
        } = req.body;

        const fecha = new Date().toLocaleDateString('es-UY');

        const values = [
            [
                fecha,
                nombre_cliente || '',
                monto_ingreso || '',
                cuenta_ingreso || '',
                tipo_ingreso || '',
                monto_egreso || '',
                cuenta_egreso || '',
                tipo_egreso || '',
                concepto || ''
            ]
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'TRANSACCIONES!B2',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values
            }
        });

        res.status(200).json({ mensaje: 'Transacción registrada', response });
    } catch (error) {
        console.error('ERROR REGISTRAR TRANSACCIÓN:', error); // clave para ver en Vercel
        res.status(500).json({ error: 'Error al registrar la transacción', detalle: error.message });
    }
}
