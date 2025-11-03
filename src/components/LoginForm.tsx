import React, { useState } from "react";
import api from "../services/api";

type LoginFormProps = {
    onLogin?: () => void;
};

function LoginForm({ onLogin }: LoginFormProps) {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", { correo, contrasena });
            localStorage.setItem("authToken", response.data.token);
            setError("");
            if (onLogin) onLogin();
        } catch (err) {
            setError("Credenciales incorrectas o error de red");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto flex flex-col gap-6"
            style={{ minWidth: 320 }}
        >
            <h2 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">
                Iniciar Sesión
            </h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-semibold">
                    {error}
                </div>
            )}
            <label className="flex flex-col font-semibold text-sm gap-1">
                Correo
                <div className="relative">
                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        required
                        className="w-full border rounded-lg px-10 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="14" height="10" rx="2" /><path d="M2 4l7 6 7-6" /></svg>
                    </span>
                </div>
            </label>
            <label className="flex flex-col font-semibold text-sm gap-1">
                Contraseña
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contrasena}
                        onChange={e => setContrasena(e.target.value)}
                        required
                        className="w-full border rounded-lg px-10 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="8" width="8" height="6" rx="1" /><path d="M7 8V6a2 2 0 1 1 4 0v2" /></svg>
                    </span>
                </div>
            </label>
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-2 rounded-lg font-bold shadow transition-all w-full"
            >
                Entrar
            </button>
        </form>
    );
}

export default LoginForm;