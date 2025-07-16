import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    try {
        const { nombre_cliente, monto_ingreso, cuenta_ingreso, tipo_ingreso, monto_egreso, cuenta_egreso, tipo_egreso, concepto } = req.body;

        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4'; // ID de la hoja
        const range = 'FORMULARIO!B2:I'; // Rango donde escribir (ajustar según necesidad)

        const values = [[
            new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' }), // Fecha y hora
            nombre_cliente || '',
            monto_ingreso || '',
            cuenta_ingreso || '',
            tipo_ingreso || '',
            monto_egreso || '',
            cuenta_egreso || '',
            tipo_egreso || '',
            concepto || 'FORMULARIO MANUAL'
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });

        return res.status(200).json({ mensaje: 'Transacción registrada correctamente' });
    } catch (error) {
        console.error('Error registrando transacción:', error);
        return res.status(500).json({ mensaje: 'Error al registrar transacción', error: error.message });
    }
}
