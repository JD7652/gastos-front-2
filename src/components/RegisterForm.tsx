import React, { useState } from "react";
import api from "../services/api";

type RegisterFormProps = {
  onRegister?: () => void;
};

function RegisterForm({ onRegister }: RegisterFormProps) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [presupuesto, setPresupuesto] = useState<number>(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validar presupuesto antes de enviar
    if (presupuesto <= 0 || isNaN(presupuesto)) {
      setError("Por favor ingresa un presupuesto válido (mayor que 0).");
      return;
    }

    try {
      await api.post("/auth/register", {
        nombre,
        correo,
        contrasena,
        presupuesto, // ✅ se envía el valor real ingresado por el usuario
      });

      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setError("");
      setNombre("");
      setCorreo("");
      setContrasena("");
      setPresupuesto(0);

      if (onRegister) onRegister();
    } catch (err: any) {
      let backendMsg = "";
      if (err.response && err.response.data && err.response.data.message) {
        backendMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message;
      }
      setError(backendMsg || "No se pudo registrar. ¿El correo ya está en uso?");
      setSuccess("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto flex flex-col gap-6"
      style={{ minWidth: 320 }}
    >
      <h2 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">
        Registrarse
      </h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center font-semibold">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-semibold">
          {error}
        </div>
      )}

      {/* Nombre */}
      <label className="flex flex-col font-semibold text-sm gap-1">
        Nombre
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded-lg px-10 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="7" r="3" />
              <path d="M2 16c1.5-3 11.5-3 13 0" />
            </svg>
          </span>
        </div>
      </label>

      {/* Correo */}
      <label className="flex flex-col font-semibold text-sm gap-1">
        Correo
        <div className="relative">
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full border rounded-lg px-10 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="14" height="10" rx="2" />
              <path d="M2 4l7 6 7-6" />
            </svg>
          </span>
        </div>
      </label>

      {/* Contraseña */}
      <label className="flex flex-col font-semibold text-sm gap-1">
        Contraseña
        <div className="relative">
          <input
            type="password"
            placeholder="Contraseña fuerte"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            className="w-full border rounded-lg px-10 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="8" width="8" height="6" rx="1" />
              <path d="M7 8V6a2 2 0 1 1 4 0v2" />
            </svg>
          </span>
        </div>
      </label>

      {/* Presupuesto */}
      <label className="flex flex-col font-semibold text-sm gap-1">
        Presupuesto
        <div className="relative">
          <input
            type="number"
            placeholder="Ej. 5000"
            value={presupuesto}
            onChange={(e) => setPresupuesto(parseFloat(e.target.value))}
            required
            className="w-full border rounded-lg px-10 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            💰
          </span>
        </div>
      </label>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-2 rounded-lg font-bold shadow transition-all w-full"
      >
        Crear cuenta
      </button>
    </form>
  );
}

export default RegisterForm;
