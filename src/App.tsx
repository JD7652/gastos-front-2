import { useState } from "react";
import AuthPanel from "./components/AuthPanel";
import BudgetSetup from "./components/BudgetSetup";
import GastosForm from "./components/GastosForm";
import GastosList, { type Gasto } from "./components/GastosList";
import Modal from "react-modal";
import PresupuestoGrafica from "./components/PresupuestoGrafica";

Modal.setAppElement("#root");

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authToken") !== null
  );

  // Presupuesto (lee desde localStorage si existe)
  const [budget, setBudget] = useState<number | null>(() => {
    const stored = localStorage.getItem("userBudget");
    return stored ? Number(stored) : null;
  });

  // Modal para introducir/editar presupuesto
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(() => {
    const stored = localStorage.getItem("userBudget");
    return !stored; // true si no hay presupuesto -> abrir modal al inicio
  });

  // Gastos y modales existentes
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gastoEditado, setGastoEditado] = useState<Gasto | null>(null);

  // Totales
  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  const restante = budget !== null ? Math.max(budget - totalGastos, 0) : 0;

  // Login / Logout
  const handleLoginOrRegister = () => {
    setIsAuthenticated(true);
    const stored = localStorage.getItem("userBudget");
    setShowBudgetModal(!stored);
    if (stored) {
      setBudget(Number(stored));
    }
  };

  const handleLogout = () => {
    // borramos solo el token — si quieres borrar presupuesto, descomenta la línea
    localStorage.removeItem("authToken");
    // localStorage.removeItem('userBudget'); // descomenta si quieres borrar presupuesto al cerrar sesión
    setIsAuthenticated(false);
    setGastos([]);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setGastoEditado(null);
  };

  // GastosList -> App sync
  const handleGastosActualizados = (nuevaLista: Gasto[]) => {
    setGastos(nuevaLista);
  };

  const [gastoUpdateFlag, setGastoUpdateFlag] = useState(0);
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

  // Cuando BudgetSetup devuelve el presupuesto
  const handleBudgetSet = (newBudget: number) => {
    setBudget(newBudget);
    localStorage.setItem("userBudget", String(newBudget));
    setShowBudgetModal(false);
  };

  // Abrir modal para editar presupuesto desde la UI principal
  const openEditBudgetModal = () => {
    setShowBudgetModal(true);
  };

  // Vistas
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

  // Vista principal (si está autenticado)
  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72 relative flex items-center justify-center">
  <h1 className="uppercase text-center font-black text-4xl text-white">
    PLANIFICADOR DE GASTOS
  </h1>

  {/* Botón de cerrar sesión */}
  <button
    onClick={handleLogout}
    className="absolute top-6 right-8 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-bold"
  >
    Cerrar Sesión
  </button>

  {/* Foto de perfil */}
  <div
    onClick={() => window.location.href = "/editar-perfil"} // Aquí puedes usar navigate() si tienes react-router
    className="absolute top-6 left-8 w-12 h-12 rounded-full bg-white border-2 border-blue-300 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
    title="Editar perfil"
  >
    <img
      src={localStorage.getItem("profilePic") || "https://via.placeholder.com/150"} // Imagen guardada o placeholder
      alt="Perfil"
      className="w-full h-full object-cover"
    />
  </div>
</header>


      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Resumen de tu presupuesto</h2>
          <div className="mb-4">
            <button
              onClick={openEditBudgetModal}
              className="bg-gray-100 hover:bg-gray-200 text-blue-600 px-3 py-2 rounded-lg font-semibold border border-blue-100"
            >
              {budget ? "Editar presupuesto" : "Definir presupuesto"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <PresupuestoGrafica gastado={totalGastos} disponible={restante} total={budget ?? 0} />
          <div className="mt-4 flex flex-col text-center">
            <span className="font-semibold text-gray-700">
              Presupuesto total: <span className="text-blue-700">${budget ?? 0}</span>
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

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Agregar gasto"
          className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 outline-none overflow-visible"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <GastosForm presupuestoDisponible={restante} onGastoCreado={handleGastoCreado} />
        </Modal>

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

      <Modal
        isOpen={showBudgetModal}
        onRequestClose={() => setShowBudgetModal(false)}
        contentLabel="Definir presupuesto"
        className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 outline-none overflow-visible"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <BudgetSetup
          onBudgetSet={handleBudgetSet}
          initialBudget={budget ?? undefined}
          onCancel={() => setShowBudgetModal(false)}
        />
      </Modal>
    </>
  );
}

export default App;