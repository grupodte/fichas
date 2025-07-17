import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import MagicBento from './components/MagicBento/MagicBento'; // Suponiendo que guardaste el código en este archivo
import { useClientes } from './hooks/useClientes';
import { useCuentas } from './hooks/useCuentas';
import { useTransacciones } from './hooks/useTransacciones';
import GraficoTransacciones from './components/GraficoTransacciones';

const Dashboard = () => {
    const { clientes, loading: loadingClientes } = useClientes();
    const { cuentas, loading: loadingCuentas } = useCuentas();
    const { transacciones, loading: loadingTransacciones } = useTransacciones();

    const [stats, setStats] = useState({
        totalIngresos: 0,
        totalEgresos: 0,
        saldoTotal: 0,
        topCliente: { nombre: 'N/A', monto: 0 },
        totalTransacciones: 0
    });

    useEffect(() => {
        if (!loadingTransacciones) {
            const totalIngresos = transacciones.reduce((acc, t) => acc + (parseFloat(t.monto_ingreso) || 0), 0);
            const totalEgresos = transacciones.reduce((acc, t) => acc + (parseFloat(t.monto_egreso) || 0), 0);
            const totalTransacciones = transacciones.length;

            // Aquí puedes agregar la lógica para calcular el topCliente

            setStats({
                totalIngresos,
                totalEgresos,
                saldoTotal: totalIngresos - totalEgresos,
                topCliente: { nombre: 'Cliente Ejemplo', monto: 1500 }, // Placeholder
                totalTransacciones
            });
        }
    }, [transacciones, loadingTransacciones]);

    const cardData = [
        {
            title: 'Ingresos Totales',
            value: `$${stats.totalIngresos.toFixed(2)}`,
            label: 'Mes Actual'
        },
        {
            title: 'Egresos Totales',
            value: `$${stats.totalEgresos.toFixed(2)}`,
            label: 'Mes Actual'
        },
        {
            title: 'Saldo Total',
            value: `$${stats.saldoTotal.toFixed(2)}`,
            label: 'General'
        },
        {
            title: 'Top Cliente',
            value: stats.topCliente.nombre,
            description: `Monto: $${stats.topCliente.monto}`,
            label: 'Ranking'
        },
        {
            title: 'Transacciones Totales',
            value: stats.totalTransacciones,
            label: 'General'
        }
    ];

    return (
        <div>
            <MagicBento cardData={cardData} />
            <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-4">Transacciones de la última semana</h2>
                <GraficoTransacciones transacciones={transacciones} />
            </div>
        </div>
    );
};

export default Dashboard;