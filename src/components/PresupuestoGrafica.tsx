import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function PresupuestoGrafica({ gastado, disponible, total }: { gastado: number; disponible: number; total: number; }) {
    const porcentaje = total > 0 ? Math.round((gastado / total) * 100) : 0;
    return (
        <div className="relative flex flex-col items-center justify-center" style={{ minHeight: 150, maxWidth: 180 }}>
            {/* Leyenda bonita arriba */}
            <div className="flex items-center mb-2 gap-6 text-base font-semibold">
                <span className="flex items-center">
                    <span className="w-5 h-3 rounded bg-red-500 mr-2"></span>
                    <span className="text-gray-700">Gastado</span>
                </span>
                <span className="flex items-center">
                    <span className="w-5 h-3 rounded bg-blue-600 mr-2"></span>
                    <span className="text-gray-700">Disponible</span>
                </span>
            </div>
            {/* Gráfica más compacta */}
            <div className="relative" style={{ width: 120, height: 120 }}>
                <Doughnut
                    data={{
                        labels: ["Gastado", "Disponible"],
                        datasets: [
                            {
                                data: [gastado, disponible],
                                backgroundColor: ["#ef4444", "#2563eb"],
                                borderColor: "white",
                                borderWidth: 2,
                            },
                        ],
                    }}
                    options={{
                        cutout: "72%",
                        plugins: {
                            legend: { display: false },
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                    }}
                    width={120}
                    height={120}
                />
                {/* Porcentaje central */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                    <span className="text-xl md:text-2xl font-extrabold text-gray-800 drop-shadow-sm">{porcentaje}%</span>
                </div>
            </div>
        </div>
    );
}
export default PresupuestoGrafica;