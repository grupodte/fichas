import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { originalFecha, originalNroCliente, updated } = req.body;

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = '1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4';
    const range = 'TRANSACCIONES!B2:M';

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    const idx = rows.findIndex(
        (row) => row[0] === originalFecha && row[2] === originalNroCliente
    );

    if (idx === -1) return res.status(404).json({ error: 'Fila no encontrada' });

    const values = [
        [
            updated.FECHA,
            updated['NOMBRE CLIENTE'],
            updated['N° CLIENTE'],
            updated['MONTO INGRESO'],
            updated['CUENTA INGRESO'],
            updated['TIPO DE ASSET / SALA INGRESO'],
            updated['MONTO EGRESO'],
            updated['CUENTA EGRESO'],
            updated['TIPO DE ASSET / SALA EGRESO'],
            updated.RESULTADO,
            updated['CAT RESULTADO'],
            updated.CONCEPTO,
        ],
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `TRANSACCIONES!A${idx + 2}:M${idx + 2}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
    });

    return res.status(200).json({ success: true });
}
