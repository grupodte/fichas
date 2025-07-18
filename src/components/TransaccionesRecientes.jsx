// TransaccionesRecientes.jsx
export default function TransaccionesRecientes({ transacciones }) {
    const recientes = [...transacciones]
        .sort((a, b) => b.id - a.id)
        .slice(0, 10);

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Últimas Transacciones</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-600">
                        <th className="text-left">Fecha</th>
                        <th className="text-left">Cliente</th>
                        <th className="text-right">Ingreso</th>
                        <th className="text-right">Egreso</th>
                    </tr>
                </thead>
                <tbody>
                    {recientes.map((t) => (
                        <tr key={t.id} className="border-t">
                            <td>{t.fecha}</td>
                            <td>{t.nombre_cliente}</td>
                            <td className="text-right">{t.tipo_ingreso}</td>
                            <td className="text-right">{t.tipo_egreso}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
  