import AddWorns from "./../assets/img/nuevo-gasto.svg";

interface FloatingButtonProps {
  onOpenModal: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onOpenModal,
}) => {
  return (
    <div className="fixed text-2xl bottom-5 right-5">
      <img
        width={50}
        src={AddWorns}
        alt="agregar costo"
        className="text-black"
        onClick={() => onOpenModal()}
      />
    </div>
  );
};
