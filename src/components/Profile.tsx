import { useState } from "react";
import api from "../services/api";

export default function Profile() {
  const userId = localStorage.getItem("userId");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    localStorage.getItem("profilePic") || "https://via.placeholder.com/150"
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // previsualizar
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      alert("Selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", selectedFile);

    try {
      setIsUploading(true);
      const response = await api.post(`/usuarios/${userId}/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const nuevaFoto = response.data.foto;

      // guardar en localStorage
      localStorage.setItem("profilePic", nuevaFoto);

      alert("✅ Foto actualizada con éxito.");
      window.location.reload(); // recargar para reflejar la nueva imagen
    } catch (err) {
      console.error(err);
      alert("⚠️ Error al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300">
        <img
          src={preview}
          alt="Foto de perfil"
          className="w-full h-full object-cover"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block mt-4 text-sm"
      />

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`px-6 py-2 rounded-lg text-white font-bold transition ${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isUploading ? "Subiendo..." : "Subir Foto"}
      </button>
    </div>
  );
}
