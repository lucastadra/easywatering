import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { HarvestService } from 'src/app/services/harvest/harvest.service';
import { EspService } from 'src/app/services/esp/esp.service';
import Swal from 'sweetalert2';
import { IESPData } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-harvest-irrigators',
  templateUrl: './harvest-irrigators.component.html',
  styleUrls: ['./harvest-irrigators.component.css']
})
export class HarvestIrrigatorsComponent implements OnInit {
  ESPData: IESPData[] = [];
  harvestId: string | number = "";
  harvest: any = "";
  espList: any = [];

  constructor(
    private dataService: DataService, 
    private activatedRoute: ActivatedRoute,
    private harvestService: HarvestService,
    private espService: EspService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.harvestId = atob(params.get("e") ?? "");    
    });
    
    if (this.harvestId) {
      this.harvestService.getByHarvestId(this.harvestId).subscribe({
        next: res => {
          this.harvest = res.harvest;
        },
        error: err => {console.log(err)
          if (err.error) {
            Swal.fire(`${err.error.message}`, '', 'error');
          }
        }
      });

      this.espService.getByHarvestId(this.harvestId).subscribe({
        next: res => {
          this.espList = res.esps;
        },
        error: err => {
          console.log(err)
        }
      })
    }else{
      this.router.navigate(['']);
    }
  }

  handleManage(espId: string): void {
    this.router.navigate(['harvest/irrigators/irrigators-data', { e: btoa(espId.toString()) }]);
  }
}
