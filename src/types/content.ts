/** Where a piece of content comes from (shown in source lists). */
export interface Source {
  title: string;
  url?: string;
  /**
   * Language of the title when it isn't translated, e.g. "nl" for a Dutch source.
   * Rendered as `lang`, so screen readers pronounce it correctly.
   */
  language?: string;
}
