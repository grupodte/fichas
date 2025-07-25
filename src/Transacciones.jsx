import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from './config/supabaseClient';
import { toast } from 'react-hot-toast';

const Transacciones = () => {
    const { empresaId } = useOutletContext();
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransacciones = async () => {
            if (!empresaId) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('transacciones')
                    .select(`
                        id,
                        fecha,
                        monto_ingreso,
                        monto_egreso,
                        descripcion,
                        clientes ( nombre ),
                        categorias_resultado ( nombre )
                    `)
                    .eq('empresa_id', empresaId)
                    .order('fecha', { ascending: false });

                if (error) throw error;
                setTransacciones(data || []);
            } catch (err) {
                toast.error('Error al cargar las transacciones');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransacciones();
    }, [empresaId]);

    if (loading) {
        return <div className="p-4">Cargando transacciones...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Transacciones</h1>
            <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30">
                <table className="w-full text-white">
                    <thead>
                        <tr className="border-b border-white/30">
                            <th className="text-left p-2">Fecha</th>
                            <th className="text-left p-2">Cliente</th>
                            <th className="text-left p-2">Categoría</th>
                            <th className="text-left p-2">Descripción</th>
                            <th className="text-right p-2">Ingreso</th>
                            <th className="text-right p-2">Egreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map((t) => (
                            <tr key={t.id} className="border-b border-white/20">
                                <td className="p-2">{new Date(t.fecha).toLocaleDateString()}</td>
                                <td className="p-2">{t.clientes?.nombre || 'N/A'}</td>
                                <td className="p-2">{t.categorias_resultado?.nombre || 'N/A'}</td>
                                <td className="p-2">{t.descripcion}</td>
                                <td className="p-2 text-green-400 text-right">{t.monto_ingreso?.toFixed(2)}</td>
                                <td className="p-2 text-red-400 text-right">{t.monto_egreso?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transacciones;
