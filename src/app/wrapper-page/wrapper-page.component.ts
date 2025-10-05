import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'mv-wrapper-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './wrapper-page.component.html',
  styleUrl: './wrapper-page.component.scss'
})
export class WrapperPageComponent {
  constructor(private readonly router: Router) {}

  protected isCheckupActive(): boolean {
    const url = this.router.url;
    return url.startsWith('/app/checkup') || url.startsWith('/app/daily');
  }
}


