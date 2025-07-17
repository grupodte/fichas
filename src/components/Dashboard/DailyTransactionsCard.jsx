// src/components/DailyTransactionsCard.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './DailyTransactionsCard.css';

const DailyTransactionsCard = ({ totalCount, chartData }) => {
    return (
        <div className="daily-tx-card">
            <div className="header">
                <h2 className="title">Transacciones Totales</h2>
                <p className="count">{totalCount}</p>
            </div>
            <div className="chart-container">
                <p className="chart-title">Actividad (Últimos 7 días)</p>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="transacciones" stroke="#a78bfa" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DailyTransactionsCard;