export interface Ingredient {
    id: number;
    name: string;
    unit_id: number;
    description: string;
    quantity: number;
    warning_limits:number;
    isactive: boolean;
}