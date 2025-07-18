import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SHEET_ID || '1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4';

        // 🧩 Datos del body
        const {
            nombre_cliente = '',
            numero_cliente = '',
            monto_ingreso = '',
            cuenta_ingreso = '',
            tipo_ingreso = '',
            monto_egreso = '',
            cuenta_egreso = '',
            tipo_egreso = '',
            concepto = '',
            categoria_resultado = '',
            metodo_pago = '',
            control = '',
            tipo_cambio = '',
            otros_valores = ''
        } = req.body;

        // ✅ Validaciones más fuertes
        if (!nombre_cliente.trim()) {
            return res.status(400).json({ error: 'Debe seleccionar un cliente' });
        }

        const ingreso = parseFloat(monto_ingreso || 0);
        const egreso = parseFloat(monto_egreso || 0);
        if (isNaN(ingreso) && isNaN(egreso)) {
            return res.status(400).json({ error: 'Debe ingresar al menos un monto válido' });
        }

        // 🕒 Fecha + hora
        const now = new Date();
        const fecha = now.toLocaleDateString('es-UY');
        const hora = now.toLocaleTimeString('es-UY');
        const resultado = (ingreso - egreso).toFixed(2);

        // 🧾 Fila ordenada
        const values = [[
            fecha,             // A - Fecha
            hora,              // B - Hora
            nombre_cliente,    // C
            numero_cliente,    // D
            ingreso || '',     // E
            cuenta_ingreso,    // F
            tipo_ingreso,      // G
            egreso || '',      // H
            cuenta_egreso,     // I
            tipo_egreso,       // J
            resultado,         // K
            categoria_resultado, // L
            concepto,            // M
            metodo_pago,         // N
            control,             // O
            tipo_cambio,         // P
            otros_valores        // Q
        ]];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'TRANSACCIONES!B2',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values }
        });

        return res.status(200).json({
            mensaje: 'Transacción registrada con éxito',
            resultado: {
                cliente: nombre_cliente,
                monto_neto: resultado,
                hora,
                fila: response.data.updates.updatedRange
            }
        });
    } catch (error) {
        console.error('ERROR REGISTRAR TRANSACCIÓN:', error);
        return res.status(500).json({
            error: 'Error interno',
            detalle: error.message
        });
    }
}
