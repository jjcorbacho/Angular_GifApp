import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '9TrnQVCllcbTM50JBenvDOPMZVWqDEQ4';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];
  ruta: any;

  get historial() {
    
    return [...this._historial];
  }


  constructor(private http: HttpClient) {
    //metodo 1
    if( localStorage.getItem("historial")) {
      this._historial = JSON.parse(localStorage.getItem("historial")!)
    }
    //metodo 2
    this.resultados = JSON.parse(localStorage.getItem("resultados")!) || [];
  }

  buscarGifs(query: string = '') {

    query = query.trim().toLowerCase();
    
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    const params = new HttpParams()
    .set('api_Key', this.apiKey)
    .set('q', query)
    .set('limit', '10')
    .set('offset', '0')
    .set('rating', 'pg-13')
    .set('lang', 'es');

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search?api_key=${this.apiKey}&q=${query} + ${params.toString()}`)
    .subscribe( (resp:any)=> {
      console.log(resp.data);
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
      
    })      
    
  }

}