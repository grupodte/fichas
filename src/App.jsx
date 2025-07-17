import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar/Navbar'; // Ruta corregida con minúscula y relativa a src/
import FormularioTransaccion from './FormularioTransaccion';
import Dashboard from './Dashboard';
import Login from './Login';
import Layout from './Layout';

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<FormularioTransaccion />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
