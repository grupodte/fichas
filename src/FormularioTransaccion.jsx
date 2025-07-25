import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from './config/supabaseClient';
import DropdownSelect from './components/DropdownSelect';

const FormularioTransaccion = () => {
    const [clientes, setClientes] = useState([]);
    const [enviando, setEnviando] = useState(false);
    const [clienteId, setClienteId] = useState('');

    // Cargar clientes desde Supabase
    useEffect(() => {
        const fetchClientes = async () => {
            const { data, error } = await supabase.from('clientes').select('id, nombre');
            if (error) {
                toast.error('Error al cargar clientes');
            } else {
                setClientes(data || []);
            }
        };
        fetchClientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clienteId) {
            toast.error('Selecciona un cliente');
            return;
        }
        setEnviando(true);
        try {
            const res = await fetch('/api/registrar-transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cliente_id: clienteId }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Error');
            toast.success('Cliente enviado correctamente');
            setClienteId('');
        } catch (err) {
            toast.error(err.message || 'Error al enviar');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 pb-20 pt-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30"
            >
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    Seleccionar Cliente
                </h2>

                <DropdownSelect
                    label="Cliente"
                    options={clientes.map(c => ({ label: c.nombre, value: c.id }))}
                    value={clienteId}
                    onChange={val => setClienteId(val)}
                />

                <button
                    type="submit"
                    disabled={enviando}
                    className={`mt-6 w-full bg-black/30 text-white text-lg py-3 rounded-xl shadow-xl transition ${enviando ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-white'
                        }`}
                >
                    {enviando ? 'Enviando...' : 'Guardar'}
                </button>
            </form>
        </div>
    );
};

export default FormularioTransaccion;
