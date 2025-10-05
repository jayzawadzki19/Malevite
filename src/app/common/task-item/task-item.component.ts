import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mv-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() description: string = '';
  @Input() checked: boolean = false;
  @Input() baseColor: string = '#3a7bd5';
  @Output() checkedChange = new EventEmitter<boolean>();

  protected toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}


