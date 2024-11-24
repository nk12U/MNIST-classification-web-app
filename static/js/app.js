var canvas;
var context;
var beforeX = 0, beforeY = 0, currentX = 0, currentY = 0;
var drawing = false;

/**
 * 初期化。キャンバスに各種マウスリスナを設定し、描画コンテキストを初期化する。
 */
function initCanvas() {
    canvas = document.getElementById("canvas");

    // マウスリスナを設定する。
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("mouseup", onMouseUp, false);


    // タッチデバイス用リスナを設定する。
    canvas.addEventListener("touchstart", onDown, false);
    canvas.addEventListener("touchmove", onMove, false);
    canvas.addEventListener("touchend", onUp, false);

    // 線を描くとき黒い太線になるように、描画コンテキストを初期化する。
    context = canvas.getContext("2d");
    context.strokeStyle = "#000000";
    context.lineWidth = 15;
    context.lineJoin = "round";
    context.lineCap = "round";

    // キャンバスをクリアする。
    clearCanvas();
}

/**
 * マウスボタンを押したとき。
 * 現在の座標を記録する。
 */
function onMouseDown(event) {
    beforeX = event.offsetX;
    beforeY = event.offsetY;
    drawing = true;
}

/**
 * マウス移動時。
 * 前の座標と現在の座標との間に線を引く。
 */
function onMouseMove(event) {
    if (drawing) {
        currentX = event.offsetX;
        currentY = event.offsetY;
        drawLine();
        beforeX = currentX;
        beforeY = currentY;
    }
}

/**
 * タッチデバイスを離したとき。
 * マウスと同様。
 */
function onMouseUp(event) {
    drawing = false;
    event.stopPropagation();
}

/**
 * タッチデバイスを押したとき。
 * マウスと同様。
 */
function onDown(event) {
    onMouseDown(event)
    event.stopPropagation();
}

/**
 * タッチデバイス移動時。
 * マウスと同様。
 */
function onMove(event) {
    onMouseMove(event)
    if (drawing) {
        event.preventDefault();
        event.stopPropagation();
    }
}

/**
 * タッチデバイスを離したとき。
 * マウスと同様。
 */
function onUp(event) {
    drawing = false;
    event.stopPropagation();
}

/**
 * 記録された前の座標と現在の座標との間に線を描画する。
 */
function drawLine() {
    context.beginPath();
    context.moveTo(beforeX, beforeY);
    context.lineTo(currentX, currentY);
    context.stroke();
}

/**
 * クリア。キャンバスを白一色で塗りつぶす。
 */
function clearCanvas() {
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);

    $('#result').html("？")
}

/**
 * キャンバスに描画された画像をサーバに送信する。
 */
function sendImage() {
    var canvas = document.getElementById("canvas")

    // 画像をBase64文字列にエンコードする。
    var img = canvas.toDataURL();

    // toDataURL()の結果は "data:image/png;base64,{画像のBase64形式文字列}" となっているので、
    // 先頭から"base64,"までを削ってBase64文字列だけ残るようにする。
    img = img.replace(/^.+?base64,/, '');

    // リクエストを送信し、返ってきたレスポンスに入っている結果を表示に反映する
    $.ajax({
        type: "POST",
        url: "/",
        data: {
            "img": img
        },
    })
        .done((data) => {
            $('#result').html(data["result"])
        });
}
