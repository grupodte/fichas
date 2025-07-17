import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [secretKey, setSecretKey] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (secretKey === import.meta.env.VITE_SECRET_KEY) {
            localStorage.setItem("secret-key-authenticated", "true");
            navigate("/");
        } else {
            alert("Clave secreta incorrecta");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('/fondo.jpg')] bg-cover bg-center">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl max-w-sm w-full">
                <h1 className="text-2xl font-semibold text-white mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="secret-key"
                            className="block text-sm font-medium text-white mb-1"
                        >
                            Clave secreta
                        </label>
                        <input
                            type="password"
                            id="secret-key"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-md transition"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
