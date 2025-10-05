import { Component } from '@angular/core';
import { NgFor, DecimalPipe } from '@angular/common';
import { GoalTrackComponent } from '../common/goal-track/goal-track.component';

@Component({
  selector: 'mv-dashboard-page',
  standalone: true,
  imports: [NgFor, DecimalPipe, GoalTrackComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  protected readonly goals = [
    { icon: '🌙', goal: 'Get 7.5h Sleep', progress: '4/7 days', xp: 50, accent: '#80d8ff' },
    { icon: '⚡️', goal: '3x Strength Training', progress: '2/3 sessions', xp: 50, accent: '#ffd54f' },
    { icon: '💊', goal: 'Optimize Zinc Intake', progress: '1/5 days', xp: 75, accent: '#ff80ab' }
  ];
  protected readonly data = [468, 476, 475, 489, 500];
  protected streak = 23;
  protected totalXp = 3847;
}


