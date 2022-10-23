<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">Nest Pokedex API</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

This API was created with:

- [Nest](https://github.com/nestjs/nest)
- MongoDB
- Docker

## References

- https://docs.nestjs.com/techniques/mongodb

## Author

Ariel Duarte (c)2022

## Installations

```bash
$ npm i -g @nestjs/cli
```

```bash
$ yarn install
```

## Runing Database

```bash
$ docker-compose up -d
```

## Rename **.env-template** file to **.env** into the projecto and setting your local environment variables

## Populate database from seed sevice

```bash
http://localhost:3000/api/v1/seed
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
