import { Component, OnInit, Input } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { AppService } from 'app/app.service';

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

    const previews = attachments[0].previews;
    return previews[previews.length - 3].url;
  }

}
