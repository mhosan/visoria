import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent {

  single = [];
  histogramData: { name: string; value: number }[] = [];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  view: [number, number] = [1200, 500];

  ngOnInit() {
    this.loadCSV();
  }

  loadCSV() {
    Papa.parse('/assets/data/lotesDepurado.csv', {
      download: true,
      header: true,
      complete: (result) => {
        console.log('Parsed CSV: ', result);
        this.processData(result.data);
      },
      transformHeader: (header, index) => {
        const headers = ['valor', 'latitud', 'longitud', 'area'];
        return headers[index];
      }
    });
  }

  processData(data: any) {
    // Process data to create histogram data
    const histogram: { [key: string]: number } = {};
    data.forEach((row: any) => {
      const value = row['valor']; // Adjust based on your CSV structure
      if (!histogram[value]) {
        histogram[value] = 0;
      }
      histogram[value]++;
    });

    this.histogramData = Object.keys(histogram).map(key => ({
      name: key,
      value: histogram[key]
    }));
  }

}
