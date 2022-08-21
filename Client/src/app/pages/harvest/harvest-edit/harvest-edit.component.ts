import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HarvestService } from '../../../services/harvest/harvest.service';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-harvest-edit',
  templateUrl: './harvest-edit.component.html',
  styleUrls: ['./harvest-edit.component.css']
})
export class HarvestEditComponent implements OnInit {
  form: any = {
    name: null,
    desc: null,
  };
  isSuccessful = false;
  isEditFailed = false;
  errorMessage = '';
  harvestId: string | number = '';
  faSeedling = faSeedling;

  constructor(
    private harvestService: HarvestService, 
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
    
    if (this.harvestId) {
      this.harvestService.getByHarvestId(this.harvestId).subscribe({
        next: res => {
          this.form.name = res.harvest.name;
          this.form.desc = res.harvest.desc
        },
        error: err => {console.log(err)
          if (err.error) {
            Swal.fire(`${err.error.message}`, '', 'error');
          }
        }
      });
    }
  }

  onSubmit(): void {
    const { name, desc } = this.form;

    this.harvestService.edit(name, desc, this.harvestId).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isEditFailed = false;
        this.router.navigate(['home']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isEditFailed = true;
      }
    });
  }
}
