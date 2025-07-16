import { useEffect, useState } from 'react';

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

    // Cargar nombres de clientes
    useEffect(() => {
        fetch('https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/CLIENTES')
            .then(res => res.json())
            .then(data => {
                const nombres = data.map(item => item["NOMBRE "]?.trim()).filter(Boolean);
                setClientes(nombres);
            });
    }, []);

    // Cargar cuentas y sus tipos asociados
    useEffect(() => {
        fetch('https://opensheet.elk.sh/1hhIN8WypZXejNgLLP802dypL-d2KMcyGzDsYWpQd3tM/Sheet1')
            .then(res => res.json())
            .then(data => {
                const cuentasConTipos = data.map(row => {
                    const tipos = Object.values(row).slice(1).filter(Boolean); // B, C, D...
                    return { cuenta: row["CUENTA"], tipos };
                });
                setCuentas(cuentasConTipos);
            });
    }, []);

    // Manejo dinámico al seleccionar cuenta
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
        const res = await fetch('https://4178392cd366.ngrok-free.app/webhook/registrar-transaccion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        alert(result.mensaje || 'Transacción enviada');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-gray-100 rounded">
            <h2 className="text-xl font-bold text-gray-700">Registro de Transacción</h2>

            <select name="nombre_cliente" onChange={handleChange} value={formData.nombre_cliente} className="w-full p-2 border rounded" required>
                <option value="">Seleccionar cliente</option>
                {clientes.map((nombre, i) => (
                    <option key={i} value={nombre}>{nombre}</option>
                ))}
            </select>

            <input name="monto_ingreso" type="number" placeholder="Monto ingreso" onChange={handleChange} className="w-full p-2 border rounded" />

            <select name="cuenta_ingreso" onChange={handleChange} value={formData.cuenta_ingreso} className="w-full p-2 border rounded">
                <option value="">Seleccionar cuenta ingreso</option>
                {cuentas.map(({ cuenta }, i) => (
                    <option key={i} value={cuenta}>{cuenta}</option>
                ))}
            </select>

            <select name="tipo_ingreso" onChange={handleChange} value={formData.tipo_ingreso} className="w-full p-2 border rounded">
                <option value="">Seleccionar tipo ingreso</option>
                {tiposIngreso.map((tipo, i) => (
                    <option key={i} value={tipo}>{tipo}</option>
                ))}
            </select>

            <input name="monto_egreso" type="number" placeholder="Monto egreso" onChange={handleChange} className="w-full p-2 border rounded" />

            <select name="cuenta_egreso" onChange={handleChange} value={formData.cuenta_egreso} className="w-full p-2 border rounded">
                <option value="">Seleccionar cuenta egreso</option>
                {cuentas.map(({ cuenta }, i) => (
                    <option key={i} value={cuenta}>{cuenta}</option>
                ))}
            </select>

            <select name="tipo_egreso" onChange={handleChange} value={formData.tipo_egreso} className="w-full p-2 border rounded">
                <option value="">Seleccionar tipo egreso</option>
                {tiposEgreso.map((tipo, i) => (
                    <option key={i} value={tipo}>{tipo}</option>
                ))}
            </select>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Enviar transacción
            </button>
        </form>
    );
};

export default FormularioTransaccion;
