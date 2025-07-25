import { useEffect, useState } from 'react';
import { supabase } from './config/supabaseClient';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, Icon, color }) => (
    <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30 text-white">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-white/80">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
    </div>
);

const Dashboard = () => {
    const { empresaId } = useOutletContext();
    const [stats, setStats] = useState({
        totalIngresos: 0,
        totalEgresos: 0,
        balance: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!empresaId) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('transacciones')
                    .select('monto_ingreso, monto_egreso')
                    .eq('empresa_id', empresaId);

                if (error) throw error;

                const totalIngresos = data.reduce((acc, t) => acc + (t.monto_ingreso || 0), 0);
                const totalEgresos = data.reduce((acc, t) => acc + (t.monto_egreso || 0), 0);
                const balance = totalIngresos - totalEgresos;

                setStats({ totalIngresos, totalEgresos, balance });
            } catch (err) {
                toast.error('Error al cargar los datos del dashboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [empresaId]);

    if (loading) {
        return <div className="p-4 text-white">Cargando dashboard...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Ingresos"
                    value={`$${stats.totalIngresos.toFixed(2)}`}
                    Icon={ArrowUp}
                    color="text-green-400"
                />
                <StatCard
                    title="Total Egresos"
                    value={`$${stats.totalEgresos.toFixed(2)}`}
                    Icon={ArrowDown}
                    color="text-red-400"
                />
                <StatCard
                    title="Balance"
                    value={`$${stats.balance.toFixed(2)}`}
                    Icon={DollarSign}
                    color="text-blue-400"
                />
            </div>
        </div>
    );
};

export default Dashboard;
