# NaomeshWebapp


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ ng serve

# docker
$ docker build -t naomesh-webapp .
$ docker run -d -p 80:80 naomesh-webapp
```

## Push to docker hub

```bash
$ docker build -t naomesh-webapp .

$ docker tag naomesh-api rouretl/naomesh-webapp

$ docker login -u "login" -p "mdp" docker.io

$ docker push rouretl/naomesh-webapp
```bash
$ ./build_push_dockerio.sh
```

OU

```bash
$ docker build -t naomesh-webapp .

$ docker tag naomesh-api rouretl/naomesh-webapp

$ docker login -u "login" -p "mdp" docker.io

$ docker push rouretl/naomesh-webapp
```