// src/hooks/useTransacciones.js
import { useState, useEffect } from 'react';

export function useTransacciones() {
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // La URL de tu hoja de TRANSACCIONES
        fetch('https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/TRANSACCIONES')
            .then(res => res.json())
            .then(data => {
                setTransacciones(data);
            })
            .finally(() => setLoading(false));
    }, []);

    return { transacciones, loading };
}