import { useState, useEffect } from 'react';
import { supabase } from './config/supabaseClient';
import { toast } from 'react-hot-toast';

const FormularioTransaccion = ({ usuarioId, empresaId }) => {
    const [cuentas, setCuentas] = useState([]);
    const [activosDisponibles, setActivosDisponibles] = useState([]);
    const [divisasDisponibles, setDivisasDisponibles] = useState([]);

    const [formData, setFormData] = useState({
        cuenta_id: null,
        activo: null,
        divisa: null,
        monto: '',
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
            value: ca.id,
            divisa: ca.divisa.codigo
        }));
        setActivosDisponibles(activos);
        if (activos.length === 1) {
            // Autoseleccionar si solo hay uno
            setFormData(prev => ({ ...prev, activo: activos[0].value, divisa: activos[0].divisa }));
        } else {
            setFormData(prev => ({ ...prev, activo: null, divisa: null }));
        }
    }, [formData.cuenta_id]);

    // Cuando elige activo, autoseleccionar divisa
    useEffect(() => {
        const activoSel = activosDisponibles.find(a => a.value === formData.activo);
        if (activoSel) {
            setFormData(prev => ({ ...prev, divisa: activoSel.divisa }));
        }
    }, [formData.activo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.activo || !formData.monto) {
            toast.error('Selecciona cuenta, activo y monto');
            return;
        }

        setEnviando(true);
        try {
            const { error } = await supabase.from('transacciones').insert([{
                empresa_id: empresaId,
                fecha: new Date().toISOString().split('T')[0],
                cuenta_destino_activo_id: formData.activo,
                monto_ingreso: parseFloat(formData.monto),
                categoria_resultado_id: formData.categoria_resultado_id,
                cliente_id: formData.cliente_id,
                descripcion: formData.descripcion,
                created_by: usuarioId
            }]);
            if (error) throw error;
            toast.success('Transacción registrada');
            setFormData({
                cuenta_id: null, activo: null, divisa: null,
                monto: '', categoria_resultado_id: null, cliente_id: null, descripcion: ''
            });
        } catch (err) {
            toast.error('Error al guardar la transacción');
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
                            value={formData.activo || ''}
                            onChange={e => setFormData(prev => ({ ...prev, activo: e.target.value }))}
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
                        value={formData.monto}
                        onChange={e => setFormData(prev => ({ ...prev, monto: e.target.value }))}
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

                {/* Botón */}
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
