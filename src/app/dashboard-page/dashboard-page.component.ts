import { Component } from '@angular/core';
import { NgFor, DecimalPipe } from '@angular/common';
import { GoalTrackComponent } from '../common/goal-track/goal-track.component';
import { ScoringService } from '../common/scoring/scoring.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'mv-dashboard-page',
  standalone: true,
  imports: [NgFor, DecimalPipe, GoalTrackComponent, NgIf],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  protected readonly goals = [
    { icon: '🌙', id: 'sleep', accent: '#80d8ff' },
    { icon: '⚡️', id: 'strength', accent: '#ffd54f' },
    { icon: '💧', id: 'hydration', accent: '#ff80ab' }
  ] as const;
  protected readonly data = [468, 476, 475, 489, 500];
  constructor(public readonly scoring: ScoringService) {}

  protected goalView(id: string): { goal: string; progress: string; xp: number } {
    const list = this.scoring.dashboardGoals();
    const found = list.find(g => g.id === id);
    return found ? { goal: found.goal, progress: found.progress, xp: found.xp } : { goal: '', progress: '', xp: 0 };
  }
}


