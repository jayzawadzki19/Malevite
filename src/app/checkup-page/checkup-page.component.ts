import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HealthMetricSliderComponent } from '../common/health-metric-slider/health-metric-slider.component';
import { MorningErectionIndicatorComponent } from '../common/morning-erection-indicator/morning-erection-indicator.component';

@Component({
  selector: 'mv-page-stub',
  standalone: true,
  imports: [NgFor, HealthMetricSliderComponent, MorningErectionIndicatorComponent],
  templateUrl: './checkup-page.component.html',
  styleUrl: './checkup-page.component.scss'
})
export class CheckupPageComponent {
  protected readonly metrics = [
    { name: 'Energy', value: 65, color: '#6ec6ff', icon: '⚡️', unitIcon: '💪' },
    { name: 'Mood', value: 75, color: '#00d2ff', icon: '😊', unitIcon: '💪' },
    { name: 'Sleep Quality', value: 80, color: '#bf5af2', icon: '🌙', unitIcon: '💪' },
    { name: 'Sex drive', value: 75, color: '#ff005d', icon: '👄', unitIcon: '💪' },
  ];
}


