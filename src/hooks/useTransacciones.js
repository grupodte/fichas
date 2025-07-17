// src/hooks/useTransacciones.js
import { useState, useEffect } from 'react';

// opensheet.elk.sh convierte los nombres de columna a minúsculas y sin espacios.
// "MONTO INGRESO" se convierte en "monto_ingreso".
const SHEET_URL = 'https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/TRANSACCIONES';

export function useTransacciones() {
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(SHEET_URL)
            .then(res => res.json())
            .then(data => {
                // Filtramos filas vacías que a veces aparecen
                const a_transactions = data.filter(row => row.fecha && row.fecha.trim() !== '');
                setTransacciones(a_transactions);
            })
            .catch(error => console.error("Error fetching transactions:", error))
            .finally(() => setLoading(false));
    }, []);

    return { transacciones, loading };
}