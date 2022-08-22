import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { HarvestService } from 'src/app/services/harvest/harvest.service';
import { EspService } from 'src/app/services/esp/esp.service';
import Swal from 'sweetalert2';
import { IESPData } from '../../../../shared/interfaces/interfaces';
import { faFaucet } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-harvest-irrigators',
  templateUrl: './harvest-irrigators.component.html',
  styleUrls: ['./harvest-irrigators.component.css']
})
export class HarvestIrrigatorsComponent implements OnInit {
  ESPData: IESPData[] = [];
  harvestId: string | number = "";
  harvest: any = "";
  espList: any[] = [];
  faFaucet = faFaucet;

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

  handleRegister(): void {
    this.router.navigate(['harvest/irrigators/irrigators-register', { e: btoa(this.harvestId.toString()) }]);
  }

  handleDelete(espId: string | number): void {
    Swal.fire({
      title: 'Excluir horta?',
      text: "Não será possível reverter esta ação",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0D7B6C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.espService.delete(espId).subscribe({
          next: res => {
            Swal.fire({
              title: 'Irrigador excluído com sucesso!',
              icon: 'success',
              confirmButtonColor: '#0D7B6C'
            })
          },
          error: err => {console.log(err)
            if (err.error) {
              Swal.fire(`${err.error.message}`, '', 'error');
    
              // this.ESPData = JSON.parse(err.error).message;
            } else {
              // this.content = "Error with status: " + err.status;
            }
          }
        });
        this.espList = this.espList.filter(item => item.id !== espId);
      }
    })
  }
}
