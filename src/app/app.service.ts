import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  rowData = 'hello';

  constructor(private httpClient: HttpClient) { }

  fetchTrelloBoards(id: string): Observable<any> {
    return this.httpClient.get('https://trello.com/b/' + id + '.json');
  }
}
