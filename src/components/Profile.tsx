import React, { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import api from "../services/api";

interface User {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  foto?: string;
}

function Profile() {
  const [user, setUser] = useState<User>({
    id: "UUID-DEL-USUARIO", // ← Reemplaza o carga este valor dinámicamente
    nombre: "Juan Pérez",
    correo: "juan@ejemplo.com",
    telefono: "+1234567890",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar cambio de foto
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar cambio de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Subir foto al backend
  const handlePhotoUpload = async () => {
    if (!photo) return;

    const formData = new FormData();
    formData.append("file", photo);

    try {
      setLoading(true);
      await api.post("/usuarios/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Foto subida correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error al subir la foto");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios del perfil
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/usuarios/${user.id}`, {
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
      });
      setMessage("Perfil actualizado correctamente");
    } catch (error) {
      setMessage("Error al actualizar el perfil");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Activar input de archivo
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Mi Perfil</h2>

        <div className="flex flex-col items-center mb-6">
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 cursor-pointer hover:opacity-80"
            onClick={handlePhotoClick}
          >
            <img
              src={
                photoPreview ||
                user.foto ||
                "https://via.placeholder.com/150?text=Foto"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
            accept="image/jpeg,image/png,image/gif"
          />
          {photo && (
            <button
              onClick={handlePhotoUpload}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Subir nueva foto"}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={user.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="email"
            name="correo"
            value={user.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="telefono"
            value={user.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
