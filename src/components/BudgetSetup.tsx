import React, { useState, useEffect } from "react";

type Props = {
    onBudgetSet: (amount: number) => void;
    initialBudget?: number;
    onCancel?: () => void;
};

export default function BudgetSetup({ onBudgetSet, initialBudget, onCancel }: Props) {
    const [value, setValue] = useState<string>(initialBudget ? String(initialBudget) : "");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (initialBudget !== undefined) setValue(String(initialBudget));
    }, [initialBudget]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = Number(value);
        if (!num || num <= 0) {
            setError("Ingresa un presupuesto válido (mayor a 0)");
            return;
        }
        setError("");
        onBudgetSet(num);
        // No hacemos navegación aquí; la lógica de guardado/cierre la maneja App
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="text-2xl font-extrabold text-center text-blue-700">¡Definamos tu presupuesto!</h3>
            <p className="text-center text-gray-600">El presupuesto es la clave para controlar tus gastos. Ingresa tu presupuesto:</p>

            <div className="flex flex-col items-center">
                <input
                    className={`border ${error ? "border-red-400" : "border-gray-300"} rounded-lg px-4 py-3 w-72 text-lg`}
                    placeholder="Escribe aquí tu presupuesto"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    inputMode="numeric"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
                >
                    Guardar presupuesto
                </button>

                <button
                    type="button"
                    onClick={() => onCancel ? onCancel() : undefined}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}