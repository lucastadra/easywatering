import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HarvestService } from '../../../services/harvest/harvest.service';

@Component({
  selector: 'app-harvest-register',
  templateUrl: './harvest-register.component.html',
  styleUrls: ['./harvest-register.component.css']
})
export class HarvestRegisterComponent implements OnInit {
  form: any = {
    name: null,
    desc: null,
  };
  isSuccessful = false;
  isRegisterFailed = false;
  errorMessage = '';

  constructor(private harvestService: HarvestService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, desc } = this.form;

    this.harvestService.register(name, desc).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isRegisterFailed = false;
        this.router.navigate(['home']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isRegisterFailed = true;
      }
    });
  }
}
