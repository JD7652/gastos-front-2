import React, { useState } from 'react';
import api from '../services/api.ts';
import ErrorMessage from './ErrorMessage';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
    const [credentials, setCredentials] = useState({
        correo: '',
        contrasena: '',
    });
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (credentials.correo === '' || credentials.contrasena === '') {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await api.post('/auth/login', {
                correo: credentials.correo,
                contrasena: credentials.contrasena,
            });

            const token = response.data.token;

            localStorage.setItem('authToken', token);
            setIsLoggedIn(true);

            console.log('✅ ¡Inicio de sesión exitoso! Token guardado.');
            window.location.reload();

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error de conexión. Verifica el servidor.';
            setError(`Fallo en el login: ${errorMessage}`);
            console.error('Error de login:', err.response?.data || err.message);
        }
    };

    if (isLoggedIn) {
        return (
            <div className="text-center p-8 bg-white shadow rounded-lg">
                <p className="text-xl text-green-600 font-bold">Sesión activa.</p>
                <button
                    onClick={() => { localStorage.removeItem('authToken'); setIsLoggedIn(false); window.location.reload(); }}
                    className="mt-4 bg-red-500 text-white p-2 rounded"
                >Cerrar Sesión</button>
            </div>
        );
    }

    return (
        <form className="space-y-5 p-8 bg-white shadow rounded-lg w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-3xl font-black text-blue-600">
                Iniciar Sesión
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="correo" className="text-xl">Correo:</label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    placeholder="Tu correo electrónico"
                    className="bg-slate-100 p-3 rounded-lg border"
                    onChange={handleChange}
                    value={credentials.correo}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="contrasena" className="text-xl">Contraseña:</label>
                <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    placeholder="Tu contraseña"
                    className="bg-slate-100 p-3 rounded-lg border"
                    onChange={handleChange}
                    value={credentials.contrasena}
                    required
                />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-3 text-white uppercase font-bold rounded-lg hover:bg-blue-700 transition-colors"
                value="Iniciar Sesión"
            />

            <p className="text-center text-gray-600 mt-4">
                ¿No tienes cuenta? <button type="button" onClick={onSwitchToRegister} className="text-blue-600 font-semibold hover:underline">Regístrate aquí</button>
            </p>
        </form>
    );
}