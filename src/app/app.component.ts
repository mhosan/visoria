import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapaLeafletComponent } from "./components/mapaLeaflet/mapaLeaflet.component";
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, HttpClientModule, MapaLeafletComponent]
})
export class AppComponent {
  title = 'visoria';
}
