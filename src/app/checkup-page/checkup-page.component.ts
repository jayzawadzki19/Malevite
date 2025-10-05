import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { HealthMetricSliderComponent } from '../common/health-metric-slider/health-metric-slider.component';
import { MorningErectionIndicatorComponent } from '../common/morning-erection-indicator/morning-erection-indicator.component';
import { ScoringService } from '../common/scoring/scoring.service';

@Component({
  selector: 'mv-page-stub',
  standalone: true,
  imports: [NgFor, HealthMetricSliderComponent, MorningErectionIndicatorComponent],
  templateUrl: './checkup-page.component.html',
  styleUrl: './checkup-page.component.scss'
})
export class CheckupPageComponent {
  protected morningDown = true;
  protected readonly metrics = [
    { name: 'Energy', value: 50, color: '#c4b229', icon: '⚡️', unitIcon: '💪' },
    { name: 'Mood', value: 50, color: '#00d2ff', icon: '😊', unitIcon: '💪' },
    { name: 'Sleep Quality', value: 50, color: '#bf5af2', icon: '🌙', unitIcon: '💪' },
    { name: 'Sex drive', value: 50, color: '#ff005d', icon: '👄', unitIcon: '💪' },
  ];

  constructor(private readonly router: Router, private readonly scoring: ScoringService) {}

  protected onSubmit(): void {
    const payload = {
      morningErectionDown: this.morningDown,
      metrics: this.metrics.map(m => ({ name: m.name, value: m.value }))
    };
    console.log('Checkup submit:', payload);
    try {
      localStorage.setItem('malevite.hasSubmittedMetrics', 'true');
      localStorage.setItem('malevite.lastMetrics', JSON.stringify(payload));
    } catch {}

    this.scoring.submitCheckup(payload);
    this.router.navigate(['/app/daily']);
  }
}


