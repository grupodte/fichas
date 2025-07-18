// RankingClientes.jsx
export default function RankingClientes({ transacciones }) {
    const ranking = transacciones.reduce((acc, t) => {
        const total = (parseFloat(t.tipo_ingreso) || 0) + (parseFloat(t.tipo_egreso) || 0);
        acc[t.nombre_cliente] = (acc[t.nombre_cliente] || 0) + total;
        return acc;
    }, {});

    const top = Object.entries(ranking)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Ranking Clientes</h3>
            <ul className="text-sm">
                {top.map(([cliente, total]) => (
                    <li key={cliente} className="flex justify-between border-t py-1">
                        <span>{cliente}</span>
                        <span className="font-semibold">{total.toLocaleString('es-UY')}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
  