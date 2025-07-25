import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const {
            cliente_id,
            cuenta_origen_activo_id,
            cuenta_destino_activo_id,
            monto_ingreso,
            monto_egreso,
            categoria_resultado_id,
            descripcion,
            fecha,
            empresa_id,
            tasa_cambio
        } = req.body;

        if (!empresa_id || !categoria_resultado_id || (!monto_ingreso && !monto_egreso)) {
            return res.status(400).json({ error: 'Faltan datos obligatorios: empresa, categoría y al menos un monto son requeridos.' });
        }

        const { error } = await supabaseAdmin
            .from('transacciones')
            .insert([
                {
                    cliente_id: cliente_id || null,
                    cuenta_origen_activo_id: cuenta_origen_activo_id || null,
                    cuenta_destino_activo_id: cuenta_destino_activo_id || null,
                    monto_ingreso: monto_ingreso ? parseFloat(monto_ingreso) : null,
                    monto_egreso: monto_egreso ? parseFloat(monto_egreso) : null,
                    tasa_cambio: tasa_cambio ? parseFloat(tasa_cambio) : null,
                    categoria_resultado_id,
                    descripcion,
                    fecha: fecha || new Date().toISOString().split('T')[0],
                    empresa_id: empresa_id
                }
            ]);

        if (error) throw error;

        return res.status(200).json({ mensaje: 'Transacción registrada con éxito' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno al registrar transacción' });
    }
}
