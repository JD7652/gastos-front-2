import { useState, useEffect } from "react";
import api from "../services/api"; // Asegúrate de tener configurado Axios aquí

export default function Profile() {
  const userId = localStorage.getItem("userId");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    localStorage.getItem("profilePic") || "https://via.placeholder.com/150"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "",
    correo: "",
  });

  // ✅ Obtener datos del usuario al cargar
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/usuarios/${userId}`);
        const { nombre, correo, foto } = response.data;
        setUserData({ nombre, correo });
        if (foto) {
          setPreview(foto);
          localStorage.setItem("profilePic", foto);
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    };
    fetchUser();
  }, [userId]);

  // ✅ Previsualización de imagen seleccionada
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Subir imagen al backend
  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      alert("Selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      const response = await api.post(`/usuarios/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const nuevaFoto = response.data.foto;
      setPreview(nuevaFoto);
      localStorage.setItem("profilePic", nuevaFoto);
      alert("✅ Foto actualizada con éxito.");
    } catch (err) {
      console.error("Error al subir imagen:", err);
      alert("⚠️ Error al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Guardar nombre y correo
  const handleSave = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);
      await api.patch(`/usuarios/${userId}`, {
        nombre: userData.nombre,
        correo: userData.correo,
      });
      alert("✅ Datos actualizados con éxito.");
    } catch (err) {
      console.error("Error al guardar datos:", err);
      alert("⚠️ Error al actualizar datos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[420px] flex flex-col items-center gap-6">
        {/* Imagen de perfil */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400">
          <img
            src={preview}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input para subir foto */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block text-sm text-gray-600"
        />

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition w-full ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Subiendo..." : "Subir Foto"}
        </button>

        {/* Campos de texto */}
        <div className="w-full mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Nombre</label>
            <input
              type="text"
              value={userData.nombre}
              onChange={(e) =>
                setUserData({ ...userData, nombre: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Correo</label>
            <input
              type="email"
              value={userData.correo}
              onChange={(e) =>
                setUserData({ ...userData, correo: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tu correo"
            />
          </div>
        </div>

        {/* Botón guardar cambios */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`mt-4 px-6 py-2 rounded-lg text-white font-semibold transition w-full ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
