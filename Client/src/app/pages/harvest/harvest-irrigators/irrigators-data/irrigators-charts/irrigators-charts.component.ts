import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

import { DataService } from 'src/app/services/data/data.service';
import { EspService } from 'src/app/services/esp/esp.service';
import { HarvestService } from 'src/app/services/harvest/harvest.service';
import { IESPData } from 'src/shared/interfaces/interfaces';
import Swal from 'sweetalert2';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-irrigators-charts',
  templateUrl: './irrigators-charts.component.html',
  styleUrls: ['./irrigators-charts.component.css']
})
export class IrrigatorsChartsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  // public chartOptions!: Partial<ChartOptions> | any;
  espId: any = "";
  data: IESPData[] = [];
  tempData: any[] = [];
  umidData:any[] = [];

  chartOptions: Partial<ChartOptions> | any = {
    series: [],
    chart: {
    height: 350,
    type: 'line',
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: 'Temperatura do Ar x Umidade',
    },
    noData: {
      text: 'Loading...'
    },
    xaxis: {
      type: 'category',
      tickPlacement: 'on',
      labels: {
        rotate: -15,
        rotateAlways: true
      }
    },
    yaxis: [
      {
        title: {
          text: 'Temperatura em ºC'
        }
      },
      {
        opposite: true,
        title: {
          text: 'Umidade em %'
        }
      }
    ]
  };

  constructor(
    private dataService: DataService, 
    private activatedRoute: ActivatedRoute,
    private harvestService: HarvestService,
    private espService: EspService,
    private router: Router
  ) { 

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.espId = atob(params.get("e") ?? "");    
    });

    if (this.espId) {
      this.dataService.getDataByESP(this.espId).subscribe({
        next: res => {
          this.data = res.data;
          console.log(this.data);

          this.data.forEach(item => {
            if (item.type == 1) {
              this.tempData.push({y: item.value, x: new Date(item.created_at).toLocaleString()});
            }
            if (item.type == 2) {
              this.umidData.push({y: item.value, x: new Date(item.created_at).toLocaleString()})
            }
          })
          this.chartOptions.series = [
            {
              data: this.tempData,
              name: "Temperatura do Ar"
            },
            {
              data: this.umidData,
              name: "Umidade do Ar"
            }
          ];

          this.chartOptions.yaxis = [
            {
              title: {
                text: 'Temperatura em ºC'
              }
            },
            {
              opposite: true,
              title: {
                text: 'Umidade em %'
              }
            }
          ]
          // this.chartOptions.series[0].data = null;
          // this.chartOptions.series[0].data = this.tempData;
          // this.chart.render();
          console.log(this.chartOptions );
          
        },
        error: err => {console.log(err)
          if (err.error) {
            Swal.fire(`${err.error.message}`, '', 'error');
          }
        }
      });
    }
  }

}
