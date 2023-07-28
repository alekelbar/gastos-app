import { useState } from "react";
import { WornModel, WornTypes } from "./../models/worn_model";
import { AiFillCloseSquare } from "react-icons/ai";
import { generateId } from "../helpers";
import { BudgetData } from "../models/budget_data";

interface AddWornProps {
  onProblemsDetected: (msg: string, show: boolean, duration?: number) => void;
  onAddWorn: (worn: WornModel) => void;
  onEditWorn: (worn: WornModel) => void;
  onCloseModal: () => void;
  budget: BudgetData;
}

const initialFormState: WornModel = {
  wornName: "",
  amount: "",
  type: "ahorro",
  uniqueId: "",
  date: new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }),
};

export const AddWorn: React.FC<AddWornProps> = ({
  onProblemsDetected,
  onAddWorn,
  onCloseModal,
  budget,
  onEditWorn,
}) => {
  const [inputState, setInputState] = useState<WornModel>(
    budget.edit ? budget.edit : initialFormState
  );

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // cheacking wornName ...
    if (inputState.wornName.trim() == "") {
      return onProblemsDetected(
        "El nombre del gasto es obligatorio",
        true,
        3000
      );
    }

    // validando el campo...
    if (
      isNaN(inputState.amount as number) ||
      (inputState.amount as number) <= 0
    )
      return onProblemsDetected(
        "El total del gasto es obligatorio (o puede ser invalido)",
        true,
        4000
      );

    if (!budget.edit)
      if (budget.available < Number(inputState.amount)) {
        // si no esta editando, lo comparo con el presupuesto disponible...
        return onProblemsDetected("No tiene suficiente dinero", true, 4000);
      }

    // si esta editando, tengo que ver si la cantidad nueva es mayor que la anterior
    // en ese caso, compararla con el presupuesto disponible (la diferencia)...
    // en caso de que no, no hace nada, solo ajustar la cantidad
    if (budget.edit && Number(inputState.amount) > Number(budget.edit.amount)) {
      // ver si la diferencia lo permite...
      const diff = Number(inputState.amount) - Number(budget.edit.amount);

      if (diff > budget.available) {
        return onProblemsDetected("No tiene suficiente dinero", true, 4000);
      }
    }

    if (budget.edit) {
      onEditWorn({ ...inputState });
      onCloseModal();
    } else onAddWorn({ ...inputState, uniqueId: generateId() });

    setInputState(initialFormState);
  };

  const options = [
    "ahorro",
    "comida",
    "casa",
    "gastos varios",
    "ocio",
    "salud",
    "suscripciones",
  ];

  const handleSelectChanges = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as WornTypes;
    setInputState({ ...inputState, type: selectedType });
  };

  const handleMouseOut = () => {
    onCloseModal();
  };

  const handleMouseInner = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    e.stopPropagation();

  return (
    <div
      onClick={handleMouseOut}
      className="bg-black bg-opacity-50 w-screen h-screen z-10 absolute flex items-start place-content-center"
    >
      <div
        onClick={handleMouseInner}
        className="mt-10 bg-gray-700 bg-opacity-70 rounded-lg p-4 flex place-items-center"
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <AiFillCloseSquare
            onClick={onCloseModal}
            className="text-blue-500 hover:text-white my-2 mx-auto text-center cursor-pointer"
            size={40}
          />

          <legend className="text-blue-400 text-center text-xl font-black py-1">
            {budget.edit ? "Editar gasto" : "Agregar nuevo gasto"}
          </legend>
          <select
            onChange={handleSelectChanges}
            className="p-2 border-2 rounded-lg uppercase"
            name="type"
            id="tipo"
          >
            {options.map((e) => {
              return (
                <option value={e} key={e}>
                  {e}
                </option>
              );
            })}
          </select>
          <label className="text-white font-bold py-2" htmlFor="nombre">
            Nombre del gasto
          </label>
          <input
            value={inputState.wornName}
            name={"wornName"}
            onChange={handleChanges}
            placeholder="Nombre del gasto"
            className="p-2 border-2 rounded-lg placeholder:font-light"
            type="text"
            id="nombre"
          />

          <label className="text-white font-bold py-2" htmlFor="cantidad">
            Cantidad
          </label>
          <input
            value={inputState.amount}
            name={"amount"}
            onChange={handleChanges}
            placeholder="Cantidad"
            className="p-2 border-2 rounded-lg placeholder:font-light"
            type="text"
            id="cantidad"
          />

          <label className="text-white font-bold py-2" htmlFor="tipo">
            Tipo de gasto
          </label>
          <input
            type="submit"
            value={budget.edit ? "Editar" : "Agregar"}
            className="mt-2 w-full text-white bg-blue-500 hover:bg-blue-800 font-bold p-2 rounded-lg placeholder:font-light"
          />
        </form>
      </div>
    </div>
  );
};
