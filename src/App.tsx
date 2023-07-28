import { useEffect, useState } from "react";
import { BudgetForm } from "./components/BudgetForm";
import { Header } from "./components/Header";
import Swal from "sweetalert2";
import { BudgetData } from "./models/budget_data";
import { BudgetController } from "./components/BudgetController";
import { FloatingButton } from "./components/FloatingButton";
import { AddWorn } from "./components/AddWorn";
import { WornModel } from "./models/worn_model";
import { Worn } from "./components/Worn";

const options = [
  "ahorro",
  "comida",
  "casa",
  "gastos varios",
  "ocio",
  "salud",
  "suscripciones",
];

const budgetFromStorage = localStorage.getItem("budget");
const wornsFromStorage = localStorage.getItem("worns");

let wornsInitialState: WornModel[] = [];
let budgetInitialState = {
  budget: "",
  available: 0,
  worn: 0,
  isValid: false,
};

if (budgetFromStorage) {
  budgetInitialState = JSON.parse(budgetFromStorage);
}

if (wornsFromStorage) {
  wornsInitialState = JSON.parse(wornsFromStorage);
}

function App() {
  const [filter, setFilter] = useState("all");

  const [budgetInput, setBudgetInput] =
    useState<BudgetData>(budgetInitialState);

  const [problems, setProblems] = useState({
    message: "",
    show: false,
    duration: 0,
  });

  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budgetInput));
  }, [budgetInput]);

  const [openModal, setOpenModal] = useState(false);

  const onOpenModal = () => {
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setBudgetInput({ ...budgetInput, edit: undefined });
    setOpenModal(false);
  };

  const [worns, setWorns] = useState<WornModel[]>(wornsInitialState);

  useEffect(() => {
    localStorage.setItem("worns", JSON.stringify(worns));
  }, [worns]);

  const onAddWorn = (worn: WornModel) => {
    setWorns([...worns, worn]);
    setBudgetInput({
      ...budgetInput,
      available: budgetInput.available - Number(worn.amount),
      worn: budgetInput.worn + Number(worn.amount),
    });
  };

  const onRemoveWorn = (worn: WornModel) => {
    // reintegrar el presupuesto...
    setWorns(worns.filter((e) => e.uniqueId !== worn.uniqueId));
    setBudgetInput({
      ...budgetInput,
      available: budgetInput.available + Number(worn.amount),
      worn: budgetInput.worn - Number(worn.amount),
    });
  };

  const onEditWorn = (worn: WornModel) => {
    const wornsUpdated = worns.map((e) =>
      e.uniqueId === worn.uniqueId ? worn : e
    );
    setWorns(wornsUpdated);

    // reintegrar el presupuesto...
    const newWorn = wornsUpdated.reduce((a, b) => a + Number(b.amount), 0);
    setBudgetInput({
      ...budgetInput,
      worn: newWorn,
      available: Number(budgetInput.budget) - newWorn,
      edit: undefined,
    });
  };

  const onBudgetChange = (newBudget: BudgetData) => {
    const num = Number.parseFloat(newBudget.budget);
    setBudgetInput({
      ...newBudget,
      budget: isNaN(num) ? "" : num.toString(),
    }); // it's possible NaN
  };

  const onResetApp = () => {
    setBudgetInput({
      budget: "",
      available: 0,
      worn: 0,
      isValid: false,
    });
    setWorns([]);
  };

  const onProblemsDetected = (
    msg: string,
    show: boolean,
    duration: number = 2000
  ) => {
    setProblems({
      message: msg,
      show: show,
      duration: duration,
    });
  };

  useEffect(() => {
    if (problems.show) {
      Swal.fire({
        title: "Lo siento :(",
        text: problems.message,
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          setProblems({ ...problems, message: "", show: false });
        },
      });
    }
    return () => {};
  }, [problems]);

  return (
    <>
      <div>
        {openModal && (
          <AddWorn
            onEditWorn={onEditWorn}
            budget={budgetInput}
            onCloseModal={onCloseModal}
            onProblemsDetected={onProblemsDetected}
            onAddWorn={onAddWorn}
          />
        )}
        <div className="mx-auto relative container">
          <div className="relative w-full h-24 rounded-lg bg-blue-500">
            <Header />
            <div className="bg-white p-3 mt-1 md:mt-10 rounded shadow-2xl w-full sm:w-1/2 sm:absolute sm:translate-y-1/2 sm:translate-x-1/2 -bottom-10">
              {!budgetInput.isValid ? (
                <BudgetForm
                  onProblemsDetected={onProblemsDetected}
                  budgetInput={budgetInput}
                  onBudgetChange={onBudgetChange}
                />
              ) : (
                <>
                  <BudgetController
                    onResetApp={onResetApp}
                    budgetInput={budgetInput}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="md:mt-40 mt-52 mx-auto flex flex-col items-center overflow-auto">
          {budgetInput.isValid ?? (
            <div className="mx-auto bg-white p-5 mb-3 md:w-2/3 w-[95%] shadow-xl rounded-xl grid grid-cols-2 grid-row-1">
              <h3>Filtrar gastos</h3>
              <select
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border-2 rounded-lg uppercase focus:border-none"
                name="filtro"
                id="filtro"
              >
                <option value={"all"}>Todos</option>
                {options.map((e) => {
                  return (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <h2 className="text-gray-800 font-black text-xl text-center uppercase my-2">
            {worns.filter((e) => (filter !== "all" ? e.type === filter : true))
              .length !== 0
              ? "Gastos"
              : "No hay gastos"}
          </h2>
          <div className="container">
            {worns
              .filter((e) => (filter !== "all" ? e.type === filter : true))
              .map((e) => {
                return (
                  <Worn
                    onOpenModal={onOpenModal}
                    budget={budgetInput}
                    onBudgetChange={onBudgetChange}
                    onRemoveWorn={onRemoveWorn}
                    key={e.uniqueId}
                    model={e}
                  />
                );
              })}
          </div>
        </div>
        {budgetInput.isValid && <FloatingButton onOpenModal={onOpenModal} />}
      </div>
    </>
  );
}

export default App;
