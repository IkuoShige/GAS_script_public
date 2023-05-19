function main() {
  var folder_Id = "<folder_id>";// OCRに掛けたいフォルダのid
  var file_list = [];
  var n = [];
  let m = 0;
  images = detect_file_id(folder_Id, file_list, n, m);
  var file_id = [];
  for(let c of images) {
    console.log("new File name: " + c.getName() + ", " + "Last updated: " + c.getLastUpdated() + ", " + "file_id: " + c.getId())
    file_id.push(c.getId());
    //time.push(c.getLastUpdated());
  }
  for (let i = 0; i < file_id.length; i++){
    imageOcr(file_id[i]);
  }
}

function imageOcr(imageFileId) {
  //Google ドライブにアップした画像のファイルIDを変数で定義
  //サンプルコードを実行する場合は各自のファイルIDに書き換え
  
  //OCRのファイルを生成する際の名称
  let resource = {
    title: "OCR_TEST"
  };
  //OCRファイル生成時のオプションを記載
  let option = {
    "ocr": true, //OCR設定で有効にするため、trueを設定
    "ocrLanguage": "ja", //OCRを行う言語を英語で設定
  }
  //DriveAPIでファイルコピー時にOCRを実行する形で実行
  let imageData = Drive.Files.copy(resource, imageFileId, option);
  //DocumentAppクラスで画像を位読み込み、テキストを取得
  let ocrData = DocumentApp.openById(imageData.id).getBody().getText();
  //OCRで取得したテキストデータをログ出力
  console.log(ocrData);
}

function detect_file_id(folderid_1, file_list, n, m) {
  /* 並び替えを行うフォルダを取得 */
  var folder = DriveApp.getFolderById(folderid_1);  // type Folder
  /* フォルダ内の全ファイルのイテレータを取得 */
  var file_itr = folder.getFiles();  // type FileIterator
  /* ファイルイテレータを配列に変更 */
  
  while(file_itr.hasNext()) {
    var file = file_itr.next();
    let t_filename = file.getName();
    if (t_filename.match('IMG_1.png')){ // フォルダ内の"IMG_1.png"を参照する
      file_list.push(file);
      m+=1;
    }
  }

  /* 1. 更新日時の昇順に並び替え（破壊的ソート） */
  file_list.sort(function(a,b){
    if(a.getLastUpdated() < b.getLastUpdated()) return -1;
    if(a.getLastUpdated() > b.getLastUpdated()) return 1;
    return 0;
  });

  var childFolders = DriveApp.getFolderById(folderid_1).getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    //子フォルダのIDを取得し、同じ関数に返す。
    detect_file_id(childFolder.getId(), file_list, n, m); // 再起的に detect_file_id()関数を実行することでフォルダの下の階層までファイルがある限りもぐり続けてファイルidを取得する
  }

  /* ソート後の配列の表示 */
  for(let v of file_list) {
    console.log("File name: " + v.getName() + ", " + "Last updated: " + v.getLastUpdated())
  }
  console.log("m: "+m);
  console.log("n: "+n);
  const last = n.slice(-1)[0];
  console.log("last: " + last);
  const new_file_list = file_list.slice(last*-1);

  return new_file_list;
}
