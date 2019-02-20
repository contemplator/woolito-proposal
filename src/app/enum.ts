// Trello Checklist 項目的狀態，incomplete 代表沒有勾起、未完成
// 隱藏標題沒有勾，代表顯示標題 => state 若為 incomplete 為顯示，showTitle 結果要為 true
export enum CheckitemState {
  'incomplete' = 'incomplete',
  'complete' = 'complete'
}
