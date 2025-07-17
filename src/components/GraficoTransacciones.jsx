import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoTransacciones = ({ transacciones }) => {
    const data = transacciones.reduce((acc, t) => {
        const fecha = new Date(t.fecha).toLocaleDateString('es-UY');
        if (!acc[fecha]) {
            acc[fecha] = { fecha, ingresos: 0, egresos: 0 };
        }
        acc[fecha].ingresos += parseFloat(t.monto_ingreso || 0);
        acc[fecha].egresos += parseFloat(t.monto_egreso || 0);
        return acc;
    }, {});

    const chartData = Object.values(data);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#82ca9d" name="Ingresos" />
                <Bar dataKey="egresos" fill="#8884d8" name="Egresos" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GraficoTransacciones;
