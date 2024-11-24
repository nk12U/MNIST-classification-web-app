# MNIST-classification-web-app

## Overview

This project implements web application of MNIST classification. 

## Architecture

- Frontend: JavaScript
- Backend: Python
- Framework: FastAPI

<img src = "https://github.com/nk12U/MNIST-classification-web-app/blob/main/architecture.png"> 

## Command

```
$ git clone https://github.com/nk12U/MNIST-classification-web-app.git
$ docker-compose up --build -d
$ docker exec -it MNIST-classification-web-app /bin/bash
```
Inside the container
```
$ uvicorn app:app --host 0.0.0.0 --port 8000
```

access http://localhost:8000 with browser  

<img src = "https://github.com/nk12U/MNIST-classification-web-app/blob/main/screenshot.png"> 
