import React, { useEffect, useState } from "react";
import api from "../services/api";

type Categoria = { id?: string; _id?: string; nombre?: string; nombreCategoria?: string; nombre_categoria?: string; name?: string;[key: string]: any };
type Gasto = {
    id?: string;
    nombreGasto?: string;
    monto?: number;
    fechaGasto?: string;
    descripcion?: string;
    categoriaID?: string | null;
    categoria?: any;
};

type Props = {
    presupuestoDisponible: number;
    onGastoCreado?: () => void;
    modoEdicion?: boolean;
    gastoEditado?: Gasto | null;
};

export default function GastosForm({
    presupuestoDisponible,
    onGastoCreado,
    modoEdicion = false,
    gastoEditado = null,
}: Props) {
    const [nombreGasto, setNombreGasto] = useState(gastoEditado?.nombreGasto ?? "");
    const [monto, setMonto] = useState(gastoEditado?.monto?.toString() ?? "");
    const [fechaGasto, setFechaGasto] = useState(gastoEditado?.fechaGasto ?? "");
    const [descripcion, setDescripcion] = useState(gastoEditado?.descripcion ?? "");
    const [categoriaID, setCategoriaID] = useState<string>(gastoEditado?.categoriaID ?? "");

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loadingCats, setLoadingCats] = useState<boolean>(true);
    const [catError, setCatError] = useState<string>("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchCategorias() {
            setLoadingCats(true);
            setCatError("");
            try {
                const res = await api.get("/categorias");
                const data = res.data || [];
                console.log("[GastosForm] /categorias ->", data); // debug: mira estructura de cada categoría
                setCategorias(data);
            } catch (e) {
                console.error("Error cargando categorías:", e);
                setCatError("No se pudieron cargar las categorías.");
                setCategorias([]);
            } finally {
                setLoadingCats(false);
            }
        }
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (gastoEditado) {
            setNombreGasto(gastoEditado.nombreGasto ?? "");
            setMonto(gastoEditado.monto?.toString() ?? "");
            setFechaGasto(gastoEditado.fechaGasto ?? "");
            setDescripcion(gastoEditado.descripcion ?? "");
            setCategoriaID(gastoEditado.categoriaID ?? "");
        }
    }, [gastoEditado]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!nombreGasto || !monto || !fechaGasto || !categoriaID) {
            setError("Todos los campos obligatorios deben completarse.");
            setSuccess("");
            return;
        }
        const numMonto = Number(monto);
        if (isNaN(numMonto) || numMonto <= 0) {
            setError("Monto inválido.");
            setSuccess("");
            return;
        }
        let maxMontoPermitido = presupuestoDisponible;
        if (modoEdicion && gastoEditado && gastoEditado.monto) maxMontoPermitido += gastoEditado.monto;
        if (numMonto > maxMontoPermitido) {
            setError("No tienes presupuesto suficiente.");
            setSuccess("");
            return;
        }

        try {
            if (modoEdicion && gastoEditado) {
                await api.patch(`/gastos/${gastoEditado.id}`, {
                    nombreGasto,
                    monto: numMonto,
                    fechaGasto,
                    descripcion,
                    categoriaID,
                });
                setSuccess("Gasto actualizado.");
            } else {
                await api.post("/gastos", {
                    nombreGasto,
                    monto: numMonto,
                    fechaGasto,
                    descripcion,
                    categoriaID,
                });
                setSuccess("Gasto creado.");
            }
            setError("");
            setNombreGasto("");
            setMonto("");
            setFechaGasto("");
            setDescripcion("");
            setCategoriaID("");
            if (onGastoCreado) onGastoCreado();
        } catch (e) {
            console.error("Error guardando gasto:", e);
            setError("No se pudo guardar el gasto.");
            setSuccess("");
        }
    }

    // Función helper para obtener el label (nombre) de la categoría
    const getCategoriaLabel = (c: Categoria, idx: number) => {
        // probamos las propiedades más comunes
        return (
            c.nombre ??
            c.nombreCategoria ??
            c.nombre_categoria ??
            c.name ??
            (typeof c === "string" ? c : undefined) ??
            `Categoría ${idx + 1}` // fallback legible
        );
    };

    const getCategoriaId = (c: Categoria, idx: number) => {
        return (c.id ?? c._id ?? `cat-fallback-${idx}`) as string;
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl flex flex-col gap-5 w-full max-w-md mx-auto" style={{ minWidth: 320 }}>
            <h3 className="text-2xl font-extrabold text-blue-700 mb-2 text-center">
                {modoEdicion ? "Editar gasto" : "Agregar nuevo gasto"}
            </h3>

            {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
            {error && <div className="text-red-600 text-center font-semibold">{error}</div>}

            <label className="flex flex-col font-semibold text-sm gap-2">
                Nombre del gasto
                <input
                    type="text"
                    value={nombreGasto}
                    onChange={(e) => setNombreGasto(e.target.value)}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
                    placeholder="Ej: Netflix, Gasolina..."
                />
            </label>

            <label className="flex flex-col font-semibold text-sm gap-2">
                Monto
                <input
                    type="number"
                    min={1}
                    step="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
                    placeholder="Ej: 100"
                />
            </label>

            <label className="flex flex-col font-semibold text-sm gap-2">
                Fecha del gasto
                <input
                    type="date"
                    value={fechaGasto}
                    onChange={(e) => setFechaGasto(e.target.value)}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none shadow-sm transition-all"
                />
            </label>

            <label className="flex flex-col font-semibold text-sm gap-2">
                Descripción (opcional)
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none shadow-sm transition-all"
                    placeholder="Ej: pago mensual, viaje corto..."
                />
            </label>

            <label className="flex flex-col font-semibold text-sm gap-2 relative">
                Categoría
                <div className="relative z-50">
                    <select
                        value={categoriaID ?? ""}
                        onChange={(e) => setCategoriaID(e.target.value)}
                        required
                        disabled={loadingCats || categorias.length === 0}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none shadow-sm transition-all bg-white text-black"
                        aria-label="Seleccione categoría"
                        style={{
                            WebkitTextFillColor: "#111",
                            color: "#111",
                            backgroundColor: "#fff",
                        }}
                    >
                        <option value="">{loadingCats ? "--Cargando categorías--" : "--Selecciona categoría--"}</option>

                        {categorias.map((c, idx) => {
                            const label = getCategoriaLabel(c, idx);
                            const id = getCategoriaId(c, idx);
                            return (
                                // mostramos SOLO el label en el option; el value será el id
                                <option key={id} value={id} style={{ color: "#111", backgroundColor: "#fff" }}>
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {catError && <span className="text-sm text-red-500">{catError}</span>}
                {!catError && !loadingCats && categorias.length === 0 && (
                    <span className="text-sm text-gray-500">No hay categorías. Crea alguna primero.</span>
                )}
            </label>

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-3 py-2 mt-2 rounded-lg font-bold shadow-md transition-all w-full"
            >
                {modoEdicion ? "Guardar cambios" : "Agregar gasto"}
            </button>
        </form>
    );
}