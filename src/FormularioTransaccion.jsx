import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from './config/supabaseClient';
import DropdownSelect from './components/DropdownSelect';

const FormularioTransaccion = () => {
    const [clientes, setClientes] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [enviando, setEnviando] = useState(false);

    const [formData, setFormData] = useState({
        cliente_id: null,
        cuenta_id: null,
    });

    // Cargar clientes y cuentas
    useEffect(() => {
        const fetchData = async () => {
            const { data: clientesData } = await supabase.from('clientes').select('id, nombre');
            const { data: cuentasData } = await supabase.from('cuentas').select('id, nombre');
            setClientes((clientesData || []).map(c => ({ label: c.nombre, value: c.id })));
            setCuentas((cuentasData || []).map(c => ({ label: c.nombre, value: c.id })));
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cliente_id || !formData.cuenta_id) {
            toast.error('Selecciona cliente y cuenta');
            return;
        }
        setEnviando(true);
        try {
            const res = await fetch('/api/registrar-transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Error al registrar');
            toast.success(result.mensaje || 'Transacción registrada');
            setFormData({ cliente_id: null, cuenta_id: null });
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Error al registrar');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="overflow-y-auto flex items-center justify-center px-4 pb-20 pt-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-lg md:min-w-[400px] mx-auto bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30"
            >
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Registrar</h2>

                <div className="flex flex-col gap-4">
                    <DropdownSelect
                        label="Cliente"
                        options={clientes}
                        value={formData.cliente_id}
                        onChange={(val) => setFormData(prev => ({ ...prev, cliente_id: val }))}
                    />

                    <DropdownSelect
                        label="Cuenta"
                        options={cuentas}
                        value={formData.cuenta_id}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_id: val }))}
                    />
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={enviando}
                        className={`w-full bg-black/30 text-white text-lg py-3 rounded-xl shadow-xl transition ${enviando ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-white'
                            }`}
                    >
                        {enviando ? 'Enviando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioTransaccion;
