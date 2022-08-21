import { Component } from '@angular/core';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ThemePalette } from '@angular/material/core';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn = false;
  full_name?: string;
  faSeedling = faSeedling;

  constructor(
    private storageService: StorageService, 
    private authService: AuthService,
    private router: Router
  ) { }

  routes = [['home', 'Hortas'], ['login', 'Login'], ['register', 'Cadastrar']];
  activeLink = this.routes[0][0];
  background: ThemePalette = 'primary';


  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (!this.isLoggedIn) {
      this.routes = [['login', 'Login'], ['register', 'Cadastrar']];
    } else {
      this.routes = [['home', 'Hortas'], ['profile', 'Perfil']];
    }

    this.activeLink = this.router.url === '/' ? 'home' : this.router.url;
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

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.activeLink = route;
  }
}
