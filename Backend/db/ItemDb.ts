import { Document } from "mongoose";

export interface ItemDb extends Document {
    name: string,
    desc: string,
    count: number,
    quantity: number,
    quantity_unit: string,
    mrp: number,
    selling_price: number,
    image_url: string,
    actual_required_qty: number,
    actual_required_unit: string,
    total_cost_at_mrp: number,
    actual_cost: number,
    unit_conversion_issues: boolean
};