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
export class MapaComponent implements OnInit{
  private map!: L.Map;

  constructor(private dataFromCSVService: DataFromCSVService) { }

  ngOnInit(): void {
    this.initMap();
    this.dataFromCSVService.getCSVData().subscribe(data => {
      console.log(data);
      // Puedes usar los datos aquí
    });
  }

  private initMap(): void {
    const buenosAiresCenter: L.LatLngTuple = [-36.6167, -60.7000];
    this.map = L.map('map').setView(buenosAiresCenter, 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    
    const defaultIcon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = defaultIcon;
   
    //L.marker([51.505, -0.09]).addTo(this.map)
    //  .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //  .openPopup();
  }
}
