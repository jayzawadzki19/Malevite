import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { TaskItemComponent } from '../common/task-item/task-item.component';

interface DailyTask { description: string; done: boolean; color: string; }

@Component({
  selector: 'mv-daily-page',
  standalone: true,
  imports: [NgFor, TaskItemComponent],
  templateUrl: './daily-page.component.html',
  styleUrl: './daily-page.component.scss'
})
export class DailyPageComponent {
  protected tasks: DailyTask[] = [
    { description: '10-minute sunlight exposure after wake-up', done: false, color: '#6ec6ff' },
    { description: 'Protein-rich breakfast (30g+)', done: false, color: '#00d2ff' },
    { description: '3L water throughout the day', done: false, color: '#bf5af2' },
    { description: '45-minute strength training', done: false, color: '#ff8a00' },
    { description: 'No screens 60 minutes before sleep', done: false, color: '#ff005d' }
  ];
}


