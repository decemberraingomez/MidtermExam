import { Component, signal } from '@angular/core';
import { LeaderForm } from './leader-form/leader-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LeaderForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('leader-app');
}
