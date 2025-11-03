import React from "react";
import { Doughnut } from "react-chartjs-2";

type DashboardProps = {
    presupuesto: number;
    gastos: number; // suma total de gastos!
    onLogout: () => void;
};

const Dashboard: React.FC<DashboardProps> = ({ presupuesto, gastos, onLogout }) => {
    const restante = Math.max(presupuesto - gastos, 0);

    const data = {
        labels: ["Gastado", "Disponible"],
        datasets: [
            {
                data: [gastos, restante],
                backgroundColor: ["#ef4444", "#2563eb"],
                hoverBackgroundColor: ["#dc2626", "#3b82f6"],
            },
        ],
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10 text-center">
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Resumen de tu presupuesto</h2>
            <div className="flex flex-col items-center mb-6">
                <Doughnut data={data} style={{ maxWidth: 220 }} />
                <div className="mt-4 flex flex-col">
                    <span className="font-semibold text-gray-700">Presupuesto total: <span className="text-blue-700">${presupuesto}</span></span>
                    <span className="font-semibold text-gray-700">Gastado: <span className="text-red-600">${gastos}</span></span>
                    <span className="font-semibold text-gray-700">Disponible: <span className="text-green-600">${restante}</span></span>
                </div>
            </div>
            {/* Aquí puedes poner una lista de gastos recientes en el futuro */}
            <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-bold mt-4"
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Dashboard;