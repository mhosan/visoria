import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as LMC from 'leaflet.markercluster';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
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
  private markerClusterGroup!: L.MarkerClusterGroup;

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
    this.map = L.map('map').setView(buenosAiresCenter, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    //this.layerGroup = L.layerGroup().addTo(this.map);
    this.markerClusterGroup = L.markerClusterGroup();
    this.map.addLayer(this.markerClusterGroup);
  }

  private addPointsToMap(data: any[]): void {
    const batchSize = 30000; // Tamaño del lote
    let index = 0;

    const addBatch = () => {
      const batch = data.slice(index, index + batchSize);
      batch.forEach(point => {
        const lat = parseFloat(point.latitud);
        const lng = parseFloat(point.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.circleMarker([lat, lng], {
            radius: 2,
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.5
          }).bindPopup(`Latitud: ${lat}, Longitud: ${lng}`);
          this.markerClusterGroup.addLayer(marker);
        }
      });
      index += batchSize;
      //alert(`Lote de ${batchSize} puntos agregado. ${index}`); // Alert al finalizar cada lote
      if (index < data.length) {
        setTimeout(addBatch, 100); // Espera 100ms antes de agregar el siguiente lote
      } else {
        //alert('Todos los puntos han sido agregados.'); // Alert final al terminar todos los puntos
      }
    };

    addBatch();
  }
}
