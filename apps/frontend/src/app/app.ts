import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [RouterModule, ButtonModule],
  selector: 'dcc-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'deskbird Coding Challenge - frontend';
}
