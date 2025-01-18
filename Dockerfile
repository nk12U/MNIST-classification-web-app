FROM tensorflow/tensorflow
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
RUN apt update && apt upgrade -y
RUN apt install vim -y
RUN apt install libgl1-mesa-dev -y
COPY . /app