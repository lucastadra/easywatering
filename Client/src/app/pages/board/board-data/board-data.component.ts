import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { IESPData } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-board-data',
  templateUrl: './board-data.component.html',
  styleUrls: ['./board-data.component.css']
})
export class BoardDataComponent implements OnInit {
  ESPData: IESPData[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getDataByESP().subscribe({
      next: res => {
        this.ESPData = res.data;
        console.log(this.ESPData);
      },
      error: err => {console.log(err)
        if (err.error) {
          this.ESPData = JSON.parse(err.error).message;
        } else {
          // this.content = "Error with status: " + err.status;
        }
      }
    });
  }

}
