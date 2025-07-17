import { useEffect, useState } from 'react';

const SHEET_URL = 'https://opensheet.elk.sh/1hxtoDqUNsVKj_R0gLV1ohb3LEf2fIjlXo2h-ghmHVU4/TRANSACCIONES';

const SummaryCard = ({ title, value }) => (
    <div className="bg-white rounded-lg p-6 shadow border-l-4 border-blue-500">
        <p className="text-blue-600 font-medium text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
    </div>
);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(SHEET_URL)
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6">Cargando datos...</div>;

    return (
        <div className="p-6  min-h-screen">
            <h1 className="text-2xl text-white font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard title="Total de Transacciones" value={transactions.length} />
            </div>
        </div>
    );
};

export default Dashboard;
