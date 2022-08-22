import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { HarvestService } from 'src/app/services/harvest/harvest.service';
import { EspService } from 'src/app/services/esp/esp.service';
import Swal from 'sweetalert2';
import { IESPData } from '../../../../../shared/interfaces/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-irrigators-data',
  templateUrl: './irrigators-data.component.html',
  styleUrls: ['./irrigators-data.component.css']
})
export class IrrigatorsDataComponent implements OnInit, AfterViewInit {
  espId: any = "";
  data: IESPData[] = [];

  displayedColumns: string[] = ['id', 'value', 'desc', 'created_at'];
  // dataSource!: MatTableDataSource<IESPData>;
  dataSource = new MatTableDataSource<IESPData>();

  faChartLine = faChartLine;

  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  resultsLength = 0;

  constructor(
    private dataService: DataService, 
    private activatedRoute: ActivatedRoute,
    private harvestService: HarvestService,
    private espService: EspService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.espId = atob(params.get("e") ?? "");    
    });

    if (this.espId) {
      this.dataService.getDataByESP(this.espId).subscribe({
        next: res => {
          this.data = res.data;
          this.dataSource.data = this.data;
          this.resultsLength = this.data.length;
          console.log(this.data);
        },
        error: err => {console.log(err)
          if (err.error) {
            Swal.fire(`${err.error.message}`, '', 'error');
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleManage(espId: string): void {
    this.router.navigate(['harvest/irrigators/irrigators-data/irrigators-charts', { e: btoa(espId.toString()) }]);
  }

  handleWaterPump(espId: string): void {
    this.espService.changePumpState(espId).subscribe({
      next: res => {
        Swal.fire('Bomba acionada com sucesso.', '', 'success');
      },
      error: err => {console.log(err)
        if (err.error) {
          Swal.fire(`${err.error.message}`, '', 'error');
        }
      }
    });
  }
}
