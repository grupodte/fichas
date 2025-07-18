import { useEffect, useState } from 'react';
import { isWithinInterval } from 'date-fns';
import { RefreshCcw } from 'lucide-react';
import FiltroDeTiempo from './components/FiltroDeTiempo';
import { useDateRange } from './context/DateRangeContext';

const SHEET_URL =
    'https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/TRANSACCIONES';

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
    const [totalTransacciones, setTotalTransacciones] = useState(0);
    const [ultimasTransacciones, setUltimasTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const { dateRange } = useDateRange();

    const parseFecha = (fecha) => {
        const [dd, mm, yyyy] = fecha.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
    };

    useEffect(() => {
        fetch(SHEET_URL)
            .then((res) => res.json())
            .then((data) => {
                const filtradas = data.filter((t) => {
                    if (!t.FECHA) return false;
                    const fecha = parseFecha(t.FECHA);
                    return isWithinInterval(fecha, {
                        start: dateRange.from,
                        end: dateRange.to,
                    });
                });

                setTotalTransacciones(filtradas.length);
                setUltimasTransacciones(filtradas.slice(-10).reverse());
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error al cargar transacciones:', err);
                setLoading(false);
            });
    }, [dateRange]);

    if (loading) return <div className="p-6">Cargando...</div>;

    return (
        <div className="p-6 min-h-screen flex justify-center">
            <div className="w-full max-w-[900px] space-y-6">
                <FiltroDeTiempo />

                <StatCard
                    title="Total de transacciones en el rango seleccionado"
                    value={totalTransacciones}
                    Icon={RefreshCcw}
                />

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Últimas transacciones</h2>
                    {ultimasTransacciones.length === 0 ? (
                        <p className="text-gray-500">No hay transacciones en este rango.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="py-2">Fecha</th>
                                    <th className="py-2">Cliente</th>
                                    <th className="py-2">Ingreso</th>
                                    <th className="py-2">Egreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ultimasTransacciones.map((t, idx) => (
                                    <tr key={idx} className="border-b last:border-0">
                                        <td className="py-2">{t.FECHA}</td>
                                        <td className="py-2">{t['NOMBRE CLIENTE'] || '-'}</td>
                                        <td className="py-2 text-green-600">{t['MONTO INGRESO'] || '-'}</td>
                                        <td className="py-2 text-red-600">{t['MONTO EGRESO'] || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
