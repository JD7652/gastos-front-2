// import { useState, useEffect, type FormEvent } from 'react';
// import {
//     getCategories,
//     createCategory,
//     deleteCategory,
//     type Category // Asegúrate que la interfaz Category usa id: string
// } from '../services/CategoryService.ts'; // <--- RUTA CORREGIDA: AÑADE LA EXTENSIÓN .ts

// // --- Componente de Gestión de Categorías ---
// const CategoriesPage = () => {
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [newCategoryName, setNewCategoryName] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Función para cargar categorías
//     useEffect(() => {
//         const fetchCategories = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const data = await getCategories();
//                 setCategories(data);
//             } catch (err) {
//                 setError('Error al cargar categorías. Verifica el JWT.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCategories();
//     }, []);

//     // Función para crear categorías
//     const handleCreateCategory = async (e: FormEvent) => {
//         e.preventDefault();
//         if (!newCategoryName.trim()) return;

//         try {
//             const newCat = await createCategory({ nombreCategoria: newCategoryName });
//             setCategories([...categories, newCat]);
//             setNewCategoryName('');
//         } catch (err) {
//             setError('No se pudo crear la categoría.');
//         }
//     };

//     // Función para eliminar categorías
//     const handleDeleteCategory = async (id: string) => {
//         if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
//             return;
//         }

//         try {
//             await deleteCategory(id);
//             setCategories(categories.filter(cat => cat.id !== id));
//         } catch (err) {
//             setError('No se pudo eliminar la categoría. Revise que no tenga gastos asociados.');
//         }
//     };


//     // --- Renderizado ---
//     if (loading) return <div>Cargando categorías...</div>;

//     return (
//         <div style={{ padding: '20px', border: '1px solid #ddd', marginTop: '20px' }}>
//             <h2>Gestión de Categorías</h2>

//             {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}

//             {/* Formulario de Creación */}
//             <form onSubmit={handleCreateCategory} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
//                 <input
//                     type="text"
//                     placeholder="Nombre de la nueva categoría"
//                     value={newCategoryName}
//                     onChange={(e) => setNewCategoryName(e.target.value)}
//                     required
//                     style={{ padding: '8px', flexGrow: 1 }}
//                 />
//                 <button type="submit" style={{ padding: '8px 15px', background: 'green', color: 'white' }}>
//                     Crear
//                 </button>
//             </form>

//             {/* Listado de Categorías */}
//             <ul style={{ listStyle: 'none', padding: 0 }}>
//                 {categories.map((category) => (
//                     <li
//                         key={category.id}
//                         style={{
//                             padding: '10px',
//                             borderBottom: '1px solid #eee',
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center'
//                         }}
//                     >
//                         <span>{category.nombreCategoria}</span>
//                         <button
//                             onClick={() => handleDeleteCategory(category.id)}
//                             style={{ padding: '5px 10px', background: 'red', color: 'white' }}
//                         >
//                             Eliminar
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default CategoriesPage;