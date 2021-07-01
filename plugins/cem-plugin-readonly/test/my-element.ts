/** @element read-only */
export class ReadOnly {
  static get x() { return 'x'; }
  static readonly y = 'y';
  /** @readonly */
  static z = 'z';
  readonly x = 'x';
  get y() { return 'y'; }
  /** @readonly */
  z = 'z';
}
