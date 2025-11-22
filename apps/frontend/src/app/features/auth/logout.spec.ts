import { LogoutComponent } from './logout';
import { AuthService } from './auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { queryElementByTestId } from '../../shared/utils/unit-tests';

describe('LogoutComponent', () => {
  let fixture: ComponentFixture<LogoutComponent>;
  let component: LogoutComponent;
  const authServiceSpy = { logout: jest.fn() };

  beforeEach(async () => {
    authServiceSpy.logout.mockClear();

    await TestBed.configureTestingModule({
      imports: [LogoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        importProvidersFrom(BrowserAnimationsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the main button is clicked', () => {
    it('should make the dialog visible', () => {
      const mainButtonEl = queryElementByTestId<LogoutComponent>(
        fixture,
        'logout-button'
      );

      mainButtonEl.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const confirmLogoutDialogEl = queryElementByTestId<LogoutComponent>(
        fixture,
        'confirm-logout-dialog'
      );
      const isDialogVisible =
        confirmLogoutDialogEl.nativeNode.childNodes.length > 0;
      expect(isDialogVisible).toBe(true);
    });
  });

  describe('when the user confirms the logout', () => {
    beforeEach(() => {
      makeDialogVisible(fixture);
    });

    it('should hide the dialog', () => {
      const confirmLogoutButtonEl = queryElementByTestId<LogoutComponent>(
        fixture,
        'confirm-logout-button'
      );

      confirmLogoutButtonEl.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(component.displayDialog()).toBe(false);
    });

    it('should call service method', () => {
      const confirmLogoutButtonEl = queryElementByTestId<LogoutComponent>(
        fixture,
        'confirm-logout-button'
      );

      confirmLogoutButtonEl.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(authServiceSpy.logout).toHaveBeenCalled();
    });
  });

  describe('when the user cancels the logout', () => {
    beforeEach(() => {
      makeDialogVisible(fixture);
    });

    it('should hide the dialog', () => {
      const cancelLogoutButtonEl = queryElementByTestId<LogoutComponent>(
        fixture,
        'cancel-logout-button'
      );

      cancelLogoutButtonEl.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(component.displayDialog()).toBe(false);
    });

    it('should NOT call service method', () => {
      const cancelLogoutButtonEl = queryElementByTestId<LogoutComponent>(
        fixture,
        'cancel-logout-button'
      );

      cancelLogoutButtonEl.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(authServiceSpy.logout).not.toHaveBeenCalled();
    });
  });
});

function makeDialogVisible(fixture: ComponentFixture<LogoutComponent>) {
  const mainButtonEl = queryElementByTestId<LogoutComponent>(
    fixture,
    'logout-button'
  );
  mainButtonEl.nativeElement.dispatchEvent(new Event('click'));
  fixture.detectChanges();
}
