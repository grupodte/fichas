import { useState, useEffect } from 'react';
import { supabase } from './config/supabaseClient';
import { toast } from 'react-hot-toast';

const FormularioTransaccion = ({ usuarioId, empresaId }) => {
    const [clientes, setClientes] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [activosOrigen, setActivosOrigen] = useState([]);
    const [activosDestino, setActivosDestino] = useState([]);
    const [enviando, setEnviando] = useState(false);

    const [formData, setFormData] = useState({
        cliente_id: null,
        cuenta_origen_id: null,
        cuenta_origen_activo_id: null,
        monto_egreso: '',
        cuenta_destino_id: null,
        cuenta_destino_activo_id: null,
        monto_ingreso: '',
        tasa_cambio: '',
        descripcion: ''
    });

    // Cargar clientes y cuentas con activos + divisas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: clientesData } = await supabase
                    .from('clientes')
                    .select('id, nombre')
                    .eq('empresa_id', empresaId);
                setClientes(clientesData || []);

                const { data: cuentasData, error } = await supabase
                    .from('cuentas')
                    .select(`
            id,
            nombre,
            cuentas_activos (
              id,
              activos!inner ( nombre ),
              divisas!inner ( codigo )
            )
          `)
                    .eq('empresa_id', empresaId);

                if (error) throw error;
                setCuentas(cuentasData || []);
            } catch (err) {
                console.error(err);
                toast.error('Error cargando datos');
            }
        };
        fetchData();
    }, [empresaId]);

    // Cuando elige cuenta origen
    useEffect(() => {
        if (!formData.cuenta_origen_id) return;
        const cuenta = cuentas.find(c => c.id === formData.cuenta_origen_id);
        if (!cuenta) return;
        const activos = cuenta.cuentas_activos.map(ca => ({
            label: `${ca.activos.nombre} (${ca.divisas.codigo})`,
            value: ca.id,
            divisa: ca.divisas.codigo
        }));
        setActivosOrigen(activos);
        if (activos.length === 1) {
            setFormData(prev => ({ ...prev, cuenta_origen_activo_id: activos[0].value }));
        } else {
            setFormData(prev => ({ ...prev, cuenta_origen_activo_id: null }));
        }
    }, [formData.cuenta_origen_id]);

    // Cuando elige cuenta destino
    useEffect(() => {
        if (!formData.cuenta_destino_id) return;
        const cuenta = cuentas.find(c => c.id === formData.cuenta_destino_id);
        if (!cuenta) return;
        const activos = cuenta.cuentas_activos.map(ca => ({
            label: `${ca.activos.nombre} (${ca.divisas.codigo})`,
            value: ca.id,
            divisa: ca.divisas.codigo
        }));
        setActivosDestino(activos);
        if (activos.length === 1) {
            setFormData(prev => ({ ...prev, cuenta_destino_activo_id: activos[0].value }));
        } else {
            setFormData(prev => ({ ...prev, cuenta_destino_activo_id: null }));
        }
    }, [formData.cuenta_destino_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.cuenta_origen_activo_id && !formData.cuenta_destino_activo_id) {
            toast.error('Selecciona al menos una cuenta');
            return;
        }
        if (!formData.monto_egreso && !formData.monto_ingreso) {
            toast.error('Debes ingresar al menos un monto');
            return;
        }

        // Validar tipo de cambio si las divisas son diferentes
        const divisaOrigen = activosOrigen.find(a => a.value === formData.cuenta_origen_activo_id)?.divisa;
        const divisaDestino = activosDestino.find(a => a.value === formData.cuenta_destino_activo_id)?.divisa;
        if (divisaOrigen && divisaDestino && divisaOrigen !== divisaDestino && !formData.tasa_cambio) {
            toast.error('Debes ingresar la tasa de cambio cuando las divisas son diferentes');
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
                cliente_id: null,
                cuenta_origen_id: null,
                cuenta_origen_activo_id: null,
                monto_egreso: '',
                cuenta_destino_id: null,
                cuenta_destino_activo_id: null,
                monto_ingreso: '',
                tasa_cambio: '',
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

                {/* Cliente */}
                <div className="mb-4">
                    <label className="text-white block mb-2">Cliente</label>
                    <select
                        value={formData.cliente_id || ''}
                        onChange={e => setFormData(prev => ({ ...prev, cliente_id: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-white/10 text-white"
                    >
                        <option value="">Sin cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Cuenta Egreso */}
                <h3 className="text-white font-semibold mb-2 mt-4">Cuenta Egreso</h3>
                <select
                    value={formData.cuenta_origen_id || ''}
                    onChange={e => setFormData(prev => ({ ...prev, cuenta_origen_id: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-white/10 text-white mb-2"
                >
                    <option value="">Seleccionar cuenta</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {activosOrigen.length > 1 && (
                    <select
                        value={formData.cuenta_origen_activo_id || ''}
                        onChange={e => setFormData(prev => ({ ...prev, cuenta_origen_activo_id: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-white/10 text-white"
                    >
                        <option value="">Seleccionar activo/divisa</option>
                        {activosOrigen.map(a => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                    </select>
                )}
                <input
                    type="number"
                    placeholder="Monto egreso"
                    value={formData.monto_egreso}
                    onChange={e => setFormData(prev => ({ ...prev, monto_egreso: e.target.value }))}
                    className="w-full mt-2 p-2 rounded-lg bg-white/10 text-white"
                />

                {/* Cuenta Ingreso */}
                <h3 className="text-white font-semibold mb-2 mt-4">Cuenta Ingreso</h3>
                <select
                    value={formData.cuenta_destino_id || ''}
                    onChange={e => setFormData(prev => ({ ...prev, cuenta_destino_id: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-white/10 text-white mb-2"
                >
                    <option value="">Seleccionar cuenta</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {activosDestino.length > 1 && (
                    <select
                        value={formData.cuenta_destino_activo_id || ''}
                        onChange={e => setFormData(prev => ({ ...prev, cuenta_destino_activo_id: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-white/10 text-white"
                    >
                        <option value="">Seleccionar activo/divisa</option>
                        {activosDestino.map(a => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                    </select>
                )}
                <input
                    type="number"
                    placeholder="Monto ingreso"
                    value={formData.monto_ingreso}
                    onChange={e => setFormData(prev => ({ ...prev, monto_ingreso: e.target.value }))}
                    className="w-full mt-2 p-2 rounded-lg bg-white/10 text-white"
                />

                {/* Tipo de cambio */}
                <div className="mb-4 mt-4">
                    <label className="text-white block mb-2">Tipo de cambio</label>
                    <input
                        type="number"
                        placeholder="Tasa si aplica"
                        value={formData.tasa_cambio}
                        onChange={e => setFormData(prev => ({ ...prev, tasa_cambio: e.target.value }))}
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
