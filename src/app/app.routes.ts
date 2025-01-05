import { Routes } from '@angular/router';
import { MapaLeafletComponent } from './components/mapaLeaflet/mapaLeaflet.component';
import { MapaOpenlayersComponent } from './components/mapaOpenlayers/mapaOpenlayers.component';


export const routes: Routes = [
    { path: '', component: MapaOpenlayersComponent },
    { path: 'leaflet', component: MapaLeafletComponent },
    { path: 'openlayers', component: MapaOpenlayersComponent },
    { path: '', redirectTo: '/openlayers', pathMatch: 'full' }, // Redirigir a 'mapa-leaflet' por defecto
    { path: '**', redirectTo: '/openlayers', pathMatch: 'full' } // Redirigir a 'leaflet' en caso de path no existente
  ];
