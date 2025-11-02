import { useEffect, useMemo } from "react"
import BudgetForm from "./components/BudgetForm"
import { useBudget } from "./hooks/useBudget"
import BudgetTracker from "./components/BudgetTracker"
import ExpenseModal from "./components/ExpenseModal"
import ExpenseList from "./components/ExpenseList"
import FilterByCategory from "./components/FilterByCategory"
import AuthContainer from "./components/AuthContainer";

function App() {

  const { state } = useBudget()

  const isValidBudget = useMemo(() => state.budget > 0, [state.budget])

  const isAuthenticated = useMemo(() => {
    return localStorage.getItem('authToken') !== null;
  }, []);

  useEffect(() => {
    localStorage.setItem('budget', state.budget.toString())
    localStorage.setItem('expenses', JSON.stringify(state.expenses))
  }, [state])


  if (!isAuthenticated) {
    return (
      <>
        <header className="bg-blue-600 py-8 max-h-72">
          <h1 className="uppercase text-center font-black text-4xl text-white">
            Planificador de Gastos
          </h1>
        </header>
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
          <AuthContainer />
        </div>
      </>
    );
  }


  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72">
        <h1 className="uppercase text-center font-black text-4xl text-white">
          Planificador de Gastos
        </h1>
      </header>

      <div className="flex justify-end max-w-3xl mx-auto mt-4">
        <button
          onClick={() => { localStorage.removeItem('authToken'); window.location.reload(); }}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-bold"
        >Cerrar Sesión</button>
      </div>

      <div className="max-w-3xl mx-auto bg-white  shadow-lg rounded-lg mt-10 p-10">
        {isValidBudget ? <BudgetTracker /> : <BudgetForm />}
      </div>

      {isValidBudget && (
        <main className="max-w-3xl mx-auto py-10">
          <FilterByCategory />
          <ExpenseList />
          <ExpenseModal />
        </main>
      )}
    </>
  )
}

export default App