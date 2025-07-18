import { google } from 'googleapis';

export default async function handler(req, res) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SHEET_ID || '1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4';

        const range = 'TRANSACCIONES!B2:Q'; // Omitimos columna A (número de transacción)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            return res.status(200).json({ transacciones: [] });
        }

        // Encabezados esperados (manual si no están en el sheet)
        const headers = [
            'fecha',
            'hora',
            'nombre_cliente',
            'numero_cliente',
            'monto_ingreso',
            'cuenta_ingreso',
            'tipo_ingreso',
            'monto_egreso',
            'cuenta_egreso',
            'tipo_egreso',
            'resultado',
            'categoria_resultado',
            'concepto',
            'metodo_pago',
            'control',
            'tipo_cambio',
            'otros_valores',
        ];

        const transacciones = rows.map((row, idx) => {
            const obj = {};
            headers.forEach((key, i) => {
                obj[key] = row[i] !== undefined ? row[i] : '';
            });
            obj.id = idx + 1; // ID basado en orden
            return obj;
        });

        res.status(200).json({ transacciones });
    } catch (error) {
        console.error('ERROR AL LEER TRANSACCIONES:', error);
        res.status(500).json({ error: 'Error al leer las transacciones', detalle: error.message });
    }
}
