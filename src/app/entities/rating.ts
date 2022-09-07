import {ThemePalette} from '@angular/material/core';

export interface Rating {
  value: number;
  max: number;
  color?: ThemePalette;
  disabled?: boolean;
  dense?: boolean;
  readonly?: boolean;
}
