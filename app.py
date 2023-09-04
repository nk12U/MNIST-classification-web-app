import base64
from datetime import datetime

import cv2
import numpy as np
import tensorflow as tf
import uvicorn
from fastapi import FastAPI, Form, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# cnnのモデルを読み込む
model = tf.keras.models.load_model("./model_cnn_ver3.keras")

# index.htmlおよびstatic以下のファイル読み込み用設定
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/")
async def get_index(request: Request):
    """
    GET処理。index.htmlを返す。
    """
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/")
async def predict(img: str = Form()):
    """
    POST処理。リクエストの画像から数字を予測し、結果を返す。
    """
    # 画像のBase64文字列をバイナリとして取り出し、画像にデコードする。
    img_binary = np.frombuffer(base64.b64decode(img), np.uint8)
    img: np.ndarray = cv2.imdecode(img_binary, cv2.IMREAD_GRAYSCALE)

    # 28 x 28に縮小する。
    img = cv2.resize(img, (28, 28))

    # 背景白、黒文字の画像が送信されているので、
    # モデルへの投入形式に合わせて白黒を反転する。
    img = 255 - img
    save_image(img)

    # 判定する。
    result = predict_image(img)
    print("Predict result: ", result)

    # 判定結果を返す。
    return {"result": result}


def predict_image(x):
    """
    画像から数字を予測し、返す。
    Args:
        x: 画像のNumPy配列
    Returns: 数字
    """
    # 画像を1枚 x 一次元の配列に変形。
    # CNNの場合は1枚 x 28 x 28 x 1に変形。
    x = x.reshape(1, 28, 28, 1)

    # 画素の正規化。
    x = x.astype("float32")
    x /= 255

    # 予測。結果配列から1枚目分を取り出して返す。
    result = model.predict(x).argmax(axis=-1)
    return int(result[0])


def save_image(img):
    """
    渡された画像をファイルに保存する。
    imageディレクトリ配下に日時をファイル名として保存する。
    """
    datetime_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    cv2.imwrite(f"images/{datetime_str}.jpg", img)


if __name__ == "__main__":
    uvicorn.run("app:app", reload=True)
