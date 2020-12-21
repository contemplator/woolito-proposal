# woolito-proposal

專門為 Woolito 工作室開發的提案管理工具

先在 Trello 使用模板建立一個 Board，只要將 Trello 設置為公開，就可以很簡單的使用公開的 API 取得 Trello Board 的資料，然後就可以自己設計出一個固定版型，但是內容會根據 Trello Board 資料調整而變動的網站，也就是把 Trello 當作 CMS 使用，由我去開發一個網頁專門顯示 Trello Board 的資料。

此開發想法是參考 [Trelolo](https://trelolo.com/) 的

因為內容會一直變動，而且後來實際上線後，有遇到效能問題，所以有做一個功能是會快照網站的資源，然後將靜態結果放置到伺服器上，並且透過資料夾名稱加入版本控制的概念。但快照功能做在 [Woolito Server](https://github.com/contemplator/woolito-server)。

# Trello 使用說明

## 專案介紹

### 全域設定 - global setting

- 隱藏標題
- 隱藏摘要
- 推薦作品的 title 設定

### 章節設定 - section

- 可手動排序
- 自定義 section 標題名稱，格式為 section - {{標題名稱}}
- 自定義 section 內容，格式為 markdown

## 推薦作品

- 自行增加推薦作品的不同主題，主題名稱可自訂，格式請符合 推薦作品 - {{主題名稱}}
- 每個作品可自行控制標題和摘要的顯示
