import { useState } from 'react';
import { useTransacciones } from './hooks/useTransacciones';

const DashboardSimple = () => {
    const { transacciones, loading } = useTransacciones();
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');

    const transaccionesFiltradas = transacciones.filter(t => {
        return (
            (!filtroCliente || t.nombre_cliente.toLowerCase().includes(filtroCliente.toLowerCase())) &&
            (!filtroCategoria || t.categoria_resultado?.toLowerCase().includes(filtroCategoria.toLowerCase())) &&
            (!filtroFecha || t.fecha === filtroFecha)
        );
    });

    if (loading) return <p className="p-4">Cargando transacciones...</p>;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Dashboard de Transacciones</h2>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    className="border px-3 py-2 rounded-md"
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Buscar por categoría..."
                    className="border px-3 py-2 rounded-md"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                />
                <input
                    type="date"
                    className="border px-3 py-2 rounded-md"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                />
            </div>

            {/* Tabla */}
            <table className="w-full text-sm border">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Fecha</th>
                        <th className="p-2 border">Cliente</th>
                        <th className="p-2 border">Ingreso</th>
                        <th className="p-2 border">Egreso</th>
                        <th className="p-2 border">Categoría</th>
                        <th className="p-2 border">Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {transaccionesFiltradas.map((t, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="p-2 border">{t.fecha}</td>
                            <td className="p-2 border">{t.nombre_cliente}</td>
                            <td className="p-2 border">{t.tipo_ingreso}</td>
                            <td className="p-2 border">{t.tipo_egreso}</td>
                            <td className="p-2 border">{t.categoria_resultado}</td>
                            <td className="p-2 border">{t.resultado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardSimple;
