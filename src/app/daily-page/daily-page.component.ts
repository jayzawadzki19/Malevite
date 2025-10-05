import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { TaskItemComponent } from '../common/task-item/task-item.component';
import { ScoringService } from '../common/scoring/scoring.service';

interface DailyTask { description: string; done: boolean; color: string; }

@Component({
  selector: 'mv-daily-page',
  standalone: true,
  imports: [NgFor, TaskItemComponent],
  templateUrl: './daily-page.component.html',
  styleUrl: './daily-page.component.scss'
})
export class DailyPageComponent {
  protected tasks: { description: string; done: boolean; color: string; id: string }[] = [];

  constructor(private readonly scoring: ScoringService) {
    this.reloadTasks();
  }

  protected onToggle(id: string, checked: boolean): void {
    this.scoring.toggleTask(id, checked);
    this.reloadTasks();
  }

  private reloadTasks(): void {
    this.tasks = this.scoring.loadTodayTasks().map(x => ({
      id: x.task.id,
      description: x.task.description,
      color: x.task.color,
      done: x.state.done
    }));
  }
}


