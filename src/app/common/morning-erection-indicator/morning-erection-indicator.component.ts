import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mv-morning-erection-indicator',
  standalone: true,
  templateUrl: './morning-erection-indicator.component.html',
  styleUrl: './morning-erection-indicator.component.scss'
})
export class MorningErectionIndicatorComponent {
  @Input() label: string = 'Morning erection';
  @Input() value: boolean = true; // true => down (horizontal), false => up (vertical)
  @Output() valueChange = new EventEmitter<boolean>();
  protected toggle(): void {
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }
}


