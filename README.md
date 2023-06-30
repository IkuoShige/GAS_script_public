# GAS_script_public

## Google App Scriptのコード集

* OCR_test.js
* merge_spreadsheet.js

### OCR_test.js

* 画像をdriveにアップロードすると、画像の内容を文字起こし、googledocument出力する

#### 使い方

* Drive_APIを適用する

* OCR_test.js内の ```<folder_id>``` を読み込ませたい画像があるフォルダのidに書き換える。

* ```IMG_1.png```を読み込ませたい画像のファイル名に変更する。

* GASでmain関数を実行する

### merge_spreadsheet.js

* 複数あるスプレッドシートのデータを1つのスプレッドシートにタイムスタンプ順に統合する

#### 使い方

* 転送先のスプレッドシートIDを書き換える
* 集めたいデータが記述されたスプレッドシートIDを`formSheetIds`の配列に追記する
* データの範囲に応じて、`getRange関数`の引数を変更する
* スクリプトを回したい間隔に応じてトリガーの時間の間隔を変更する