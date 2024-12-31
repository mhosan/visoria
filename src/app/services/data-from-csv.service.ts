import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataFromCSVService {

  private csvUrl = 'assets/data/lotesDepurado.csv'; // Ruta al archivo CSV

  constructor(private http: HttpClient) { }

  getCSVData(): Observable<any> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.parseCSV(data))
    );
  }

  private parseCSV(data: string): any {
    
    const lines = data.split('\n');
    const result: any[] = [];
    const headers = lines[0].split(';');
   
    for (let i = 1; i < lines.length; i++) {
      const arrayPoints = [];
      const valores = lines[i].split(';');
      const latitud = valores[1];
      const longitud = valores[2];
      //console.log(`latitud: ${latitud}, longitud: ${longitud}`); 
      arrayPoints.push(latitud);
      arrayPoints.push(longitud);
      const objCoords = {latitud, longitud};
      result.push(objCoords);
    }
    return result;
  }

}
