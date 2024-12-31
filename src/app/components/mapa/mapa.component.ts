import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataFromCSVService } from '../../services/data-from-csv.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {
  private map!: L.Map;
  private layerGroup!: L.LayerGroup;

  constructor(private dataFromCSVService: DataFromCSVService) { }

  ngOnInit(): void {
    this.initMap();
    this.dataFromCSVService.getCSVData().subscribe(data => {
      //console.log(data[0].latitud, data[0].longitud);
      this.addPointsToMap(data);
    });
  }

  private initMap(): void {
    const buenosAiresCenter: L.LatLngTuple = [-36.6167, -60.7000];
    this.map = L.map('map').setView(buenosAiresCenter, 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.layerGroup = L.layerGroup().addTo(this.map);
  }

  private addPointsToMap(data: any[]): void {
    const batchSize = 10000; // Tamaño del lote
    let index = 0;

    const addBatch = () => {
      const batch = data.slice(index, index + batchSize);
      batch.forEach(point => {
        const lat = parseFloat(point.latitud);
        const lng = parseFloat(point.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          L.circleMarker([lat, lng], {
            radius: 3,
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.5
          }).bindPopup(`Latitud: ${lat}, Longitud: ${lng}`).addTo(this.layerGroup);
       }
      });
      index += batchSize;
      alert(`Lote de ${batchSize} puntos agregado. ${index}`); // Alert al finalizar cada lote
      if (index < data.length) {
        setTimeout(addBatch, 100); // Espera 100ms antes de agregar el siguiente lote
      } else {
        alert('Todos los puntos han sido agregados.'); // Alert final al terminar todos los puntos
      }
    };

    addBatch();
  }
}
