export type WornTypes =
  | "ahorro"
  | "comida"
  | "casa"
  | "gastos varios"
  | "ocio"
  | "salud"
  | "suscripciones";

export interface WornModel {
  wornName: string;
  amount: number | string;
  type: WornTypes;
  uniqueId: string;
  date: string;
}
