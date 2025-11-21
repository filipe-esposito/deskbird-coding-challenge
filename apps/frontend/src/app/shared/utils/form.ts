import { signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export function shouldDisplayError(control: AbstractControl | null) {
  return control && control.invalid && (control.dirty || control.touched);
}

export function noSpaceValidator(control: AbstractControl) {
  const value = control.value as string;
  if (value && value.includes(' ')) {
    return { noSpace: true };
  }
  return null;
}

export const roleOptions = signal([
  {
    label: 'Regular',
    value: false,
  },
  {
    label: 'Admin',
    value: true,
  },
]);
