import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
//import 'leaflet.markercluster';
import { DataFromCSVService } from '../../services/data-from-csv.service';


@Component({
  selector: 'app-mapa-leaflet',
  standalone: true,
  imports: [],
  templateUrl: './mapaLeaflet.component.html',
  styleUrl: './mapaLeaflet.component.css'
})
export class MapaLeafletComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private layerGroup!: L.LayerGroup;
  //private markerClusterGroup!: L.MarkerClusterGroup;

  constructor(private dataFromCSVService: DataFromCSVService) { }

  ngOnInit(): void {
    //this.dataFromCSVService.getCSVData().subscribe(data => {
    //  this.addPointsToMap(data);
    //});
  }

  ngAfterViewInit() {
    //this.initMap();
    setTimeout(() => {
      this.initMap();
      this.dataFromCSVService.getCSVData().subscribe(data => {
        this.addPointsToMap(data);
      });
    }, 500);
    
    window.addEventListener('resize', this.onResize); // Agregar listener
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize); // Remover listener
    if (this.map) {
      this.map.remove(); // Elimina el mapa de Leaflet
  }
  }
  private onResize = () => {
    if (this.map) {
      setTimeout(() => { // Timeout para asegurar que el DOM se actualice
        this.map.invalidateSize();
      }, 100);
    }
  }

  private initMap(): void {
    
    const buenosAiresCenter: L.LatLngTuple = [-36.6167, -60.7000];
    this.map = L.map('map').setView(buenosAiresCenter, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.layerGroup = L.layerGroup().addTo(this.map);
    //this.markerClusterGroup = L.markerClusterGroup();
    //this.map.addLayer(this.markerClusterGroup);
  }

  private addPointsToMap(data: any[]): void {
    if (!this.map) {
      console.error("El mapa no se ha inicializado todavía!");
      return; // Sale de la función si el mapa no está listo
    }
  
    const batchSize = 10000; // Tamaño del lote
    let index = 0;

    const addBatch = () => {
      const batch = data.slice(index, index + batchSize);
      batch.forEach(point => {
        const lat = parseFloat(point.latitud);
        const lng = parseFloat(point.longitud);
        //console.log(`Latitud: ${lat}, Longitud: ${lng}`);
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.circleMarker([lat, lng], {
            radius: 2,
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.5
          }).bindPopup(`Latitud: ${lat}, Longitud: ${lng}`);
          this.layerGroup.addLayer(marker);
        } else {
          console.error(`Coordenadas inválidas: Latitud: ${point.latitud}, Longitud: ${point.longitud}`);
        }
      });
      index += batchSize;
      //if (index < data.length) {
      if (index < 30000) {
        console.log(`Agregados ${index} puntos de ${data.length}`);
        //setTimeout(addBatch, 500);
        requestAnimationFrame(addBatch); // Usar requestAnimationFrame
      } else {
        console.log(`Agregados ${index} puntos de un total de ${data.length}.`);
      }
    };
    //addBatch();
    requestAnimationFrame(addBatch); // Iniciar con requestAnimationFrame
  }
}
