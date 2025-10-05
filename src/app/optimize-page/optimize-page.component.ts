import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { AreaCardComponent } from '../common/area-card/area-card.component';

@Component({
  selector: 'mv-optimize-page',
  standalone: true,
  imports: [NgFor, AreaCardComponent],
  templateUrl: './optimize-page.component.html',
  styleUrl: './optimize-page.component.scss'
})
export class OptimizePageComponent {
  protected overallScore = 57;

  protected readonly cards = [
    { title: 'Energy Levels', score: 67, status: 'Improving', accent: '#ffd54f', icon: '⚡️' },
    { title: 'Muscle Mass', score: 42, status: 'Improving', accent: '#ff80ab', icon: '🏋️‍♂️' },
    { title: 'Sex Drive', score: 55, status: 'Improving', accent: '#ff5252', icon: '🔥' },
    { title: 'Mental State', score: 78, status: 'Optimized', accent: '#b388ff', icon: '🧠' },
    { title: 'Sleep Quality', score: 60, status: 'Improving', accent: '#80d8ff', icon: '🌙' },
    { title: 'Recovery', score: 35, status: 'Needs Work', accent: '#69f0ae', icon: '🔄' },
    { title: 'Memory & Focus', score: 48, status: 'Improving', accent: '#ffab40', icon: '🎯' },
    { title: 'Motivation', score: 72, status: 'Optimized', accent: '#00e5ff', icon: '🚀' }
  ];
}


