import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function queryElementByTestId<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement {
  return fixture.debugElement.query(By.css(`[data-testid="${selector}"]`));
}

export function queryElementsByTestId<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(`[data-testid="${selector}"]`));
}
