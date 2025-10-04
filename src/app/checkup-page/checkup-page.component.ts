import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HealthMetricSliderComponent } from '../common/health-metric-slider/health-metric-slider.component';

@Component({
  selector: 'mv-page-stub',
  standalone: true,
  imports: [NgFor, HealthMetricSliderComponent],
  template: `
    <div class="stack">
      <mv-health-metric-slider
        *ngFor="let m of metrics"
        [name]="m.name"
        [value]="m.value"
        (valueChange)="m.value = $event"
        [baseColor]="m.color"
        [unitIcon]="m.unitIcon">
        <div metric-icon class="emoji">{{ m.icon }}</div>
      </mv-health-metric-slider>
    </div>
  `,
  styles: [
    `.stack{height:100%;display:flex;flex-direction:column;gap:12px;overflow:auto;padding:4px 0 8px 0;}
     `
  ]
})
export class CheckupPageComponent {
  protected readonly metrics = [
    { name: 'Energy', value: 65, color: '#6ec6ff', icon: '⚡️', unitIcon: '💪' },
    { name: 'Mood', value: 75, color: '#00d2ff', icon: '😊', unitIcon: '💪' },
    { name: 'Sleep Quality', value: 80, color: '#bf5af2', icon: '🌙', unitIcon: '💪' },
    { name: 'Sex drive', value: 75, color: '#ff005d', icon: '👄', unitIcon: '💪' },
  ];
}


