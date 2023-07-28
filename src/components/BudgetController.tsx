import Swal from "sweetalert2";
import { numberFormat } from "../helpers";
import { BudgetData } from "../models/budget_data";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";

interface BudgetControllerProps {
  budgetInput: BudgetData;
  onResetApp: () => void;
}

export const BudgetController: React.FC<BudgetControllerProps> = ({
  onResetApp,
  budgetInput,
}) => {
  const [percerntState, setPercerntState] = useState(
    Math.trunc((budgetInput.worn / Number(budgetInput.budget)) * 100)
  );

  useEffect(() => {
    setPercerntState(
      Math.trunc((budgetInput.worn / Number(budgetInput.budget)) * 100)
    );
    return () => {};
  }, [budgetInput]);

  const handleResetApp = async () => {
    const result = await Swal.fire({
      title: "¿Reiniciar la app?",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      onResetApp();
    }
  };

  return (
    <div className="grid grid-rows-1 grid-cols-2">
      <div style={{ width: 100, margin: "auto" }}>
        <CircularProgressbarWithChildren
          value={percerntState}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: "butt",
            // Text size
            pathTransitionDuration: 0.5,
            pathColor: `#3B82F6`,
            trailColor: "#F5F5F5",
          })}
        >
          {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
          <figure>
            <img
              style={{ width: 40, marginTop: -5 }}
              src="https://i.imgur.com/b9NyUGm.png"
              alt="doge"
            />
          </figure>
          <div style={{ fontSize: 10, marginTop: -5 }}>
            <strong>{`${percerntState}% gastado`}</strong>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="">
        <input
          className="uppercase px-3 py-2 bg-blue-500 w-full rounded-lg text-white hover:bg-blue-800"
          type="button"
          value={"reiniciar la app"}
          onClick={handleResetApp}
        />

        <p className="my-2">
          <span className="text-blue-500 font-bold ">Presupuesto:</span>{" "}
          <span className="font-light">
            {numberFormat(Number.parseFloat(budgetInput.budget))}
          </span>
        </p>

        <p className="my-2">
          <span className="text-blue-500 font-bold ">Disponible:</span>{" "}
          <span className="font-light">
            {numberFormat(budgetInput.available)}
          </span>
        </p>

        <p className="my-2">
          <span className="text-blue-500 font-bold ">Gastado:</span>{" "}
          <span className="font-light">{numberFormat(budgetInput.worn)}</span>
        </p>
      </div>
    </div>
  );
};
