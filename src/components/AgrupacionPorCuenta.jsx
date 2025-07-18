// AgrupacionPorCuenta.jsx
export default function AgrupacionPorCuenta({ transacciones }) {
    const cuentas = {};

    for (let t of transacciones) {
        const ingreso = parseFloat(t.tipo_ingreso) || 0;
        const egreso = parseFloat(t.tipo_egreso) || 0;

        cuentas[t.cuenta_ingreso] = (cuentas[t.cuenta_ingreso] || 0) + ingreso;
        cuentas[t.cuenta_egreso] = (cuentas[t.cuenta_egreso] || 0) + egreso;
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Agrupación por Cuenta</h3>
            <ul className="text-sm">
                {Object.entries(cuentas)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cuenta, total]) => (
                        <li key={cuenta} className="flex justify-between border-t py-1">
                            <span>{cuenta}</span>
                            <span className="font-semibold">{total.toLocaleString('es-UY')}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
  