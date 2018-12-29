import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import * as showdown from 'showdown';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  siteTitle : string;
  staticWorkPre = '推薦作品 - ';      // 用來標註推薦作品列表的前綴字
  works = [];                       // 推薦作品
  require: string;                  // 需求
  audience;                         // 客群

  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    const hash = window.location.href;
    const index = hash.lastIndexOf('/') + 1;
    const id = hash.substring(index);
    this.fetchTrello(id);
  }

  /**
   * 取得 trello 資料
   * @param id trello board id 
   */
  fetchTrello(id: string): void {
    this.service.fetchTrelloBoards(id).subscribe(res => {
      //console.log(res);
      console.log(res.cards);
      this.require = this.convertMarkdown(res.cards.filter(item => item.name === '需求')[0].desc);
      this.audience = this.convertMarkdown(res.cards.filter(item => item.name === '客群')[0].desc);
      this.works = res.lists.filter(item => item.name.indexOf(this.staticWorkPre) > -1);
      this.siteTitle = res.name ; 
      
      const arr = [];
      res.cards.forEach(card => {
        const work = this.works.find(w => w.id === card.idList);
        if (work) {
          if (!work.cards) {
            work.cards = [];
          }
          work.cards.push(card);
        }
      });
    });
  }

  /**
   * 將 trello 的內容從 markdown 轉成 html
   */
  convertMarkdown(content: string): string {
    const converter = new showdown.Converter();
    const lines = content.split('\n');
    const htmls = lines.map(item => converter.makeHtml(item));
    return htmls.join('\n');
  }

  /**
   * 判斷是否有圖片
   * @param item trello card 物件
   */
  hasImage(item: any): boolean {
    let result = false;
    item.attachments.forEach(a => {
      if (a.name.indexOf('png') > -1 ||
        a.name.indexOf('jpg') > -1 ||
        a.name.indexOf('gif') > -1) {
        result = true;
      }
    });
    return result;
  }

  // /**
  //  * 取得 trello card 的 preview
  //  * @param item trello card 物件
  //  */
  // getPreviemImageUrl(item: any): SafeStyle {
  //   const attachments = item.attachments.filter(a => a.previews.length > 0);
  //   if (!attachments || attachments.length === 0) {
  //     return '';
  //   }

  //   const previews = attachments[0].previews;
  //   return previews[previews.length - 3].url;
  // }

  /**
   * 點擊作品
   * @param item trello card 物件
   */
  onWorkClick(item: any): void {
    const linkAttachment = item.attachments.find(a => a.isUpload === false);
    window.open(linkAttachment.url, '_blank');
  }

  /**
   * 取得推薦作品的分類名稱
   * @param item trello card 物件
   */
  getCategory(item: any): string {
    const name = item.name;
    const index = item.name.indexOf(this.staticWorkPre);
    return name.substring(index + this.staticWorkPre.length);
  }
}
