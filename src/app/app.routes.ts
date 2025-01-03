import { Routes } from '@angular/router';
import { MapaLeafletComponent } from './components/mapaLeaflet/mapaLeaflet.component';
import { MapaOpenlayersComponent } from './components/mapaOpenlayers/mapaOpenlayers.component';


export const routes: Routes = [
    { path: '', component: MapaOpenlayersComponent },
    { path: 'leaflet', component: MapaLeafletComponent },
    { path: 'openlayers', component: MapaOpenlayersComponent },
    { path: '', redirectTo: '/leaflet', pathMatch: 'full' } // Redirigir a 'mapa-leaflet' por defecto
  ];
