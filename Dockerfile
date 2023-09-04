FROM tensorflow/tensorflow

WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
RUN apt-get update && apt-get upgrade -y
# RUN apt-get install vim -y
RUN apt-get install -y libgl1-mesa-dev
COPY . /app