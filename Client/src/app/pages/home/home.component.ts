import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HarvestService } from 'src/app/services/harvest/harvest.service';
import Swal from 'sweetalert2';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  harvests: any[] = [];
  faSeedling = faSeedling;

  constructor(private harvestService: HarvestService, private router: Router) { }

  ngOnInit(): void {
    this.harvestService.getAll().subscribe({
      next: res => {
        this.harvests = res.harvests;
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
  }

  handleDelete(harvestId: string | number): void {
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
        this.harvestService.deleteHarvest(harvestId).subscribe({
          next: res => {
            Swal.fire({
              title: 'Horta excluída com sucesso!',
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
        this.harvests = this.harvests.filter(item => item.id !== harvestId);
      }
    })
  }

  handleManage(harvestId: string | number): void {
    this.router.navigate(['harvest/irrigators', { e: btoa(harvestId.toString()) }]);
  }

  handleEdit(harvestId: string | number): void {
    this.router.navigate(['harvest/edit', { e: btoa(harvestId.toString()) }]);
  }

  handleNewHarvest(): void {
    this.router.navigate(['harvest/register']);
  }
}
