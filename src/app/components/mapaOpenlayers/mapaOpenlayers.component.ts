import { Component, OnInit, AfterViewInit } from '@angular/core';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { DataFromCSVService } from '../../services/data-from-csv.service';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';


@Component({
  selector: 'app-mapa-openlayers',
  standalone: true,
  templateUrl: './mapaOpenlayers.component.html',
  styleUrls: ['./mapaOpenlayers.component.css']
})
export class MapaOpenlayersComponent implements OnInit, AfterViewInit {
  private map!: Map; 
  private overlay!: Overlay; 

  constructor(private dataFromCSVService: DataFromCSVService) { }

  ngOnInit(): void {
    this.initMap();
    this.dataFromCSVService.getCSVData().subscribe(data => {
      this.addPointsToMap(data);
    });
  }

  ngAfterViewInit(): void {
    this.overlay = new Overlay({
      element: document.getElementById('popup')!,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    this.map.addOverlay(this.overlay);

    this.map.on('click', (event) => {
      const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        //console.log(feature);
        return feature;
      });

      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        //console.log(`Coordenadas: ${coordinates}`);
        const lonLat = toLonLat(coordinates);
        //console.log(`Latitud: ${lonLat[1]}, Longitud: ${lonLat[0]}`);
        const popupContent = `<div>Latitud: ${lonLat[1]}, Longitud: ${lonLat[0]}</div>`;
        const popupElement = document.getElementById('popup-content');
        if (popupElement) {
          popupElement.innerHTML = popupContent;
        } else {
          console.error("No se encontró el elemento popup-content");
        }
        this.overlay.setPosition(coordinates);
      } else {
        this.overlay.setPosition(undefined);
      }
    });
  }

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-60.7000, -36.6167]), // Coordenadas de Buenos Aires
        zoom: 5
      })
    });
  }

  private addPointsToMap(data: any[]): void {
    if (!this.map) {
      console.error("El mapa no se ha inicializado todavía!");
      return; 
    }
    const vectorSource = new VectorSource();
    data.forEach(point => {
      const lat = parseFloat(point.latitud);
      const lng = parseFloat(point.longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([lng, lat]))
        });
        vectorSource.addFeature(feature);
      }
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'white', width: 1 })
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }
}