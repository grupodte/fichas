import { useTransacciones } from './hooks/useTransacciones';
import TotalesCard from './components/TotalesCard';
import FiltroDeTiempo from './components/FiltroDeTiempo';

const Dashboard = () => {
    const { transacciones, loading } = useTransacciones();

    if (loading) return <div className="p-6">Cargando...</div>;

    return (
        <div className="p-6 min-h-screen flex justify-center">
            <div className="w-full max-w-[900px] space-y-6">
                <FiltroDeTiempo />
                <TotalesCard transacciones={transacciones} />
                {/* Aquí irán los demás componentes */}
            </div>
        </div>
    );
};

export default Dashboard;
