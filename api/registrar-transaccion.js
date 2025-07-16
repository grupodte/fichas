// /api/registrar-transaccion.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = '1iBGzUCeZgi7U2VBeAkFf4Ju8mRZbMn42sSUs_Ic2sE8'; // REEMPLAZAR por tu sheet real
const SHEET_NAME = 'TRANSACCIONES'; // Reemplazalo si es otro

// Cargamos credenciales desde una variable de entorno (recomendado en producción)
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const now = new Date();
        const formattedDate = now.toLocaleString('es-UY', {
            timeZone: 'America/Montevideo',
        });

        const values = [[
            formattedDate,
            body.nombre_cliente,
            body.monto_ingreso,
            body.cuenta_ingreso,
            body.tipo_ingreso,
            body.monto_egreso,
            body.cuenta_egreso,
            body.tipo_egreso,
            body.concepto || 'FORMULARIO MANUAL',
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });

        return NextResponse.json({ mensaje: 'Transacción registrada correctamente' });
    } catch (err) {
        console.error('Error al registrar transacción:', err);
        return NextResponse.json({ error: 'Error al registrar transacción' }, { status: 500 });
    }
}
