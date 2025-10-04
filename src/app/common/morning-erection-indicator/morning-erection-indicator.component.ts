import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'mv-morning-erection-indicator',
  standalone: true,
  templateUrl: './morning-erection-indicator.component.html',
  styleUrl: './morning-erection-indicator.component.scss'
})
export class MorningErectionIndicatorComponent {
  @Input() label: string = 'Morning erection';
  protected readonly isDown = signal(true);
  protected toggle(): void { this.isDown.update(v => !v); }
}


