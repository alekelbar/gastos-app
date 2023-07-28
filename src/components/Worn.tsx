import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

import { numberFormat } from "../helpers";
import { WornModel } from "../models/worn_model";

import FoodIcon from "./../assets/img/icono_comida.svg";
import SavingIcon from "./../assets/img/icono_ahorro.svg";
import HomeIcon from "./../assets/img/icono_casa.svg";
import LeisureIcon from "./../assets/img/icono_ocio.svg";
import WornsIcon from "./../assets/img/icono_gastos.svg";
import HealthIcon from "./../assets/img/icono_salud.svg";
import SuscriptionIcon from "./../assets/img/icono_suscripciones.svg";
import { BudgetData } from "../models/budget_data";

const iconsDictionay = {
  ahorro: SavingIcon,
  comida: FoodIcon,
  casa: HomeIcon,
  "gastos varios": WornsIcon,
  ocio: LeisureIcon,
  salud: HealthIcon,
  suscripciones: SuscriptionIcon,
};

interface WornProps {
  model: WornModel;
  onRemoveWorn: (worn: WornModel) => void;
  onBudgetChange: (newBudget: BudgetData) => void;
  budget: BudgetData;
  onOpenModal: () => void;
}

export const Worn: React.FC<WornProps> = ({
  model,
  onRemoveWorn,
  onBudgetChange,
  budget,
  onOpenModal,
}) => {
  const handleLeadingActions = () => (
    <LeadingActions>
      <SwipeAction
        onClick={() => {
          onBudgetChange({ ...budget, edit: model });
          onOpenModal();
        }}
      >
        <div className="w-full flex items-center place-content-center rounded-lg bg-green-400">
          <p className="text-center text-2xl text-white font-bold ">Editar</p>
        </div>
      </SwipeAction>
    </LeadingActions>
  );

  const handleTrailingAction = () => (
    <TrailingActions>
      <SwipeAction onClick={() => onRemoveWorn(model)}>
        <div className="w-full flex items-center place-content-center rounded-lg bg-red-400">
          <p className="text-center text-2xl text-white font-bold ">Eliminar</p>
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <div className="w-full">
      <SwipeableList>
        <SwipeableListItem
          leadingActions={handleLeadingActions()}
          trailingActions={handleTrailingAction()}
        >
          <div className="mx-auto bg-white sm:p-5 mb-3 md:w-2/3 w-[95%] shadow-xl rounded-xl grid grid-cols-6 grid-row-1">
            <figure className="col-span-1 w-full p-2 object-cover m-auto">
              <img className="w-full" src={iconsDictionay[model.type]} />
            </figure>
            <div className="col-span-3 sm:col-span-4">
              <h2 className="text-gray-700 font-light text-xl">
                {model.type.toUpperCase()}
              </h2>
              <h2 className="text-gray-600 font-bold text-xl">
                {model.wornName[0].toUpperCase() + model.wornName.slice(1)}
              </h2>
              <h2 className="text-black">Agregado: {model.date}</h2>
            </div>
            <h2 className="col-span-2 md:col-span-1 w-full font-black text-gray-700">
              {numberFormat(Number(model.amount))}
            </h2>
          </div>
        </SwipeableListItem>
      </SwipeableList>
    </div>
  );
};
