import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'mv-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  protected readonly isSubmitting = signal(false);
  protected readonly loginMessage = signal<string | null>(null);
  protected readonly loginForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly router: Router) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.loginMessage.set(null);
    setTimeout(() => {
      const { email } = this.loginForm.value;
      console.log('Mock login success for:', email);
      this.isSubmitting.set(false);
      this.loginMessage.set('Logged in (mock)');
      this.router.navigate(['/app/checkup']);
    }, 600);
  }
}


