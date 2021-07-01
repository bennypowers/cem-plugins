interface BigBagOfProperties {
  name?: string;
  shoeSize?: number;
}

/** @element shoe-sizer */
export class ShoeSizer {
  /**
   * Sizes your shoes
   * @summary Shoe Size options
   */
  declare options: BigBagOfProperties;
}
