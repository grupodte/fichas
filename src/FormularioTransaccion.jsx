import { useEffect, useState } from 'react';
import DropdownSelect from './components/DropdownSelect';
import { toast } from 'react-hot-toast';
import { useClientes } from './hooks/useClientes';
import { useCuentas } from './hooks/useCuentas';

const FormularioTransaccion = () => {
    const clientes = useClientes();
    const cuentas = useCuentas();
    const [tiposIngreso, setTiposIngreso] = useState([]);
    const [tiposEgreso, setTiposEgreso] = useState([]);
    const [enviando, setEnviando] = useState(false);

    const [formData, setFormData] = useState({
        nombre_cliente: '',
        numero_cliente: '',
        monto_ingreso: '',
        cuenta_ingreso: '',
        tipo_ingreso: '',
        monto_egreso: '',
        cuenta_egreso: '',
        tipo_egreso: '',
        concepto: '', 

    });

    
    

    useEffect(() => {
        const cuentaIng = cuentas.find(c => c.cuenta === formData.cuenta_ingreso);
        const cuentaEgr = cuentas.find(c => c.cuenta === formData.cuenta_egreso);
        setTiposIngreso(cuentaIng?.tipos || []);
        setTiposEgreso(cuentaEgr?.tipos || []);

        if (cuentaIng?.tipos?.length === 1) {
            setFormData(prev => ({ ...prev, tipo_ingreso: cuentaIng.tipos[0] }));
        }
        if (cuentaEgr?.tipos?.length === 1) {
            setFormData(prev => ({ ...prev, tipo_egreso: cuentaEgr.tipos[0] }));
        }
    }, [formData.cuenta_ingreso, formData.cuenta_egreso, cuentas]);

    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!formData.nombre_cliente) {
            toast.error('Seleccioná un cliente');
            return;
        }

        if (!formData.monto_ingreso && !formData.monto_egreso) {
            toast.error('Ingresá al menos un monto');
            return;
        }

        if (enviando) return;

        setEnviando(true);
        try {
            const res = await fetch('/api/registrar-transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            toast.success(result.mensaje || 'Transacción enviada');

            setFormData({
                nombre_cliente: '',
                numero_cliente: '',
                monto_ingreso: '',
                cuenta_ingreso: '',
                tipo_ingreso: '',
                monto_egreso: '',
                cuenta_egreso: '',
                tipo_egreso: '',
                concepto: '',
            });
        } catch (err) {
            toast.error('Error al enviar transacción');
        } finally {
            setTimeout(() => setEnviando(false), 3000);
        }
    };

    return (
        <div className="overflow-y-auto flex items-center justify-center px-4 pb-20 pt-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-lg md:min-w-[400px] mx-auto bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30"
            >
                <h2 className="text-2xl font-bold text-white mb-1 text-center mb-4">Registrar Transacción</h2>

                <div className="flex flex-col gap-6">
                    <DropdownSelect
                        label="Cliente"
                        options={clientes.map(c => `${c.nombre} (N° ${c.numero})`)}

                        value={formData.nombre_cliente}
                        onChange={(val) => {
                            const nombreExtraido = val.split(' (N°')[0]; // elimina " (N° ...)"
                            const clienteSeleccionado = clientes.find(c => c.nombre === nombreExtraido);
                            setFormData(prev => ({
                                ...prev,
                                nombre_cliente: nombreExtraido,
                                numero_cliente: clienteSeleccionado?.numero || ''
                            }));
                        }}
                          
                    />


              

                    <input
                        name="monto_ingreso"
                        type="number"
                        placeholder="Monto ingreso"
                        value={formData.monto_ingreso}
                        onChange={handleChange}
                        className="input-base  py-2 pl-3 pr-10 text-sm   bg-white/10 backdrop-blur-md w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none border-green-400"


                    />

                    <DropdownSelect
                        label="Cuenta ingreso"
                        options={cuentas.map(c => c.cuenta)}
                        value={formData.cuenta_ingreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_ingreso: val }))}
                    />

                    <DropdownSelect              
                          label="Tipo ingreso"
                        options={tiposIngreso}
                        value={formData.tipo_ingreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, tipo_ingreso: val }))}
                    />

                    <input
                        name="monto_egreso"
                        type="number"
                        placeholder="Monto egreso"
                        value={formData.monto_egreso}
                        onChange={handleChange}

                        className="input-base  py-2 pl-3 pr-10 text-sm   bg-white/10 backdrop-blur-md w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none border-red-400"

                                            />

                    <DropdownSelect
                        label="Cuenta egreso"
                        options={cuentas.map(c => c.cuenta)}
                        value={formData.cuenta_egreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_egreso: val }))}
                    />

                    <DropdownSelect
                        label="Tipo egreso"
                        options={tiposEgreso}
                        value={formData.tipo_egreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, tipo_egreso: val }))}
                    />
                </div>

                <div className="mt-10">
                    <button
                        type="submit"
                        disabled={enviando}
                        className={`w-full bg-black/30 text-white text-lg py-3 rounded-xl shadow-xl transition ${enviando ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-white'
                            }`}
                    >
                        {enviando ? 'Enviando...' : 'Enviar transacción'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioTransaccion;
