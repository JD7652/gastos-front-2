// src/services/categoryService.ts

import api from './api';

export interface Category {
    id: number;
    nombreCategoria: string;
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get<Category[]>('/categorias');
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        throw new Error('Falló la carga de categorías. (Token válido?)');
    }
};

export const createCategory = async (data: { nombreCategoria: string }): Promise<Category> => {
    try {
        const response = await api.post<Category>('/categorias', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw new Error('Falló la creación de la categoría.');
    }
};

export const deleteCategory = async (id: number | string): Promise<void> => {
    try {
        await api.delete(`/categorias/${id}`);
    } catch (error) {
        console.error(`Error al eliminar categoría ${id}:`, error);
        throw new Error('Falló la eliminación de la categoría.');
    }
};