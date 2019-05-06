import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { NgxMasonryComponent } from 'ngx-masonry';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
  @ViewChild('masonry') masonry: NgxMasonryComponent;
  @Input() works: any[];
  @Input() globalSetting: any;
  constructor() { }

  ngOnInit() { }

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

  /**
   * 點擊作品
   * @param item trello card 物件
   */
  onWorkClick(item: any): void {
    const linkAttachment = item.attachments.find(a => a.isUpload === false);
    window.open(linkAttachment.url, '_blank');
  }

  render(): void {
    this.masonry.layout();
  }

}
