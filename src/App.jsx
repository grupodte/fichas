import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import FormularioTransaccion from './FormularioTransaccion';
import Transacciones from './Transacciones';
import Dashboard from './Dashboard';
import Login from './Login';
import Layout from './Layout';
import EmpresaLayout from './EmpresaLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="empresa/:empresaId" element={<EmpresaLayout />}>
              <Route path="registrar" element={<FormularioTransaccion />} />
              <Route path="transacciones" element={<Transacciones />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route index element={<div>Seleccione una empresa</div>} />
          </Route>
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
