const TotalesCard = ({ transacciones }) => {
    const calcularTotales = () => {
        let ingresosUYU = 0, ingresosUSD = 0;
        let egresosUYU = 0, egresosUSD = 0;

        transacciones.forEach(t => {
            const cuentaIngreso = t.cuenta_ingreso?.toUpperCase() || '';
            const cuentaEgreso = t.cuenta_egreso?.toUpperCase() || '';

            const montoIngreso = parseFloat(t.tipo_ingreso);
            const montoEgreso = parseFloat(t.tipo_egreso);

            if (!isNaN(montoIngreso)) {
                if (cuentaIngreso.includes("PESO")) ingresosUYU += montoIngreso;
                else ingresosUSD += montoIngreso;
            }

            if (!isNaN(montoEgreso)) {
                if (cuentaEgreso.includes("PESO")) egresosUYU += montoEgreso;
                else egresosUSD += montoEgreso;
            }
        });

        return {
            ingresosUYU,
            egresosUYU,
            saldoUYU: ingresosUYU - egresosUYU,
            ingresosUSD,
            egresosUSD,
            saldoUSD: ingresosUSD - egresosUSD
        };
    };

    const {
        ingresosUYU, egresosUYU, saldoUYU,
        ingresosUSD, egresosUSD, saldoUSD
    } = calcularTotales();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-2">Pesos Uruguayos (UYU)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Ingresos" value={`$${ingresosUYU.toFixed(0)}`} Icon={ArrowUp} colorClass="text-green-600" />
                    <StatCard title="Egresos" value={`$${egresosUYU.toFixed(0)}`} Icon={ArrowDown} colorClass="text-red-600" />
                    <StatCard title="Saldo" value={`$${saldoUYU.toFixed(0)}`} Icon={DollarSign} colorClass={saldoUYU >= 0 ? "text-blue-600" : "text-orange-500"} />
                </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">Dólares (USD)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Ingresos" value={`$${ingresosUSD.toFixed(2)}`} Icon={ArrowUp} colorClass="text-green-600" />
                    <StatCard title="Egresos" value={`$${egresosUSD.toFixed(2)}`} Icon={ArrowDown} colorClass="text-red-600" />
                    <StatCard title="Saldo" value={`$${saldoUSD.toFixed(2)}`} Icon={DollarSign} colorClass={saldoUSD >= 0 ? "text-blue-600" : "text-orange-500"} />
                </div>
            </div>
        </div>
    );
};
