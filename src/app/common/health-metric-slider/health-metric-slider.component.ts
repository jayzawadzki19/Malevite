import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'mv-health-metric-slider',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet, MatSliderModule],
  templateUrl: './health-metric-slider.component.html',
  styleUrl: './health-metric-slider.component.scss'
})
export class HealthMetricSliderComponent {
  @Input({ required: true }) name!: string;
  @Input() value = 0; // 0-100
  @Input() baseColor: string = '#3a7bd5';
  @Input() unitIcon: string = '💪';
  @Output() valueChange = new EventEmitter<number>();

  protected readonly unitCount = 10;
  protected get activeUnits(): number {
    const v = Math.min(100, Math.max(0, Number(this.value) || 0));
    return Math.floor(v / 10);
  }

  protected unitArray(): number[] {
    return Array.from({ length: this.unitCount }, (_, i) => i);
  }

  protected onInput(event: any): void {
    const next = Math.min(100, Math.max(0, Number(event.value ?? event.target?.value ?? 0)));    
    this.valueChange.emit(next);
  }
}


