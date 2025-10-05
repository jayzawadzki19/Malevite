import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-goal-track',
  standalone: true,
  templateUrl: './goal-track.component.html',
  styleUrl: './goal-track.component.scss'
})
export class GoalTrackComponent {
  @Input() icon: string = '⭐️';
  @Input() goal: string = '';
  @Input() progress: string = '';
  @Input() xp: number = 0;
  @Input() accent: string = '#6ec6ff';
}


