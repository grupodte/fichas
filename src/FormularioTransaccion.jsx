import { useEffect, useState } from 'react';
import FiltroSelect from './FiltroSelect'; // Ajustá el path si es necesario

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

    // Cargar cuentas y tipos
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

    // Actualizar tipos según cuenta seleccionada
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
        try {
            const res = await fetch('/api/registrar-transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            alert(result.mensaje || 'Transacción enviada');
        } catch (err) {
            console.error(err);
            alert('Error al enviar la transacción');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl w-full mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
            <h2 className="text-2xl font-semibold text-gray-800">Registrar Transacción</h2>

            <FiltroSelect
                label="Cliente"
                options={clientes}
                value={formData.nombre_cliente}
                onChange={(val) => setFormData(prev => ({ ...prev, nombre_cliente: val }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="monto_ingreso"
                    type="number"
                    placeholder="Monto ingreso"
                    value={formData.monto_ingreso}
                    onChange={handleChange}
                    className="input-base"
                />

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
                className="input-base"
            >
                <option value="">Seleccionar tipo ingreso</option>
                {tiposIngreso.map((tipo, i) => (
                    <option key={i} value={tipo}>{tipo}</option>
                ))}
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="monto_egreso"
                    type="number"
                    placeholder="Monto egreso"
                    value={formData.monto_egreso}
                    onChange={handleChange}
                    className="input-base"
                />

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
                className="input-base"
            >
                <option value="">Seleccionar tipo egreso</option>
                {tiposEgreso.map((tipo, i) => (
                    <option key={i} value={tipo}>{tipo}</option>
                ))}
            </select>

            <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-xl text-sm font-medium hover:bg-neutral-800 transition"
            >
                Enviar transacción
            </button>
        </form>
      
    );
};

export default FormularioTransaccion;
