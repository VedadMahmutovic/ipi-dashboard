import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  themes = ['blue', 'spring', 'summer', 'autumn', 'winter'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      theme: ['blue'] 
    });
  }

  ngOnInit(): void {
    this.applyTheme('blue');

    this.form.get('theme')?.valueChanges.subscribe(theme => {
      this.applyTheme(theme);
    });
  }

  applyTheme(theme: string): void {
    this.themes.forEach(t =>
      this.renderer.removeClass(document.body, `${t}-theme`)
    );

    this.renderer.addClass(document.body, `${theme}-theme`);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.auth.register({
      id: crypto.randomUUID(),
      ...this.form.value
    });

    this.router.navigate(['/login']);
  }
}
