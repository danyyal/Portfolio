export class MaterialResponse {
  id?: number;
  dimension_a?: number;
  density?: number;

  dimension_a_unit?: string;
  dimension_b?: number;
  dimension_b_unit?: string;
  dimension_c?: number;
  dimension_c_unit?: string;
  priceUnit?: string;
  additionalPriceUnit?: string;
  chargeAdditional?: boolean;
  is_edit_price?: boolean;
  edit_price_fields?: Array<{
    from_quantity: number;
    cost_per_piece: number | "";
  }>;
  price?: number;
  shape?: string;
  worker?: string;
  note?: string;
  materialId?: string;
  pricePerPiece?: number;
}
