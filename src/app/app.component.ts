import { Component, OnInit, isDevMode, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import * as showdown from 'showdown';
import { CheckitemState } from './enum';
import { Section } from './viewmodel';
import { SafeStyle } from '@angular/platform-browser';
import { NgxMasonryComponent } from 'ngx-masonry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('masonry') masonry: NgxMasonryComponent;
  siteTitle: string;
  staticWorkPre = '推薦作品 - ';      // 用來標註推薦作品列表的前綴字
  sections = [];
  works = [];                       // 推薦作品
  checklists = [];                  // trello 上的 checklist
  require: string;                  // 需求
  globalSetting = {                 // 全域設定
    showTitle: true,
    showDesc: true,
    workTitle: '設計參考'
  };
  introList: any;

  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    // 路徑範例
    // http://www.woooplay.com/proposal/dxf5Di9T/5/
    // http://www.woooplay.com/proposal/dxf5Di9T/
    // http://localhost:4200/HO4UIfOG
    // http://woooplay.com/proposal-dev/#/HO4UIfOG
    const hash = window.location.href;

    if (isDevMode() || hash.indexOf('proposal-dev') > -1) {
      // const id = 'HO4UIfOG';
      const index = hash.lastIndexOf('/') + 1;
      const id = hash.substring(index);
      this.fetchTrello(id);
    } else {
      const params = hash.split('/');
      const trelloIdIndex = params.findIndex(item => item === 'proposal');
      const id = params[trelloIdIndex + 1];
      if (id !== '#') {
        this.fetchTrello(id);
      } else {
        // 應付舊版 url: http://woooplay.com/proposal/#/ZclB2ofj
        const index = hash.lastIndexOf('/') + 1;
        const trelloId = hash.substring(index);
        this.fetchTrello(trelloId);
      }
    }
  }

  /**
   * 取得 trello 資料
   * @param id trello board id
   */
  fetchTrello(id: string): void {
    this.service.fetchTrelloBoards(id).subscribe(res => {
      const requireCard = res.cards.filter(item => item.name === '需求');
      if (requireCard[0]) {
        this.require = this.convertMarkdown(requireCard[0].desc);
      }

      this.checklists = res.checklists;
      this.fetchGolbalSettings(res.cards);

      this.siteTitle = res.name;
      document.title = this.siteTitle;

      this.works = res.lists.filter(item => item.name.indexOf(this.staticWorkPre) > -1);

      this.introList = res.lists.find(item => item.name === '專案介紹');
      res.cards.forEach(card => {
        const work = this.works.find(w => w.id === card.idList);
        if (!work) { return; }
        if (!work.cards) { work.cards = []; }
        this.settingCard(card);
        work.cards.push(card);
      });

      // console.log(this.works.map(item=>item.id));
      this.works.forEach(work => {
        console.log(work.cards.map(item => item.name).join(', '));
      });

      this.fetchSections(res.cards);

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

  /**
   * 取得推薦作品的分類名稱
   * @param item trello card 物件
   */
  getCategory(item: any): string {
    const name = item.name;
    const index = item.name.indexOf(this.staticWorkPre);
    return name.substring(index + this.staticWorkPre.length);
  }

  /**
   * 設定卡片顯示方式
   */
  settingCard(card: any) {
    card.showDesc = this.globalSetting.showDesc;
    card.showTitle = this.globalSetting.showTitle;
    if (!card.idChecklists || card.idChecklists.length <= 0) { return; }
    card.idChecklists.forEach(item => {
      const checklist = this.checklists.find(listitem => item === listitem.id && listitem.name === 'setting');
      if (!checklist) { return; }
      card.showDesc = this.settingCardShowDesc(checklist);
      card.showTitle = this.settingCardShowTitle(checklist);
    });
  }

  /**
   * 設定卡片是否顯示摘要
   */
  settingCardShowDesc(checklist: any): boolean {
    // if(!checklist){
    //   return true;
    // }
    const showDescSetting = checklist.checkItems.find(checkItem => checkItem.name === '隱藏摘要');
    if (!showDescSetting) { return true; }
    return showDescSetting.state === CheckitemState.incomplete;
  }

  /**
   * 設定卡片是否顯示標題
   */
  settingCardShowTitle(checklist: any): boolean {
    const showTitleSetting = checklist.checkItems.find(checkItem => checkItem.name === '隱藏標題');
    if (!showTitleSetting) { return true; }
    return showTitleSetting.state === CheckitemState.incomplete;
  }

  /**
   * 取得章節
   */
  fetchSections(cards: any[]): void {
    const sections = cards.filter(card => card.name.indexOf('section') === 0 && card.idList === this.introList.id);
    const regex = /section(\d*) - /g;
    this.sections = sections.map(s => {
      const section = new Section();
      const fullName = s.name;
      const matches = regex.exec(fullName);
      const matches2 = fullName.match(regex);
      if (!matches) { return; }
      section.id = s.id;
      section.order = isNaN(parseInt(matches[1], 10)) ? 99 : parseInt(matches[1], 10);
      section.title = fullName.replace(matches[0], '');
      section.desc = s.desc;
      section.innerHTML = this.convertMarkdown(section.desc);
      section.isAttachment = false;
      if (s.attachments.length > 0 && s.idAttachmentCover) {
        const attachImg = s.attachments.find(a => a.id = s.idAttachmentCover);
        if (attachImg) {
          section.isAttachment = true;
          const previews = attachImg.previews.sort(this.sortByBytes);
          section.innerHTML += `<img src="${previews[0].url}" alt="${s.name}">`;
        }
      }
      return section;
    });
  }

  /**
   * 取得全域設定
   */
  fetchGolbalSettings(cards: any[]): void {
    const settingCards = cards.filter(card => card.name === 'global setting');
    if (settingCards) {
      const settingCard = settingCards[0];
      const settingList = this.checklists.find(list => list.idCard === settingCard.id);
      if (!settingList) {
        return;
      }
      const checkItems = settingList.checkItems;
      this.globalSetting.showTitle = checkItems.find(item => item.name === '隱藏標題').state === CheckitemState.incomplete;
      this.globalSetting.showDesc = checkItems.find(item => item.name === '隱藏摘要').state === CheckitemState.incomplete;
      const workTitleItem = checkItems.find(item => item.name.indexOf('作品標題') > -1).name;
      this.globalSetting.workTitle = workTitleItem.replace('作品標題', '').replace('-', '').trim();
    }
  }

  /**
   * 依照檔案大小排列，降冪
   */
  sortByBytes(a, b): number {
    if (a.bytes > b.bytes) {
      return -1;
    }
    if (a.bytes < b.bytes) {
      return 1;
    }
    return 0;
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

  /**
   * 點擊作品
   * @param item trello card 物件
   */
  onWorkClick(item: any): void {
    const linkAttachment = item.attachments.find(a => a.isUpload === false);
    window.open(linkAttachment.url, '_blank');
  }

  test(): void {
    console.log('hi');
    this.masonry.layout();
  }
}
