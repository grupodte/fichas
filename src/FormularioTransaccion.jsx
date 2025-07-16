import { useEffect, useState } from 'react';

const FormularioTransaccion = () => {
    const [clientes, setClientes] = useState([]);
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
        fetch('https://4178392cd366.ngrok-free.app/webhook/clientes', {
            method: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(res => res.json())
            .then(data => {
                // Extraer todos los nombres de clientes
                const nombres = data.map(cliente => cliente["NOMBRE "]?.trim()).filter(Boolean);
                setClientes(nombres);
            })
            .catch(err => console.error('Error al cargar clientes', err));
    }, []);

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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
            <h2 className="text-xl font-bold">Registro de Transacción</h2>

            <select
                name="nombre_cliente"
                onChange={handleChange}
                value={formData.nombre_cliente}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Seleccionar cliente</option>
                {clientes.map((nombre, i) => (
                    <option key={i} value={nombre}>
                        {nombre}
                    </option>
                ))}
            </select>

            <input name="monto_ingreso" type="number" placeholder="Monto ingreso" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="cuenta_ingreso" type="text" placeholder="Cuenta ingreso" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="tipo_ingreso" type="text" placeholder="Tipo ingreso" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="monto_egreso" type="number" placeholder="Monto egreso" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="cuenta_egreso" type="text" placeholder="Cuenta egreso" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="tipo_egreso" type="text" placeholder="Tipo egreso" onChange={handleChange} className="w-full p-2 border rounded" />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Enviar transacción
            </button>
        </form>
    );
};

export default FormularioTransaccion;