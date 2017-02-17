
const MAX_LIFE = 8, // ライフの最大値
      WIDTH    = 19, // ボタンの横の数
      HEIGHT   = 34; // ボタンの縦の数
var start_flag = 0, // 0 => 始まってない, 1 => 始まってる
    all_mine   = WIDTH * HEIGHT, // 全てのボタンの数
    num_bomb   = all_mine / 2.5,  // 全ての爆弾の数
    bomb_ary   = new Array(), // 爆弾の情報を保持した配列
                              // -1 => 既に押した
                              // 0 => 押してない
                              // 1 => 爆弾
    open_rand  = 50, // 最初にランダムでオープンしてくれる際のパラメータ
    num_safe   = 0, // 爆弾ではない数
    sum_time   = 0, // 合計プレイ時間（秒）
    timer      = 0, // タイマー
    life_guage = MAX_LIFE; // ライフゲージ


// 全ての状態を初期化する
function refresh() {
  life_guage = MAX_LIFE;
  num_safe = 0;
  clearInterval(timer);
  sum_time = -1;

  for (var i = 0; i < MAX_LIFE; i++) {
    $("#life-" + i).removeClass("glyphicon-heart-empty");
    $("#life-" + i).addClass("glyphicon-heart");
  }

  $("#ProgressBar").text("0%");
  $("#ProgressBar").css("width", "0%");
  $("#ProgressBar").removeClass("progress-bar-warning");
  $("#ProgressBar").removeClass("progress-bar-danger");
  $("#ProgressBar").removeClass("progress-bar-success");

  for (var i = 0; i < WIDTH; i++) {
    bomb_ary[i] = new Array();
    for (var j = 0; j < HEIGHT; j++){
      bomb_ary[i][j] = 0;
      var btn_id = "#MineBtn-" + i + "-" + j;
      $(btn_id).removeClass("pushed_btn");
      $(btn_id).addClass("btn-info");
      $(btn_id).text("　");
      //$(btn_id).css("color", getCharColor(0));
      $(btn_id).removeClass("btn-warning");
      $(btn_id).removeClass("btn-danger");
    }
  }
}

// ランダムで爆弾をセットする
function set_bomb(id_width, id_height) {
  // 爆弾をセット
  var count = 0;
  while (count < num_bomb) {
    var width_rand = Math.floor( Math.random() * WIDTH ),
        height_rand = Math.floor( Math.random() * HEIGHT );
    if ( bomb_ary[width_rand][height_rand] == 0 && (width_rand != id_width || height_rand != id_height)){
      count += 1;
      bomb_ary[width_rand][height_rand] = 1;
      /*--- debug ---*/
      //$("#MineBtn-" + width_rand + "-" + height_rand).removeClass("btn-info");
      //$("#MineBtn-" + width_rand + "-" + height_rand).addClass("btn-danger");
    }
  }
}

// 最初のボタンを押した時にランダムでオープン
function open_random(id_width, id_height) {
  var tmp; // 特に意味はない
  for(var i = 0; i < open_rand; i++){
    var direct_rand = Math.floor( Math.random() * 4);
    switch (direct_rand) {
      case 0: //left
        if (0 < id_height && bomb_ary[id_width][id_height - 1] != 1) {
          open_btn(id_width, id_height - 1);
          id_height -= 1;
        }
        break;
      case 1: // right
        if (id_height < HEIGHT - 1  && bomb_ary[id_width][id_height + 1] != 1) {
          open_btn(id_width, id_height + 1);
          id_height += 1;
        }
        break;
      case 2: // top
        if (0 < id_width && bomb_ary[id_width - 1][id_height] != 1) {
          open_btn(id_width - 1, id_height);
          id_width -= 1;
        }
        break;
      case 3: // bottom
        if (id_width < WIDTH - 1 && bomb_ary[id_width + 1][id_height] != 1) {
          open_btn(id_width + 1, id_height);
          id_width += 1;
        }
        break;
    }
  }
}

// 指定されたボタンをオープンにする
function open_btn(id_width, id_height){
  var bomb_id = "#MineBtn-" + String(id_width) + "-" + String(id_height),
      bomb_count = getNumBombAround(id_width, id_height, id_width, id_height);
  $(bomb_id).removeClass("btn-info");
  $(bomb_id).addClass("pushed_btn");
  bomb_ary[id_width][id_height] = -1;
  $(bomb_id).text( convertEm(bomb_count) );
  update_progress_bar();
}

// ちゃんとスタートボタンを押しているか判定
function check_started() {
  if ( start_flag == 1 ){
    return 1;
  } else {
    $("body").append('<div id="info_area" class="alert alert-danger">\
                      <button type="button" class="close" data-dismiss="alert">\
                      <span aria-hidden="true">×</span></button>\
                      <strong>警告</strong>　スタートボタンを押してください！</div>');
    $(".alert").fadeIn("slow");
    setTimeout(function(){ $(".alert").fadeOut("slow"); }, 2000);
  }
}

// プログレスバーを更新
function update_progress_bar() {
  num_safe++;
  var percentage = num_safe / (all_mine - num_bomb) * 100;
  $("#ProgressBar").text( percentage.toFixed(1) + "%");
  $("#ProgressBar").css("width", percentage.toFixed(1) + "%");

  // プログレスバーの色を変更
  if (50 <= percentage && percentage < 80) {
    $("#ProgressBar").addClass("progress-bar-warning");
  } else if (80 <= percentage && percentage < 100){
    $("#ProgressBar").removeClass("progress-bar-warning");
    $("#ProgressBar").addClass("progress-bar-danger");
  } else if (percentage == 100){
    $("#ProgressBar").removeClass("progress-bar-danger");
    $("#ProgressBar").addClass("progress-bar-success");
    gameclear();
  }
}

// 数字に対応したcssを返す
function getCharColor(num){
  var color;
  switch (num) {
    case 1:
      color = "rgba(63, 72, 190, 1)";
      break;
    case 2:
      color = "rgba(9, 105, 0, 1)";
      break;
    case 3:
      color = "rgba(172, 0, 0, 1)";
      break;
    case 4:
      color = "rgba(75, 76, 154, 1)";
      break;
    case 5:
      color = "rgba(126, 0, 0, 1)";
      break;
    case 6:
      color = "rgba(31, 120, 126, 1)";
      break;
    default:
      break;
  }
  return color;
}

// 半角数字を全角に変換
function convertEm(num){
  var converted_num = "";
  switch (num) {
    case 1:
      converted_num = "１";
      break;
    case 2:
      converted_num = "２";
      break;
    case 3:
      converted_num = "３";
      break;
    case 4:
      converted_num = "４";
      break;
    case 5:
      converted_num = "５";
      break;
    case 6:
      converted_num = "６";
      break;
    case 7:
      converted_num = "７";
      break;
    case 8:
      converted_num = "８";
      break;
    default:
      converted_num = "　";
      break;
  }
  return converted_num;
}

// 引数のボタンの8方向のブロックを押した状態に変更
// 参考サイト: http://blog.asial.co.jp/647
function clearBombAround(id_width, id_height, ori_width, ori_height){
  for (var width = id_width - 1; width <= id_width + 1; width++){
    if (width < 0 || width >= WIDTH){
      continue;
    }
    for (var height = id_height - 1; height <= id_height + 1; height++){
      if (0 <= height && height < HEIGHT){
        if ((width == id_width && height == id_height) || (width == ori_width && height == ori_height)) {
          // 自分自身をクリック
        } else {
          var bomb_id = "#MineBtn-" + String(width) + "-" + String(height);
              bomb_count = getNumBombAround(width, height, ori_width, ori_height);
          $(bomb_id).removeClass("btn-info");
          $(bomb_id).addClass("pushed_btn");
          bomb_ary[width][height] = -1;
          $(bomb_id).text( convertEm(bomb_count) );
          update_progress_bar();
        }
      }
    }
  }
}

// 引数のボタンの四方八方に何個の爆弾があるかを数える
function getNumBombAround(id_width, id_height, ori_width, ori_height){
  var bomb_count = 0;

  for (var width = id_width - 1; width <= id_width + 1; width++){
    if (width < 0 || width >= WIDTH){
      continue;
    }
    for (var height = id_height - 1; height <= id_height + 1; height++){
      if (0 <= height && height < HEIGHT){
        if (bomb_ary[width][height] == 1) {
          bomb_count += 1;
        }
      }
    }
  }

  if (bomb_count == 0){ // 周りに1個もない場合
    clearBombAround(id_width, id_height, ori_width, ori_height);
  }

  return bomb_count;
}


// 1桁の場合、0を付ける
function checkDigits (num){
  num += "";
  if (num.length == 1) {
    num = "0" + num;
  }
  return num;
}

// プレイ時間を返す
function get_time(){
  var time   = "";
      hour   = parseInt(sum_time / 3600),
      minute = parseInt((sum_time - 3600 * hour) / 60),
      second = parseInt(sum_time - hour * 3600 - minute * 60);
  if (hour != 0){
    time += String(hour) + "時間";
  }
  if (minute != 0 || hour != 0){
    time += hour != 0 ? checkDigits(String(minute)) + "分" : String(minute) + "分";
  }
  if (second != 0 || minute != 0 || hour != 0) {
    time += minute != 0 ? checkDigits(String(second)) + "秒" : String(second) + "秒";
  }

  return time;
}

// タイマーを更新
function update_timer() {
  sum_time += 1;

  var hour   = checkDigits( parseInt(sum_time / 3600) ),
      minute = checkDigits( parseInt((sum_time - 3600 * hour) / 60)),
      second = checkDigits( parseInt(sum_time - hour * 3600 - minute * 60));

  $("#timer").text(hour + ":" + minute + ":" + second);
}

// ゲームオーバー時の処理
function gameover(){
  start_flag = 0;
  clearInterval(timer);
  var percentage = num_safe / (all_mine - num_bomb) * 100;
  swal({
    title: 'ゲームオーバー',
    text: "あなたの記録は <strong>" + percentage.toFixed(1) + "%</strong> です！",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: 'キャンセル',
    confirmButtonText: 'もう一度'
  }).then(function() {
    clickedStartBtn();
  })

  for (var i = 0; i < WIDTH; i++) {
    for (var j = 0; j < HEIGHT; j++){
      if (bomb_ary[i][j] == 1){
        var bomb_id = "#MineBtn-" + i + "-" + j;
        $(bomb_id).removeClass("btn-info");
        $(bomb_id).removeClass("btn-warning");
        $(bomb_id).addClass("btn-danger");
        $(bomb_id).text("");
        $(bomb_id).remove(".glyphicon");
        $(bomb_id).append('<span class="glyphicon glyphicon-fire" aria-hidden="true"></span>');
      }
    }
  }
}

// ゲームクリア時の処理
function gameclear() {
  start_flag = 0;
  clearInterval(timer);
  var time = get_time();

  swal({
    title: 'ゲームクリア',
    text: 'あなたの記録は <strong>' + time + '</strong> です！<br/>記録するユーザ名を入力してください',
    input: 'text',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: 'キャンセル',
    confirmButtonText: '入力',
    showLoaderOnConfirm: true,
    inputValidator: function(value) {
      return new Promise(function(resolve, reject) {
        if(value) {
          resolve();
        } else {
          reject('ユーザ名を入力してください')
        }
      })
    }
  }).then(function(text){
    if (text) {
      $.post("newrecord", { "user_name": text, "clear_time": sum_time }, function( data ) {
        /*成功時の処理を書きたい*/
      }, "json");
      swal({
        type: 'success',
        title: '記録を登録しました',
      })
    }
  })
}

// ライフゲージを1つ下げる
function reduceLife(pushed_btn_id) {
  var id_width = parseInt( pushed_btn_id.match(/^MineBtn-(\d+)-\d+$/)[1] ),
      id_height = parseInt( pushed_btn_id.match(/^MineBtn-\d+-(\d+)$/)[1] );

  if ( 0 < life_guage) {
    life_guage -= 1;
    $("#" + pushed_btn_id).removeClass("btn-info");
    $("#" + pushed_btn_id).addClass("btn-danger");
    $("#" + pushed_btn_id).text("");
    $("#" + pushed_btn_id).append('<span class="glyphicon glyphicon-fire" aria-hidden="true"></span>');

    $("#life-" + life_guage).removeClass("glyphicon-heart");
    $("#life-" + life_guage).addClass("glyphicon-heart-empty");

  }

  if ( life_guage == 0 ){
    gameover();
  }
}

// スタートボタンを押した際の処理
function clickedStartBtn(){
  start_flag = 1;
  sum_time = -1;

  refresh();

  $("#StartBtn").removeClass("btn-default");
  $("#StartBtn").addClass("btn-primary");
  $("#StartBtn").text("RESTART");
  $("#StartBtn").attr("id", "ReStartBtn");

  timer = setInterval(function(){ update_timer(); }, 1000);
}


// 画面読み込み時にベストタイムの変換
window.onload = function() {
  var best_time = $("#best_time").text();
  sum_time = best_time;
  $("#best_time").text(get_time(best_time));
  //alert($(".list-group-item-text").css("height"));
  //alert($(".list-group-item").css("height"));
};

jQuery(document).ready( function() {

  // スタートボタンを押した場合の処理
  $("#StartBtn").click( function() {
    clickedStartBtn();
  });

  // ボタンを押した場合の処理
　$(".mine").click( function() {
    var pushed_btn_id = $(this).attr("id"),
        id_width = parseInt( pushed_btn_id.match(/^MineBtn-(\d+)-\d+$/)[1] ),
        id_height = parseInt( pushed_btn_id.match(/^MineBtn-\d+-(\d+)$/)[1] ),
        right_clk_flag = $(this).hasClass('btn-warning'),
        explode_flag = $(this).hasClass('btn-danger');

    if (check_started() == 1) {
      if (num_safe == 0) {
        set_bomb(id_width, id_height);
        open_random(id_width, id_height);
      }

      if (bomb_ary[id_width][id_height] != -1 && !explode_flag && !right_clk_flag) { // 既に押してない
        if (bomb_ary[id_width][id_height] == 1) { // 押したボタンが爆弾であった場合
          reduceLife(pushed_btn_id);
        } else { // 押したボタンが爆弾ではなかった場合
          open_btn(id_width, id_height);
        }
      }
    }
  });

  $(".mine").bind('contextmenu', function() {
    var pushed_btn_id = $(this).attr("id"),
        id_width = parseInt( pushed_btn_id.match(/^MineBtn-(\d+)-\d+$/)[1] ),
        id_height = parseInt( pushed_btn_id.match(/^MineBtn-\d+-(\d+)$/)[1] ),
        right_clk_flag = $(this).hasClass('btn-warning');

    if (check_started() == 1){
      if(bomb_ary[id_width][id_height] != -1) { // 既に押してない
        if (!right_clk_flag) {
          $(this).removeClass("btn-info");
          $(this).addClass("btn-warning");
          $(this).text("");
          $(this).append('<span class="glyphicon glyphicon-flag" aria-hidden="true"></span>');
        } else {
          $(this).removeClass("btn-warning");
          $(this).addClass("btn-info");
          $(this).remove(".glyphicon");
          $(this).text("　");
        }
      }
    }

    return false;
  });
 });
