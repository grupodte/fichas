
import { useState, useEffect } from 'react';

export function useClientes() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL_CLIENTES)
            .then(res => res.json())
            .then(data => {
                const lista = data
                    .filter(item => item["NOMBRE "]?.trim())
                    .map(item => ({
                        nombre: item["NOMBRE "].trim(),
                        numero: item["NUM"]?.trim() || ''
                    }));
                setClientes(lista);
            });
    }, []);

    return clientes;
}
