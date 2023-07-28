import { WornModel } from "./worn_model";

export interface BudgetData {
    budget: string;
    available: number;
    worn: number;
    isValid: boolean;
    edit?: WornModel
}