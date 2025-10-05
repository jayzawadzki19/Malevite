import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { AreaCardComponent } from '../common/area-card/area-card.component';
import { ScoringService } from '../common/scoring/scoring.service';

@Component({
  selector: 'mv-optimize-page',
  standalone: true,
  imports: [NgFor, AreaCardComponent],
  templateUrl: './optimize-page.component.html',
  styleUrl: './optimize-page.component.scss'
})
export class OptimizePageComponent {
  constructor(public readonly scoring: ScoringService) {}

  protected get overallScore(): number {
    return this.scoring.overallScore();
  }

  protected get cards(): { title: string; score: number; status: string; accent: string; icon: string }[] {
    const areas = this.scoring.areaScores();
    const make = (title: string, accent: string, icon: string) => ({
      title,
      score: Math.round(areas[title] ?? 50),
      status: (areas[title] ?? 50) >= 70 ? 'Optimized' : (areas[title] ?? 50) >= 50 ? 'Improving' : 'Needs Work',
      accent,
      icon
    });
    return [
      make('Energy Levels', '#ffd54f', '⚡️'),
      make('Muscle Mass', '#ff80ab', '🏋️‍♂️'),
      make('Sex Drive', '#ff5252', '🔥'),
      make('Mental State', '#b388ff', '🧠'),
      make('Sleep Quality', '#80d8ff', '🌙'),
      make('Recovery', '#69f0ae', '🔄'),
      make('Memory & Focus', '#ffab40', '🎯'),
      make('Motivation', '#00e5ff', '🚀')
    ];
  }
}


