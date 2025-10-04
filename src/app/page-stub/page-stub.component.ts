import { Component } from '@angular/core';

@Component({
  selector: 'mv-page-stub',
  standalone: true,
  template: `<div class="stub">Page content will appear here.</div>`,
  styles: [
    `.stub{height:100%;display:flex;align-items:center;justify-content:center;color:#8ea0bf;}`
  ]
})
export class PageStubComponent {}


