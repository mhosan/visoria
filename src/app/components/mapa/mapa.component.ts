import { Component, OnInit, AfterViewInit  } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { DataFromCSVService } from '../../services/data-from-csv.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
    selector: 'app-mapa',
    standalone: true,
    imports: [HttpClientModule],
    templateUrl: './mapa.component.html',
    styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit, AfterViewInit  {
  private map!: L.Map;
  //private layerGroup!: L.LayerGroup;
  private markerClusterGroup!: L.MarkerClusterGroup;

  constructor(private dataFromCSVService: DataFromCSVService) { }

  ngOnInit(): void {
    this.dataFromCSVService.getCSVData().subscribe(data => {
      this.addPointsToMap(data);
    });
  }
  
  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
  // Sobrescribir el método on de L.DomEvent para usar listeners pasivos
  const originalOn = L.DomEvent.on;
  L.DomEvent.on = function(
    el: HTMLElement,
    types: string | { [eventName: string]: L.DomEvent.EventHandlerFn },
    fn?: L.DomEvent.EventHandlerFn | any,
    context?: any
  ): typeof L.DomEvent {
    if (typeof types === 'string' && typeof fn === 'function') {
      const passiveTypes = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
      if (passiveTypes.some(type => types.indexOf(type) !== -1)) {
        types.split(' ').forEach(type => {
          el.addEventListener(type, fn, { passive: true });
        });
        return L.DomEvent;
      }
    }
    // Usar apply para pasar los argumentos correctamente
    return originalOn.apply(L.DomEvent, arguments as any);
  };
 
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
