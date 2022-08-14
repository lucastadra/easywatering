import { Component } from '@angular/core';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  full_name?: string;

  constructor(
    private storageService: StorageService, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if(!this.authService.isTokenExpired()){
      Swal.fire('Faça login para acessar o sistema.', '', 'info');
      this.router.navigate(['login']);
    }

    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();

      this.full_name = user.full_name;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean();
        this.router.navigate(['login']);
      },
      error: err => {
        console.log(err);
      }
    });
    
    window.location.reload();
  }
}
