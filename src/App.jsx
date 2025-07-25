import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import FormularioTransaccion from './FormularioTransaccion';
import Transacciones from './Transacciones';
import Dashboard from './Dashboard';
import Login from './Login';
import Layout from './Layout';
import EmpresaLayout from './EmpresaLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <>
      <main className="main-content">
        <Routes>
          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* LAYOUT PRINCIPAL PROTEGIDO */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={['superadmin', 'admin', 'empleado']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* RUTAS DENTRO DE UNA EMPRESA */}
            <Route
              path="empresa/:empresaId"
              element={
                <ProtectedRoute roles={['superadmin', 'admin', 'empleado']}>
                  <EmpresaLayout />
                </ProtectedRoute>
              }
            >
              {/* SOLO ADMIN Y SUPERADMIN PUEDEN REGISTRAR */}
              <Route
                path="registrar"
                element={
                  <ProtectedRoute roles={['superadmin', 'admin']}>
                    <FormularioTransaccion />
                  </ProtectedRoute>
                }
              />

              {/* SOLO ADMIN Y SUPERADMIN PUEDEN VER TRANSACCIONES COMPLETAS */}
              <Route
                path="transacciones"
                element={
                  <ProtectedRoute roles={['superadmin', 'admin']}>
                    <Transacciones />
                  </ProtectedRoute>
                }
              />

              {/* TODOS LOS ROLES TIENEN ACCESO AL DASHBOARD */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute roles={['superadmin', 'admin', 'empleado']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* VISTA POR DEFECTO SI NO SE SELECCIONA EMPRESA */}
            <Route index element={<div>Seleccione una empresa</div>} />
          </Route>
        </Routes>
      </main>

      {/* TOAST GLOBAL */}
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
