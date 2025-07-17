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
            alert("Invalid secret key");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="secret-key">Secret Key:</label>
                <input
                    type="password"
                    id="secret-key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
