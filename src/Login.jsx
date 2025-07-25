import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn({ email, password });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('¡Bienvenido!');
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('/fondo.jpg')] bg-cover bg-center">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl max-w-sm w-full">
                <h1 className="text-2xl font-semibold text-white mb-6 text-center">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-white mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-white mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition disabled:opacity-50"
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
