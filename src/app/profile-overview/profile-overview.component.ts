import { Component } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoringService } from '../common/scoring/scoring.service';

@Component({
  selector: 'mv-profile-overview',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DecimalPipe],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss'
})
export class ProfileOverviewComponent {
  protected profile = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    twoFactor: false,
    gender: 'Male',
    dob: '',
    timeZone: 'GMT+0',
    connectedApps: 'None',
    units: 'Imperial',
    verified: true,
    avatarDataUrl: ''
  };

  protected uploads: string[] = [];
  protected reports: string[] = [];

  constructor(public readonly scoring: ScoringService) {
    this.loadFromStorage();
  }

  protected onAvatarSelect(event: any): void {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profile.avatarDataUrl = String(reader.result || '');
      this.saveToStorage();
    };
    reader.readAsDataURL(file);
  }

  protected onFilesSelect(event: any): void {
    const files: FileList | undefined = event?.target?.files;
    if (!files || !files.length) return;
    const names = Array.from(files).map(f => f.name);
    this.uploads = [...this.uploads, ...names];
    this.saveToStorage();
  }

  protected openFilesDialog(): void {
    try {
      const el = document.getElementById('filesInput') as HTMLInputElement | null;
      el?.click();
    } catch {}
  }

  protected onReportsSelect(event: any): void {
    const files: FileList | undefined = event?.target?.files;
    if (!files || !files.length) return;
    const names = Array.from(files).map(f => f.name);
    this.reports = [...this.reports, ...names];
    this.saveToStorage();
  }

  protected removeUpload(name: string): void {
    this.uploads = this.uploads.filter(n => n !== name);
    this.saveToStorage();
  }

  protected removeReport(name: string): void {
    this.reports = this.reports.filter(n => n !== name);
    this.saveToStorage();
  }

  protected saveChanges(): void {
    this.saveToStorage();
    alert('Profile saved');
  }

  protected deleteAccount(): void {
    if (!confirm('Delete account data from this device?')) return;
    try {
      localStorage.removeItem('malevite.profile');
      localStorage.removeItem('malevite.profile.uploads');
      localStorage.removeItem('malevite.profile.reports');
    } catch {}
    this.profile = {
      username: '', fullName: '', email: '', password: '', twoFactor: false, gender: 'Male', dob: '', timeZone: 'GMT+0', connectedApps: 'None', units: 'Imperial', verified: false, avatarDataUrl: ''
    };
    this.uploads = [];
    this.reports = [];
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem('malevite.profile');
      if (raw) this.profile = { ...this.profile, ...JSON.parse(raw) };
      const u = localStorage.getItem('malevite.profile.uploads');
      const r = localStorage.getItem('malevite.profile.reports');
      this.uploads = u ? JSON.parse(u) : [];
      this.reports = r ? JSON.parse(r) : [];
    } catch {}
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('malevite.profile', JSON.stringify(this.profile));
      localStorage.setItem('malevite.profile.uploads', JSON.stringify(this.uploads));
      localStorage.setItem('malevite.profile.reports', JSON.stringify(this.reports));
    } catch {}
  }
}


