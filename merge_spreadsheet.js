function transferFormData() {
    var destinationSheet = SpreadsheetApp.openById("<転送先スプレッドシートのID>").getActiveSheet();
    
    var formSheetIds = [
      "<フォーム1のスプレッドシートのID>", 
      "<フォーム2のスプレッドシートのID>", 
      // ..., 
      // <"フォーム10のスプレッドシートのID">
      ];
  
    var allFormValues = [];
  
    // 全てのフォームからデータを取得して結合
    for (var i = 0; i < formSheetIds.length; i++) {
      var formSheet = SpreadsheetApp.openById(formSheetIds[i]).getActiveSheet();
      var lastRow = formSheet.getLastRow();
  
      // A列のデータから最後の行数を取得
      var lastRowIndex = getLastRowWithData(formSheet);
      console.log(lastRowIndex)

      // スプレッドシートにデータがない場合はスキップ
      if (lastRowIndex <= 1) {
        continue;
      }
      var formValues = formSheet.getRange(2, 1, lastRow - 1, 8).getValues(); // ヘッダーを除いたデータの範囲を指定
      // var formValues = formSheet.getRange("A2:H" + lastRow).getValues(); // ヘッダーを除いたデータの範囲を指定
  
      allFormValues = allFormValues.concat(formValues);
    }
  
    // タイムスタンプの新しい順にソート
    /*allFormValues.sort(function(a, b) {
      return b[0].getTime() - a[0].getTime();
    });*/
  
    // タイムスタンプの古い順にソート
    allFormValues.sort(function(a, b) {
      return a[0].getTime() - b[0].getTime();
    });
  
    // 重複のないデータを転送先スプレッドシートに書き込む
    var existingData = destinationSheet.getDataRange().getValues();
    var existingTimestamps = existingData.map(function(row) {
      return row[0].toString();
    });
  
    for (var j = 0; j < allFormValues.length; j++) {
      var timestamp = allFormValues[j][0].toString();
      if (!existingTimestamps.includes(timestamp)) {
        destinationSheet.appendRow(allFormValues[j]);
      }
    }
  }

function getlastRowWithData(sheet) {
    var columnA = sheet.getRange("A:A").getValues();
    var lastRow = columnA.length;

    // 最後の空白セル（値が入っていないセル）の位置を特定
    for (var i = lastRow - 1; i >= 0; i--) {
        if (columnA[i][0] !== "") {
            // 値が入っているセルを見つけたらその行番号を返す
            return i + 1;
        }
    }

    // A列がすべて空白だった場合は0を返す
    return 0;
}

