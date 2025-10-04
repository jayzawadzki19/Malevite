import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'mv-wrapper-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './wrapper-page.component.html',
  styleUrl: './wrapper-page.component.scss'
})
export class WrapperPageComponent {}


