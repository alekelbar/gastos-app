import { BudgetData } from "../models/budget_data";

interface BudgetFormProps {
  onBudgetChange: (newBudget: BudgetData) => void;
  budgetInput: BudgetData;
  onProblemsDetected: (msg: string, show: boolean, duration?: number) => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  onBudgetChange,
  budgetInput,
  onProblemsDetected,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const num = Number.parseFloat(budgetInput.budget);
    if (isNaN(num)) {
      onProblemsDetected("El presupuesto no es valido", true);
      return;
    }

    localStorage.setItem("budgetInput", JSON.stringify(budgetInput));
    onBudgetChange({ ...budgetInput, available: num, isValid: true });
  };

  return (
    <>
      <h2 className="text-center font-bold text-blue-500 text-xl my-3">
        Definir tu <span className="">presupuesto</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-2/3 md:w-1/2 block mx-auto px-3 py-3 border-2 rounded my-3 text-center"
          type="text"
          placeholder="Presupuesto"
          value={budgetInput.budget}
          onChange={(e) =>
            onBudgetChange({ ...budgetInput, budget: e.target.value })
          }
        />
        <input
          className="px-2 py-2 rounded bg-blue-500 text-white w-2/3 my-2 mx-auto block hover:bg-blue-900 cursor"
          type="submit"
          value={"Añadir"}
          placeholder="¿Cuál es tu presupuesto?"
        />
        {/* spacer */}
      </form>
      <div className="h-2"></div>
    </>
  );
};
