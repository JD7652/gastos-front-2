import { useState, useEffect } from "react";
import AuthPanel from "./components/AuthPanel";
import GastosForm from "./components/GastosForm";
import GastosList, { type Gasto } from "./components/GastosList";
import Modal from "react-modal";
import PresupuestoGrafica from "./components/PresupuestoGrafica";
import Profile from "./components/Profile"; // 👈 Asegúrate de tener este componente
import api from "./services/api";

Modal.setAppElement("#root");

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authToken") !== null
  );

  const [budget, setBudget] = useState<number | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState<number | null>(null);
  const [gastoEditado, setGastoEditado] = useState<Gasto | null>(null);
  const [gastoUpdateFlag, setGastoUpdateFlag] = useState(0);
  const [showProfile, setShowProfile] = useState(false); // 👈 NUEVO estado para perfil

  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  const restante = budget !== null ? Math.max(budget - totalGastos, 0) : 0;

  // 🔹 Obtener presupuesto del backend
  const fetchBudget = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await api.get(`/usuarios/${userId}`);
      const userBudget = res.data?.presupuesto ?? 0;
      setBudget(userBudget);
      localStorage.setItem("userBudget", String(userBudget));
    } catch (err) {
      console.error("Error al obtener presupuesto:", err);
    }
  };

  const handleLoginOrRegister = async () => {
    setIsAuthenticated(true);
    await fetchBudget();
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setGastos([]);
    setBudget(null);
    setShowProfile(false);
  };

  const handleGastosActualizados = (nuevaLista: Gasto[]) => {
    setGastos(nuevaLista);
  };

  const handleGastoCreado = () => {
    setIsModalOpen(false);
    setGastoEditado(null);
    setIsEditModalOpen(false);
    setGastoUpdateFlag((g) => g + 1);
  };

  const handleEditarGasto = (gasto: Gasto) => {
    setGastoEditado(gasto);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (isAuthenticated) fetchBudget();
  }, [isAuthenticated]);

  // 🔹 Actualizar presupuesto
  const handleUpdateBudget = async () => {
    if (!newBudget || newBudget <= 0) {
      alert("Ingresa un presupuesto válido.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("No se encontró el ID del usuario.");
        return;
      }

      const response = await api.patch(`/usuarios/${userId}/presupuesto`, {
        presupuesto: newBudget,
      });

      setBudget(newBudget);
      localStorage.setItem("userBudget", String(newBudget));
      setIsBudgetModalOpen(false);
      console.log("✅ Presupuesto actualizado:", response.data);
    } catch (err) {
      alert("⚠️ No se pudo actualizar el presupuesto en el servidor.");
      console.error(err);
    }
  };

  // 🔹 Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <>
        <header className="bg-blue-600 py-8 max-h-72">
          <h1 className="uppercase text-center font-black text-4xl text-white">
            Planificador de Gastos
          </h1>
        </header>
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
          <AuthPanel onAuthSuccess={handleLoginOrRegister} />
        </div>
      </>
    );
  }

  // 🔹 Si el usuario abre su perfil
  if (showProfile) {
    return (
      <>
        <header className="bg-blue-600 py-6 relative flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
          <button
            onClick={() => setShowProfile(false)}
            className="absolute left-6 bg-gray-200 hover:bg-gray-300 text-blue-600 px-3 py-1 rounded-lg font-bold"
          >
            ← Volver
          </button>
        </header>

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
          <Profile />
        </div>
      </>
    );
  }

  // 🔹 Vista principal
  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72 relative flex items-center justify-center">
        <h1 className="uppercase text-center font-black text-4xl text-white">
          PLANIFICADOR DE GASTOS
        </h1>

        <button
          onClick={handleLogout}
          className="absolute top-6 right-8 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-bold"
        >
          Cerrar Sesión
        </button>

        {/* 👇 Ahora cambia solo el estado (no redirige) */}
        <div
          onClick={() => setShowProfile(true)}
          className="absolute top-6 left-8 w-12 h-12 rounded-full bg-white border-2 border-blue-300 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
          title="Editar perfil"
        >
          <img
            src={
              localStorage.getItem("profilePic") ||
              "https://via.placeholder.com/150"
            }
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* 💰 Resumen de presupuesto */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Resumen de tu presupuesto
          </h2>
          <button
            onClick={() => {
              setNewBudget(budget ?? 0);
              setIsBudgetModalOpen(true);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-blue-600 px-3 py-2 rounded-lg font-semibold border border-blue-100"
          >
            Editar presupuesto
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <PresupuestoGrafica
            gastado={totalGastos}
            disponible={restante}
            total={budget ?? 0}
          />
          <div className="mt-4 flex flex-col text-center">
            <span className="font-semibold text-gray-700">
              Presupuesto total:{" "}
              <span className="text-blue-700">${budget ?? 0}</span>
            </span>
            <span className="font-semibold text-gray-700">
              Gastado: <span className="text-red-600">${totalGastos}</span>
            </span>
            <span className="font-semibold text-gray-700">
              Disponible: <span className="text-green-600">${restante}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white p-2 rounded-lg mb-4"
        >
          Agregar gasto
        </button>

        {/* Modal agregar gasto */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Agregar gasto"
          className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 outline-none overflow-visible"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <GastosForm
            presupuestoDisponible={restante}
            onGastoCreado={handleGastoCreado}
          />
        </Modal>

        {/* Modal editar gasto */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => {
            setIsEditModalOpen(false);
            setGastoEditado(null);
          }}
          contentLabel="Editar gasto"
          className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 outline-none overflow-visible"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <GastosForm
            presupuestoDisponible={restante}
            modoEdicion={true}
            gastoEditado={gastoEditado}
            onGastoCreado={handleGastoCreado}
          />
        </Modal>

        {/* Modal editar presupuesto */}
        <Modal
          isOpen={isBudgetModalOpen}
          onRequestClose={() => setIsBudgetModalOpen(false)}
          contentLabel="Editar presupuesto"
          className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 outline-none overflow-visible"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <h2 className="text-xl font-bold text-center mb-4 text-blue-600">
            Editar Presupuesto
          </h2>
          <input
            type="number"
            value={newBudget ?? ""}
            onChange={(e) => setNewBudget(Number(e.target.value))}
            placeholder="Nuevo presupuesto"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsBudgetModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdateBudget}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Guardar
            </button>
          </div>
        </Modal>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-2 text-blue-600 mt-8">Tus gastos:</h3>
        <GastosList
          key={gastoUpdateFlag}
          onGastosActualizados={handleGastosActualizados}
          presupuestoDisponible={restante}
          onEditarGasto={handleEditarGasto}
        />
      </div>
    </>
  );
}

export default App;
