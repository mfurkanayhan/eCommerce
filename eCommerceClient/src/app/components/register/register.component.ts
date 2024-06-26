import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { api } from '../../constants/api';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private http: HttpClient,
    private router: Router,
    private error: ErrorService
  ){}

  signUp(form:NgForm) {
    if (form.valid) {
      this.http.post(`${api}/Auth/Register`, form.value)
      .subscribe({
        next: (res:any)=> {
          this.router.navigateByUrl("/login");
        },
        error: (err: HttpErrorResponse)=> this.error.errorHandler(err)
      })
    }
  }
}