import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar/Navbar'; // Ruta corregida con minúscula y relativa a src/
import FormularioTransaccion from './FormularioTransaccion';
import MagicBento from './components/MagicBento/MagicBento';

import { useTransacciones } from './hooks/useTransacciones';

const DashboardPage = () => {
  const { transacciones, loading } = useTransacciones();

  const totalIngresos = transacciones.reduce((sum, t) => sum + (parseFloat(t.monto_ingreso) || 0), 0);
  const totalEgresos = transacciones.reduce((sum, t) => sum + (parseFloat(t.monto_egreso) || 0), 0);

  const cardData = [
    {
      color: "#060010",
      title: "Ingresos Totales",
      description: `$${totalIngresos.toFixed(2)}`,
      label: "Acumulado",
    },
    {
      color: "#060010",
      title: "Egresos Totales",
      description: `$${totalEgresos.toFixed(2)}`,
      label: "Acumulado",
    },
    {
      color: "#060010",
      title: "Balance",
      description: `$${(totalIngresos - totalEgresos).toFixed(2)}`,
      label: "General",
    },
    {
      color: "#060010",
      title: "Transacciones",
      description: loading ? 'Cargando...' : `${transacciones.length} registradas`,
      label: "Conteo",
    }
  ];

  return <MagicBento cardData={cardData} />;
}

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FormularioTransaccion />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
          },
        }}
      />
    </>
  );
}

export default App;
