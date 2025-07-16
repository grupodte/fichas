// App.jsx
import FormularioTransaccion from './FormularioTransaccion';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <FormularioTransaccion />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
