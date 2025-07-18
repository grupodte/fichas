// TotalesCard.jsx
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const formatCurrency = (amount) =>
    amount.toLocaleString('es-UY', {
        style: 'currency',
        currency: 'UYU',
        maximumFractionDigits: 0,
    });

export default function TotalesCard({ transacciones }) {
    const stats = {
        usd: { ingreso: 0, egreso: 0 },
        pesos: { ingreso: 0, egreso: 0 },
    };

    transacciones.forEach((t) => {
        const cuentaIng = (t.cuenta_ingreso || '').toLowerCase();
        const cuentaEgr = (t.cuenta_egreso || '').toLowerCase();

        const ingreso = parseFloat(t.tipo_ingreso) || 0;
        const egreso = parseFloat(t.tipo_egreso) || 0;

        if (cuentaIng.includes('usd')) {
            stats.usd.ingreso += ingreso;
        } else {
            stats.pesos.ingreso += ingreso;
        }

        if (cuentaEgr.includes('usd')) {
            stats.usd.egreso += egreso;
        } else {
            stats.pesos.egreso += egreso;
        }
    });

    const Card = ({ title, value, icon, color }) => (
        <div className={`flex-1 bg-white rounded-xl p-4 shadow border-l-4 ${color}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-xl font-bold">{formatCurrency(value)}</p>
                </div>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
                title="Ingreso USD"
                value={stats.usd.ingreso}
                icon={<TrendingUp className="text-green-500" />}
                color="border-green-500"
            />
            <Card
                title="Egreso USD"
                value={stats.usd.egreso}
                icon={<TrendingDown className="text-red-500" />}
                color="border-red-500"
            />
            <Card
                title="Ingreso PESOS"
                value={stats.pesos.ingreso}
                icon={<TrendingUp className="text-green-500" />}
                color="border-green-500"
            />
            <Card
                title="Egreso PESOS"
                value={stats.pesos.egreso}
                icon={<TrendingDown className="text-red-500" />}
                color="border-red-500"
            />
        </div>
    );
}
