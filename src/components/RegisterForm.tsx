import React, { useState } from 'react';
import api from '../services/api';
import ErrorMessage from './ErrorMessage';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
    const [credentials, setCredentials] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        presupuesto: '0',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage('');

        if (Object.values(credentials).some(val => val === '')) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await api.post('/auth/register', {
                nombre: credentials.nombre,
                correo: credentials.correo,
                contrasena: credentials.contrasena,
                presupuesto: parseFloat(credentials.presupuesto),
            });

            setSuccessMessage('Usuario creado con éxito. ¡Redirigiendo a Login...');

            setTimeout(() => {
                onSwitchToLogin();
            }, 1000);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error de conexión. Inténtalo más tarde.';
            setError(`Fallo en el registro: ${errorMessage}`);
            console.error('Error de registro:', err.response?.data || err.message);
        }
    };

    return (
        <form className="space-y-5 p-8 bg-white shadow rounded-lg w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-3xl font-black text-blue-600">
                Crear Cuenta
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <p className="text-center text-green-600 font-semibold">{successMessage}</p>}


            <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-xl">Nombre:</label>
                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" className="bg-slate-100 p-3 rounded-lg border" onChange={handleChange} value={credentials.nombre} required />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="correo" className="text-xl">Correo:</label>
                <input type="email" id="correo" name="correo" placeholder="Tu correo" className="bg-slate-100 p-3 rounded-lg border" onChange={handleChange} value={credentials.correo} required />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="contrasena" className="text-xl">Contraseña:</label>
                <input type="password" id="contrasena" name="contrasena" placeholder="Contraseña segura" className="bg-slate-100 p-3 rounded-lg border" onChange={handleChange} value={credentials.contrasena} required />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="presupuesto" className="text-xl">Presupuesto Inicial:</label>
                <input type="number" id="presupuesto" name="presupuesto" placeholder="Ej. 1000" className="bg-slate-100 p-3 rounded-lg border" onChange={handleChange} value={credentials.presupuesto} required />
            </div>

            <input
                type="submit"
                className="bg-green-600 cursor-pointer w-full p-3 text-white uppercase font-bold rounded-lg hover:bg-green-700 transition-colors"
                value="Registrarme"
            />

            <p className="text-center text-gray-600 mt-4">
                ¿Ya tienes cuenta? <button type="button" onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">Inicia Sesión</button>
            </p>
        </form>
    );
}