import { useEffect, useState } from "react";
import api from "../services/api";

export type Categoria = {
    id?: string;
    _id?: string;
    nombre?: string;
    name?: string;
    [key: string]: any;
};

export type Gasto = {
    id: string;
    nombreGasto: string;
    monto: number;
    fechaGasto: string;
    descripcion?: string;
    categoriaNombre?: string;
    categoriaOriginalName?: string;
    categoriaID?: string | null;
    categoria?: any;
    [key: string]: any;
};

type GastosListProps = {
    onGastosActualizados?: (gastos: Gasto[]) => void;
    presupuestoDisponible?: number;
    onEditarGasto?: (gasto: Gasto) => void;
    debug?: boolean;
};

function stringToHslColor(str: string, s = 65, l = 55) {
    // simple hash -> hue generator (stable per category name)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        // keep in JS int range
        // eslint-disable-next-line no-bitwise
        hash = hash & hash;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} ${s}% ${l}%)`;
}

export default function GastosList({
    onGastosActualizados,
    presupuestoDisponible,
    onEditarGasto,
    debug = false,
}: GastosListProps) {
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadData() {
        try {
            const [catsRes, gastosRes] = await Promise.all([api.get("/categorias"), api.get("/gastos")]);
            const cats: Categoria[] = (catsRes && catsRes.data) ? catsRes.data : [];
            const rawGastos: any[] = (gastosRes && gastosRes.data) ? gastosRes.data : [];

            setCategorias(cats);

            const findCategoryById = (id?: string | null) => {
                if (!id) return undefined;
                return cats.find(
                    (c) =>
                        String(c.id ?? c._id ?? "").toLowerCase() === String(id ?? "").toLowerCase()
                );
            };

            const resolved: Gasto[] = rawGastos.map((gRaw) => {
                const id = gRaw.id ?? gRaw._id ?? String(Math.random()).slice(2);
                const nombreGasto = gRaw.nombreGasto ?? gRaw.name ?? gRaw.titulo ?? "Gasto";
                const monto = Number(gRaw.monto ?? 0);
                const fechaGasto = gRaw.fechaGasto ?? gRaw.date ?? gRaw.fecha ?? "";

                const originalCandidates: Array<string | undefined> = [
                    gRaw?.categoria?.nombre,
                    gRaw?.categoria?.name,
                    gRaw?.categoria?.nombreCategoria,
                    gRaw?.categoria?.nombre_categoria,
                    gRaw?.categoria?.title,
                    gRaw?.category?.name,
                    gRaw?.nombreCategoria,
                    gRaw?.nombre_categoria,
                    gRaw?.categoriaNombre,
                    gRaw?.categoryName,
                    typeof gRaw?.categoria === "string" ? gRaw.categoria : undefined,
                ];
                const categoriaOriginalName = originalCandidates.find(v => v && String(v).trim() !== "") ?? "";

                let categoriaNombre = categoriaOriginalName;
                if (!categoriaNombre) {
                    const candidateId =
                        gRaw.categoriaID ??
                        gRaw.categoria_id ??
                        gRaw.category_id ??
                        gRaw.categoryId ??
                        gRaw.categoriaId ??
                        gRaw?.categoria?._id ??
                        gRaw?.categoria?.id ??
                        null;

                    let candidateIdStr: string | null = null;
                    if (candidateId && typeof candidateId === "string") candidateIdStr = candidateId;
                    else if (candidateId && typeof candidateId === "object") {
                        candidateIdStr = String(candidateId.id ?? candidateId._id ?? "");
                    }

                    if (candidateIdStr) {
                        const found = findCategoryById(candidateIdStr);
                        if (found) categoriaNombre = found.nombre ?? found.name ?? "";
                    }
                }

                if (!categoriaNombre) {
                    categoriaNombre =
                        gRaw?.categoriaNombre ??
                        gRaw?.categoryName ??
                        gRaw?.categoria_nombre ??
                        "";
                }

                return {
                    ...(gRaw as any),
                    id,
                    nombreGasto,
                    monto,
                    fechaGasto,
                    descripcion: gRaw.descripcion ?? "",
                    categoriaOriginalName: categoriaOriginalName ?? "",
                    categoriaNombre: categoriaNombre ?? "",
                    categoriaID: (gRaw.categoriaID ?? gRaw.categoria_id ?? gRaw.category_id ?? gRaw.categoryId ?? gRaw.categoriaId ?? null) || null,
                    categoria: gRaw.categoria ?? null,
                } as Gasto;
            });

            setGastos(resolved);
            if (onGastosActualizados) onGastosActualizados(resolved);
        } catch (e) {
            console.error("Error cargando gastos o categorías:", e);
            setError("No se pudieron cargar los gastos o las categorías.");
        }
    }

    async function handleDelete(id: string) {
        try {
            await api.delete(`/gastos/${id}`);
            await loadData();
        } catch (e) {
            console.error("Error eliminando gasto:", e);
            setError("No se pudo eliminar el gasto.");
        }
    }

    return (
        <div className="mt-6">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <ul className="space-y-4 mx-auto max-w-4xl">
                {gastos.length === 0 ? (
                    <li className="bg-white rounded-lg shadow-md p-8">
                        <p className="text-gray-500 text-center">Aún no has registrado gastos.</p>
                    </li>
                ) : (
                    gastos.map((g) => {
                        const categoryLabel = g.categoriaOriginalName || g.categoriaNombre || "";
                        const color = categoryLabel ? stringToHslColor(categoryLabel, 60, 60) : undefined;
                        const contrastTextColor = "#0b1220"; // dark text over soft color

                        return (
                            <li
                                key={g.id}
                                className="bg-white rounded-lg shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Category indicator (circle) + title */}
                                            {categoryLabel ? (
                                                <div
                                                    className="flex items-center gap-3"
                                                    style={{ minWidth: 0 }}
                                                >
                                                    <div
                                                        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                                                        style={{
                                                            background: color,
                                                            color: contrastTextColor,
                                                            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                                                        }}
                                                        aria-hidden
                                                    >
                                                        <span className="text-sm font-semibold">
                                                            {categoryLabel.slice(0, 1).toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col min-w-0">
                                                        <p className="text-gray-800 font-semibold truncate">{g.nombreGasto}</p>
                                                        <p className="text-gray-400 text-sm truncate">{g.descripcion}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1">
                                                    <p className="text-gray-800 font-semibold truncate">{g.nombreGasto}</p>
                                                    <p className="text-gray-400 text-sm truncate">{g.descripcion}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta: amount, date, category name (desktop) */}
                                        <div className="hidden md:flex md:items-center md:gap-6">
                                            <div className="text-right">
                                                <p className="text-red-600 font-bold text-lg">${g.monto}</p>
                                                <p className="text-xs text-gray-400">{g.fechaGasto}</p>
                                            </div>

                                            {categoryLabel && (
                                                <div
                                                    className="px-3 py-1 rounded-full text-sm font-semibold"
                                                    style={{
                                                        background: color,
                                                        color: contrastTextColor,
                                                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                                                    }}
                                                >
                                                    {categoryLabel}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* mobile meta (below content) */}
                                    <div className="mt-3 flex items-center justify-between md:hidden">
                                        <div className="flex items-center gap-3">
                                            <p className="text-red-600 font-bold">${g.monto}</p>
                                            <p className="text-xs text-gray-400">{g.fechaGasto}</p>
                                        </div>

                                        {categoryLabel && (
                                            <div
                                                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={{
                                                    background: color,
                                                    color: contrastTextColor,
                                                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                                                }}
                                            >
                                                {categoryLabel}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* actions */}
                                <div className="flex-shrink-0 flex items-center gap-3">
                                    <button
                                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                        onClick={() => onEditarGasto && onEditarGasto(g)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                        onClick={() => handleDelete(g.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                {/* debug block (optional) */}
                                {debug && (
                                    <pre className="text-xs text-gray-400 mt-3 md:mt-0 w-full md:w-auto">
                                        {JSON.stringify(g, null, 2)}
                                    </pre>
                                )}
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}