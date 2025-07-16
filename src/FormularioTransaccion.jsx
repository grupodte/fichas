import { useEffect, useState } from 'react';
import FiltroSelect from './FiltroSelect';

const FormularioTransaccion = () => {
    const [clientes, setClientes] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [tiposIngreso, setTiposIngreso] = useState([]);
    const [tiposEgreso, setTiposEgreso] = useState([]);

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
        const cuentaIngreso = cuentas.find(c => c.cuenta === formData.cuenta_ingreso);
        setTiposIngreso(cuentaIngreso?.tipos || []);

        const cuentaEgreso = cuentas.find(c => c.cuenta === formData.cuenta_egreso);
        setTiposEgreso(cuentaEgreso?.tipos || []);
    }, [formData.cuenta_ingreso, formData.cuenta_egreso, cuentas]);

    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('/api/registrar-transaccion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await res.json();
        alert(result.mensaje || 'Transacción enviada');

        // ✅ Resetear formulario
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
    };
      

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto backdrop-blur-md bg-white/30 shadow-xl rounded-2xl p-8 border border-white/20"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Registrar Transacción</h2>
            <p className="text-sm text-gray-600 mb-6">Completá los campos para registrar el ingreso y egreso.</p>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <FiltroSelect
                        label="Cliente"
                        options={clientes}
                        value={formData.nombre_cliente}
                        onChange={(val) => setFormData(prev => ({ ...prev, nombre_cliente: val }))}
                    />
                </div>

                <input
                    name="monto_ingreso"
                    type="number"
                    placeholder="Monto ingreso"
                    value={formData.monto_ingreso}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

                <div className="flex flex-col gap-2">
                    <FiltroSelect
                        label="Cuenta ingreso"
                        options={cuentas.map(c => c.cuenta)}
                        value={formData.cuenta_ingreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_ingreso: val }))}
                    />
                </div>

                <select
                    name="tipo_ingreso"
                    onChange={handleChange}
                    value={formData.tipo_ingreso}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />

                <div className="flex flex-col gap-2">
                    <FiltroSelect
                        label="Cuenta egreso"
                        options={cuentas.map(c => c.cuenta)}
                        value={formData.cuenta_egreso}
                        onChange={(val) => setFormData(prev => ({ ...prev, cuenta_egreso: val }))}
                    />
                </div>

                <select
                    name="tipo_egreso"
                    onChange={handleChange}
                    value={formData.tipo_egreso}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                    <option value="">Seleccionar tipo egreso</option>
                    {tiposEgreso.map((tipo, i) => (
                        <option key={i} value={tipo}>{tipo}</option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-black text-white p-2 rounded w-full hover:ring-2 hover:ring-white hover:shadow-lg transition"
                >
                    Enviar transacción
                </button>
            </div>
        </form>
    );
};

export default FormularioTransaccion;
