import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HarvestService } from '../../../../services/harvest/harvest.service';
import { EspService } from '../../../../services/esp/esp.service';
import { faFaucet } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-irrigators-register',
  templateUrl: './irrigators-register.component.html',
  styleUrls: ['./irrigators-register.component.css']
})
export class IrrigatorsRegisterComponent implements OnInit {
  form: any = {
    alias: null,
    harvest_id: null,
  };
  isSuccessful = false;
  isRegisterFailed = false;
  errorMessage = '';
  faFaucet = faFaucet;
  harvestId: string | number = '';

  constructor(
    private espService: EspService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.harvestId = atob(params.get("e") ?? '');  
      if (!this.harvestId || this.harvestId === '') {
        this.router.navigate(['home']);
      }  
    });
  }

  onSubmit(): void {
    const { alias } = this.form;

    this.espService.register(alias, this.harvestId).subscribe({
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
