import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-area-card',
  standalone: true,
  templateUrl: './area-card.component.html',
  styleUrl: './area-card.component.scss'
})
export class AreaCardComponent {
  @Input() title: string = '';
  @Input() score: number = 0; // 0-100
  @Input() status: string = '';
  @Input() accentColor: string = '#6ec6ff';
  @Input() statusColor?: string;

  protected readonly radius = 28; // svg circle radius
  protected readonly circumference = 2 * Math.PI * this.radius;

  protected get dashOffset(): number {
    const clamped = Math.max(0, Math.min(100, Math.round(this.score)));
    return this.circumference - (this.circumference * clamped) / 100;
  }

  protected get resolvedStatusColor(): string {
    if (this.statusColor) return this.statusColor;
    const t = (this.status || '').toLowerCase();
    if (t.includes('opt')) return '#48d597';
    if (t.includes('need')) return '#ff6b6b';
    return '#f0a500';
  }
}


