

export type Expense = {
    id: string
    expenseName: string,
    amount: number
    category: string
    date: Value
}


export type DraftExpense = Omit<Expense, 'id'>

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type Category = {
    id: string
    name: string
    icon: string
}


// export interface Expense {
//     id: string; // ID asignado por el backend (UUID)
//     nombreGasto: string;
//     monto: number;
//     fechaGasto: string; // Usaremos string para el formato ISO
//     descripcion: string;
//     categoriaId: string; // El UUID de la Categoría
// }

// // Interfaz para el cuerpo de la petición de creación (Draft)
// export type DraftExpense = Omit<Expense, 'id'>;