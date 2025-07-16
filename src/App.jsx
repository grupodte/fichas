import FormularioTransaccion from './FormularioTransaccion';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <FormularioTransaccion />

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
