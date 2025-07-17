
import { useState, useEffect } from 'react';

export function useCuentas() {
    const [cuentas, setCuentas] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL_CUENTAS)
            .then(res => res.json())
            .then(data => {
                const cuentasConTipos = data.map(row => {
                    const tipos = Object.values(row).slice(1).filter(Boolean);
                    return { cuenta: row["CUENTA"], tipos };
                });
                setCuentas(cuentasConTipos);
            });
    }, []);

    return cuentas;
}
