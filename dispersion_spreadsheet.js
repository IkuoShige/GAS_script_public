// SPDX-FileCopyrightText: 2024 Ikuo Shige
// SPDX-License-Identifier: MIT License
function distributeFormData() {
  var sourceSheet = SpreadsheetApp.openById("<file-id>").getSheetByName("<sheetid>"); //.getActiveSheet();
  // 分散先のスプレッドシートidを設定
  var destinationSheetIds = {
    "フットサル⚽": "", // フットサル
    "バスケットボール🏀": "", // バスケットボール
    // "卓球🏓": "", // 卓球
    // "バドミントン🏸": "" // バドミントン
    // "ソフトテニス🎾": "", // テニス
    // "ビーチバレー🏐": "", // バレーボール
    // "ソフトボール⚾": "", // ソフトボール
    // "ドッヂボール🤾": "", // ドッジボール
    "スマブラ🎮": "", // スマブラ
  };
  // それぞれの項目数を設定
  var destination_header_num = {
    "フットサル⚽": 19, // フットサル
    "バスケットボール🏀": 23, // バスケットボール
    "卓球🏓": 7, // 卓球
    "バドミントン🏸": 7, // バドミントン
    "ソフトテニス🎾": 7, // テニス
    "ビーチバレー🏐": 19, // バレーボール
    "ソフトボール⚾": 27, // ソフトボール
    "ドッヂボール🤾": 23, // ドッジボール
    "スマブラ🎮": 4, // スマブラ
  };
  // それぞれの1番目の項目が全体の何番目からはじまるかを設定
  var destination_start_index = {
    "フットサル⚽": 3,
    "バスケットボール🏀": 22,
    "卓球🏓": 45,
    "バドミントン🏸": 52,
    "ソフトテニス🎾": 59,
    "ビーチバレー🏐": 66,
    "ソフトボール⚾": 84,
    "ドッヂボール🤾": 111,
    "スマブラ🎮": 134,
};

  var lastRow = sourceSheet.getLastRow();
  var lastColumn = sourceSheet.getLastColumn();

  // スプレッドシートにデータがない場合は終了
  if (lastRow <= 1) {
    return;
  }

  // ヘッダー行を取得
  var headerRow = sourceSheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  // console.log(headerRow);

  
  var formValues = sourceSheet.getRange(2, 1, lastRow - 1, lastColumn).getValues(); // ヘッダーを除いたデータの範囲を指定

  for (var i = 0; i < formValues.length; i++) {
    var row = formValues[i];
    var category = row[2]; // 種目の列を指定 (例: "フットサル", "テニス", "卓球", etc.)
    // console.log(category);

    if (!destinationSheetIds[category]) {
      // destinationSheetIds[category] = createSheet(category);
      continue
    }

    // 空白を削除してデータを詰める
    var cleanedRow = row.filter(function(cell) {
      return cell !== "";
    });
    // console.log("new row: ", cleanedRow);
    var cleanedheaderRow = [
      headerRow[0], // 'タイムスタンプ'
      headerRow[1], // 'メールアドレス'
      headerRow[2], // '競技'
      ...headerRow.slice(
        destination_start_index[category],
        destination_start_index[category] + destination_header_num[category]
      ),
      headerRow[headerRow.length-2],
      headerRow[headerRow.length-1],
    ];
    // console.log(headerRow[headerRow.length-2]);

    var destinationSheet = SpreadsheetApp.openById(destinationSheetIds[category]).getActiveSheet();
    var existingData = destinationSheet.getDataRange().getValues();
    var existingTimestamps = existingData.map(function(existingRow) {
      return existingRow[0].toString();
    });

    // ヘッダーがなければ設定
    if (existingData.length === 1 && existingData[0].join("") === "") {
      destinationSheet.appendRow(cleanedheaderRow);
      destinationSheet.setFrozenRows(1); // 1行目を固定
    }

    var timestamp = row[0].toString();
    if (!existingTimestamps.includes(timestamp)) {
      destinationSheet.appendRow(cleanedRow);
    }
  }

}
