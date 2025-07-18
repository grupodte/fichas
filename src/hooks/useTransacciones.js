import { useEffect, useState } from 'react';

export const useTransacciones = () => {
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const url = import.meta.env.VITE_API_URL_TRANSACCIONES;
                console.log('🔍 Fetching transacciones from:', url);

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('✅ Transacciones recibidas:', data);

                setTransacciones(data.transacciones || []);
            } catch (err) {
                console.error('❌ Error al cargar transacciones:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransacciones();
    }, []);

    return { transacciones, loading };
};
