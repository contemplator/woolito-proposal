import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpClient: HttpClient) { }

  fetchTrelloBoards(): Observable<any>{
    return this.httpClient.get('https://trello.com/b/SeYyWEpC.json');
  }

}