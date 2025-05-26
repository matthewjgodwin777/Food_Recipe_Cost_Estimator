// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

export interface Item {
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