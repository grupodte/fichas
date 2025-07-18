import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, Icon, colorClass }) => (
    <div className={`bg-white p-5 rounded-xl shadow-md flex items-center justify-between ${colorClass}`}>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="w-6 h-6 text-gray-400" />
    </div>
);

const TotalesCard = ({ transacciones }) => {
    const calcularTotales = () => {
        let ingresos = 0;
        let egresos = 0;

        transacciones.forEach(t => {
            if (t.monto_ingreso && !isNaN(parseFloat(t.monto_ingreso))) {
                ingresos += parseFloat(t.monto_ingreso);
            }
            if (t.monto_egreso && !isNaN(parseFloat(t.monto_egreso))) {
                egresos += parseFloat(t.monto_egreso);
            }
        });

        const saldo = ingresos - egresos;
        return { ingresos, egresos, saldo };
    };

    const { ingresos, egresos, saldo } = calcularTotales();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Ingresos Totales"
                value={`$${ingresos.toFixed(2)}`}
                Icon={ArrowUp}
                colorClass="text-green-600"
            />
            <StatCard
                title="Egresos Totales"
                value={`$${egresos.toFixed(2)}`}
                Icon={ArrowDown}
                colorClass="text-red-600"
            />
            <StatCard
                title="Saldo Neto"
                value={`$${saldo.toFixed(2)}`}
                Icon={DollarSign}
                colorClass={saldo >= 0 ? "text-blue-600" : "text-orange-500"}
            />
        </div>
    );
};

export default TotalesCard;
