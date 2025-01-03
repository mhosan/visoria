import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, HttpClientModule, HomeComponent]
})
export class AppComponent {
  title = 'visoria';
}
