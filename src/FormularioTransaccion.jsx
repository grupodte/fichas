import { useEffect, useRef, useState } from 'react';
import FiltroSelect from './FiltroSelect';
import { toast } from 'react-hot-toast';

const FormularioTransaccion = () => {
    const [clientes, setClientes] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [tiposIngreso, setTiposIngreso] = useState([]);
    const [tiposEgreso, setTiposEgreso] = useState([]);
    const [enviando, setEnviando] = useState(false);

    const tipoIngresoRef = useRef(null);
    const tipoEgresoRef = useRef(null);

    const [formData, setFormData] = useState({
        nombre_cliente: '',
        monto_ingreso: '',
        cuenta_ingreso: '',
        tipo_ingreso: '',
        monto_egreso: '',
        cuenta_egreso: '',
        tipo_egreso: '',
        concepto: 'FORMULARIO MANUAL',
    });

    useEffect(() => {
        fetch('https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/CLIENTES')
            .then(res => res.json())
            .then(data => {
                const nombres = data.map(item => item["NOMBRE "]?.trim()).filter(Boolean);
                setClientes(nombres);
            });
    }, []);

    useEffect(() => {
        fetch('https://opensheet.elk.sh/1hhIN8WypZXejNgLLP802dypL-d2KMcyGzDsYWpQd3tM/Sheet1')
            .then(res => res.json())
            .then(data => {
                const cuentasConTipos = data.map(row => {
                    const tipos = Object.values(row).slice(1).filter(Boolean);
                    return { cuenta: row["CUENTA"], tipos };
                });
                setCuentas(cuentasConTipos);
            });
    }, []);

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

    const scrollIntoViewOnFocus = (ref) => {
        ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                monto_ingreso: '',
                cuenta_ingreso: '',
                tipo_ingreso: '',
                monto_egreso: '',
                cuenta_egreso: '',
                tipo_egreso: '',
                concepto: 'FORMULARIO MANUAL',
            });
        } catch (err) {
            toast.error('Error al enviar transacción');
        } finally {
            setTimeout(() => setEnviando(false), 3000);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white px-4 pb-40 pt-8">
<form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto bg-white/50 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Registrar Transacción</h2>
                <p className="text-sm text-gray-600 mb-6">Completá los campos para registrar el ingreso y egreso.</p>

                <div className="flex flex-col gap-6">
                    <FiltroSelect
                        label="Cliente"
                        options={clientes}
                        value={formData.nombre_cliente}
                        onChange={(val) => setFormData(prev => ({ ...prev, nombre_cliente: val }))}
                    />

                    <input
                        name="monto_ingreso"
                        type="number"
                        placeholder="Monto ingreso"
                        value={formData.monto_ingreso}
                        onChange={handleChange}
                        className="input-base text-lg border-green-400"
                    />

                    <FiltroSelect
                        label="Cuenta ingreso"
                        options={cuentas.map(c => c.cuenta)}
                        value={formData.cuenta_ingreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_ingreso: val }))}
                    />

                    <select
                        name="tipo_ingreso"
                        ref={tipoIngresoRef}
                        onFocus={() => scrollIntoViewOnFocus(tipoIngresoRef)}
                        onChange={handleChange}
                        value={formData.tipo_ingreso}
                        className="input-base text-lg"
                    >
                        <option value="">Seleccionar tipo ingreso</option>
                        {tiposIngreso.map((tipo, i) => (
                            <option key={i} value={tipo}>{tipo}</option>
                        ))}
                    </select>

                    <input
                        name="monto_egreso"
                        type="number"
                        placeholder="Monto egreso"
                        value={formData.monto_egreso}
                        onChange={handleChange}
                        className="input-base text-lg border-red-400"
                    />

                    <FiltroSelect
                        label="Cuenta egreso"
                        options={cuentas.map(c => c.cuenta)}
                        value={formData.cuenta_egreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_egreso: val }))}
                    />

                    <select
                        name="tipo_egreso"
                        ref={tipoEgresoRef}
                        onFocus={() => scrollIntoViewOnFocus(tipoEgresoRef)}
                        onChange={handleChange}
                        value={formData.tipo_egreso}
                        className="input-base text-lg"
                    >
                        <option value="">Seleccionar tipo egreso</option>
                        {tiposEgreso.map((tipo, i) => (
                            <option key={i} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={enviando}
                    className={`w-full bg-black text-white text-lg py-3 rounded-xl shadow-xl transition ${enviando ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-white'
                        }`}
                >
                    {enviando ? 'Enviando...' : 'Enviar transacción'}
                </button>
            </form>

          
        </div>
    );
};

export default FormularioTransaccion;
