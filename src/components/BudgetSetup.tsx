import { useState } from "react";

interface BudgetSetupProps {
  onBudgetSet: (budget: number) => void;
  initialBudget?: number;
  onCancel: () => void;
}

export default function BudgetSetup({
  onBudgetSet,
  initialBudget = 0,
  onCancel,
}: BudgetSetupProps) {
  const [presupuesto, setPresupuesto] = useState<number>(initialBudget || 0);
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (presupuesto <= 0) {
      alert("Por favor, ingresa un presupuesto válido.");
      return;
    }

    try {
      setGuardando(true);
      // 🔹 Llamamos a la función del padre (App.tsx)
      await onBudgetSet(presupuesto);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        ¡Definamos tu presupuesto!
      </h2>
      <p className="text-gray-600 mb-6">
        El presupuesto es la clave para controlar tus gastos. <br />
        Ingresa tu presupuesto:
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={presupuesto}
          onChange={(e) => setPresupuesto(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ej. 500"
        />

        <div className="flex justify-center gap-3">
          <button
            type="submit"
            disabled={guardando}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              guardando
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {guardando ? "Guardando..." : "Guardar presupuesto"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
