import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import {
    RefreshCcw,
    DollarSign,
    TrendingDown,
    BarChart3
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SHEET_URL =
    'https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/TRANSACCIONES';

const formatCurrency = (num) =>
    num.toLocaleString('es-UY', {
        style: 'currency',
        currency: 'UYU',
        maximumFractionDigits: 0,
    });

const StatCard = ({ title, value, Icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="w-6 h-6 text-gray-400" />
    </div>
);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        ingresos: 0,
        egresos: 0,
        transacciones: 0,
        ratio: 0,
    });
    const [monthly, setMonthly] = useState({});
    const [recientes, setRecientes] = useState([]);

    useEffect(() => {
        fetch(SHEET_URL)
            .then((res) => res.json())
            .then((data) => {
                const ingresos = data.reduce((acc, t) => {
                    const val = parseFloat(t['MONTO INGRESO']);
                    return acc + (isNaN(val) ? 0 : val);
                }, 0);

                const egresos = data.reduce((acc, t) => {
                    const val = parseFloat(t['MONTO EGRESO']);
                    return acc + (isNaN(val) ? 0 : val);
                }, 0);

                const ratio = egresos > 0 ? ingresos / egresos : 0;

                // Agrupar por mes
                const mensual = {};
                data.forEach((t) => {
                    if (!t.FECHA) return;
                    const [dd, mm, yyyy] = t.FECHA.split('/');
                    const mes = `${yyyy}-${mm}`;
                    if (!mensual[mes]) mensual[mes] = { ingresos: 0, egresos: 0 };

                    const ingreso = parseFloat(t['MONTO INGRESO']);
                    const egreso = parseFloat(t['MONTO EGRESO']);
                    if (!isNaN(ingreso)) mensual[mes].ingresos += ingreso;
                    if (!isNaN(egreso)) mensual[mes].egresos += egreso;
                });

                const ultimas = data
                    .filter((t) => t.FECHA)
                    .slice(-5)
                    .reverse();

                setMonthly(mensual);
                setRecientes(ultimas);
                setTotals({
                    ingresos,
                    egresos,
                    transacciones: data.length,
                    ratio,
                });
                setTransactions(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error al cargar transacciones:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6">Cargando...</div>;

    const labels = Object.keys(monthly).sort();
    const ingresosMensuales = labels.map((k) => monthly[k].ingresos);
    const egresosMensuales = labels.map((k) => monthly[k].egresos);

    return (
        <div className="p-6 min-h-screen flex justify-center">
            <div className="w-full max-w-[1440px] space-y-6">

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Transacciones" value={totals.transacciones} Icon={RefreshCcw} />
                    <StatCard title="Ingresos" value={formatCurrency(totals.ingresos)} Icon={DollarSign} />
                    <StatCard title="Egresos" value={formatCurrency(totals.egresos)} Icon={TrendingDown} />
                    <StatCard title="Ratio" value={`${totals.ratio.toFixed(2)}x`} Icon={BarChart3} />
                </div>

                <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">

                    {/* Actividad */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4">Actividad</h2>
                        <ul className="divide-y text-sm">
                            {recientes.map((t, idx) => {
                                const monto = parseFloat(t['MONTO INGRESO']) || -parseFloat(t['MONTO EGRESO']) || 0;
                                const esIngreso = monto >= 0;
                                return (
                                    <li key={idx} className="py-2 flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-700">{t['NOMBRE CLIENTE'] || 'Cliente'}</p>
                                            <p className="text-gray-400 text-xs">{t.FECHA}</p>
                                        </div>
                                        <div className={`font-semibold ${esIngreso ? 'text-green-600' : 'text-red-500'}`}>
                                            {formatCurrency(Math.abs(monto))}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {/* Vista general */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4">Vista general</h2>
                        {labels.length > 0 ? (
                            <div className="relative h-64">
                                <Line
                                    data={{
                                        labels,
                                        datasets: [
                                            {
                                                label: 'Ingresos',
                                                data: ingresosMensuales,
                                                borderColor: '#16a34a',
                                                backgroundColor: 'rgba(22,163,74,0.1)',
                                                tension: 0.3,
                                            },
                                            {
                                                label: 'Egresos',
                                                data: egresosMensuales,
                                                borderColor: '#dc2626',
                                                backgroundColor: 'rgba(220,38,38,0.1)',
                                                tension: 0.3,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'top' } },
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500">Sin datos suficientes para mostrar gráfico.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
