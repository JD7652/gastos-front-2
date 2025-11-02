// src/services/expenseService.ts

import api from './api';

export interface Expense {
    id: string;
    nombreGasto: string;
    monto: number;
    fechaGasto: string;
    descripcion: string;
    categoriaId: string;
}

export type DraftExpense = Omit<Expense, 'id'>;

export type UpdateExpense = Partial<Expense> & { id: string };

export const createExpense = async (draftExpense: DraftExpense): Promise<Expense> => {
    try {
        const response = await api.post<Expense>('/gastos', draftExpense);
        return response.data;
    } catch (error) {
        console.error("Error al crear gasto:", error);
        throw new Error('Falló la creación del gasto. Verifica los campos y tu sesión.');
    }
};

export const getExpenses = async (): Promise<Expense[]> => {
    try {
        const response = await api.get<Expense[]>('/gastos');
        return response.data;
    } catch (error) {
        console.error("Error al obtener gastos:", error);
        throw new Error('No se pudieron cargar los gastos.');
    }
};

export const updateExpense = async ({ id, ...rest }: UpdateExpense): Promise<Expense> => {
    try {
        const response = await api.patch<Expense>(`/gastos/${id}`, rest);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar gasto ${id}:`, error);
        throw new Error('Falló la actualización del gasto.');
    }
};

export const deleteExpense = async (id: string): Promise<void> => {
    try {
        await api.delete(`/gastos/${id}`);
    } catch (error) {
        console.error(`Error al eliminar gasto ${id}:`, error);
        throw new Error('Falló la eliminación del gasto.');
    }
};