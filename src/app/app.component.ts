import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  boards = [];
  cards = [];

  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.service.fetchTrelloBoards().subscribe(res => {
      console.log(res);
      this.boards = res.lists;
      this.cards = res.cards;
      console.log(this.cards);

      res.cards.forEach(card => {
        const board = this.boards.find(b => b.id === card.idList);
        if (!board.cards) {
          board.cards = [];
        }
        board.cards.push(card);
      });

      console.log(this.boards);
    });
  }
}
