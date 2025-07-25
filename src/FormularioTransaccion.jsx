import { useState, useEffect } from 'react';
import { supabase } from './config/supabaseClient';
import { toast } from 'react-hot-toast';

const FormularioTransaccion = ({ usuarioId, empresaId }) => {
    const [cuentas, setCuentas] = useState([]);
    const [activosDisponibles, setActivosDisponibles] = useState([]);
    const [formData, setFormData] = useState({
        cuenta_id: null,
        cuenta_destino_activo_id: null,
        monto_ingreso: '',
        categoria_resultado_id: null,
        cliente_id: null,
        descripcion: ''
    });
    const [enviando, setEnviando] = useState(false);

    // Cargar cuentas con sus activos y divisas
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('cuentas')
                .select(`
          id, nombre,
          cuentas_activos (
            id,
            activo:activos(nombre),
            divisa:divisas(codigo)
          )
        `)
                .eq('empresa_id', empresaId);
            if (error) {
                toast.error('Error cargando cuentas');
                return;
            }
            setCuentas(data || []);
        };
        fetchData();
    }, [empresaId]);

    // Cuando elige cuenta, cargar activos
    useEffect(() => {
        if (!formData.cuenta_id) return;
        const cuenta = cuentas.find(c => c.id === formData.cuenta_id);
        if (!cuenta) return;
        const activos = cuenta.cuentas_activos.map(ca => ({
            label: `${ca.activo.nombre} (${ca.divisa.codigo})`,
            value: ca.id
        }));
        setActivosDisponibles(activos);
        if (activos.length === 1) {
            // Autoseleccionar si solo hay uno
            setFormData(prev => ({ ...prev, cuenta_destino_activo_id: activos[0].value }));
        } else {
            setFormData(prev => ({ ...prev, cuenta_destino_activo_id: null }));
        }
    }, [formData.cuenta_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cuenta_destino_activo_id || !formData.monto_ingreso) {
            toast.error('Selecciona cuenta y monto');
            return;
        }

        setEnviando(true);
        try {
            const res = await fetch('/api/registrar-transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    empresa_id: empresaId
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Error al registrar');
            toast.success(result.mensaje || 'Transacción registrada');
            setFormData({
                cuenta_id: null,
                cuenta_destino_activo_id: null,
                monto_ingreso: '',
                categoria_resultado_id: null,
                cliente_id: null,
                descripcion: ''
            });
        } catch (err) {
            toast.error(err.message || 'Error al registrar');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="overflow-y-auto flex items-center justify-center px-4 pb-20 pt-8">
            <form onSubmit={handleSubmit} className="max-w-lg md:min-w-[400px] mx-auto bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Registrar Transacción</h2>

                {/* Cuenta */}
                <div className="mb-4">
                    <label className="text-white block mb-2">Cuenta</label>
                    <select
                        value={formData.cuenta_id || ''}
                        onChange={e => setFormData(prev => ({ ...prev, cuenta_id: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-white/10 text-white"
                    >
                        <option value="">Seleccionar</option>
                        {cuentas.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Activo + Divisa */}
                {activosDisponibles.length > 1 && (
                    <div className="mb-4">
                        <label className="text-white block mb-2">Activo / Divisa</label>
                        <select
                            value={formData.cuenta_destino_activo_id || ''}
                            onChange={e => setFormData(prev => ({ ...prev, cuenta_destino_activo_id: e.target.value }))}
                            className="w-full p-2 rounded-lg bg-white/10 text-white"
                        >
                            <option value="">Seleccionar</option>
                            {activosDisponibles.map(a => (
                                <option key={a.value} value={a.value}>{a.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Monto */}
                <div className="mb-4">
                    <label className="text-white block mb-2">Monto</label>
                    <input
                        type="number"
                        value={formData.monto_ingreso}
                        onChange={e => setFormData(prev => ({ ...prev, monto_ingreso: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-white/10 text-white"
                    />
                </div>

                {/* Descripción */}
                <div className="mb-4">
                    <label className="text-white block mb-2">Descripción</label>
                    <textarea
                        value={formData.descripcion}
                        onChange={e => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-white/10 text-white"
                    />
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={enviando}
                        className={`w-full bg-black/30 text-white text-lg py-3 rounded-xl shadow-xl transition ${enviando ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-white'}`}
                    >
                        {enviando ? 'Enviando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioTransaccion;
