import { Component, OnInit, Input } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { AppService } from 'app/app.service';
import { User } from './user';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
  @Input() work: any;
  constructor(
    private service: AppService
  ) { }

  ngOnInit() {
    const user = new User('leo', 20);
    //console.log(user.name);
  }

  /**
   * 取得 trello card 的 preview
   * @param item trello card 物件
   */
  getPreviemImageUrl(item: any): SafeStyle {
    const attachments = item.attachments.filter(a => a.previews.length > 0);
    if (!attachments || attachments.length === 0) {
      return '';
    }

    let previews = attachments[0].previews;
    previews = previews.sort((a, b) => {
      if (a.bytes > b.bytes) {
        return -1;
      } else if (a.bytes > b.bytes) {
        return 1;
      } else {
        return 0;
      }
    });
    return previews[0].url;
  }

}
