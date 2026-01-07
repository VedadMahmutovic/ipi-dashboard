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
  error = '';
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
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  async submit(): Promise<void> {
    this.error = '';

    if (this.form.invalid) {
      this.error = 'Molimo popunite sva polja ispravno.';
      return;
    }

    try {
      await this.auth.register(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password,
        this.form.value.theme
      );

      this.router.navigate(['/login']);

    } catch (err: any) {

      switch (err.code) {
        case 'auth/email-already-in-use':
          this.error = 'Ovaj email je već registrovan.';
          break;

        case 'auth/invalid-email':
          this.error = 'Email adresa nije ispravna.';
          break;

        case 'auth/weak-password':
          this.error = 'Password mora imati najmanje 6 karaktera.';
          break;

        case 'auth/network-request-failed':
          this.error = 'Problem s internet konekcijom.';
          break;

        default:
          this.error = 'Došlo je do greške. Pokušajte ponovo.';
      }
    }
  }
}
