import { useTransacciones } from './hooks/useTransacciones';
import TotalesCard from './components/TotalesCard';
import FiltroDeTiempo from './components/FiltroDeTiempo';
import TransaccionesRecientes from './components/TransaccionesRecientes';
import RankingClientes from './components/RankingClientes';
import AgrupacionPorCuenta from './components/AgrupacionPorCuenta';

const Dashboard = () => {
    const { transacciones, loading } = useTransacciones();

    if (loading) return <div className="p-6 text-center text-gray-500">Cargando...</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-10">
                <h1 className="text-2xl font-bold text-center text-gray-800">Dashboard Financiero</h1>

                <FiltroDeTiempo />
                <TotalesCard transacciones={transacciones} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RankingClientes transacciones={transacciones} />
                    <TransaccionesRecientes transacciones={transacciones} />
                </div>

                <AgrupacionPorCuenta transacciones={transacciones} />
            </div>
        </div>
    );
};

export default Dashboard;
