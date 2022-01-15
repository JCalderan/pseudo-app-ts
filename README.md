<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

An application that insert 'Pseudonymes' (a combination of 3 upper case letters) in database.
The application expose a signe endpoint (POST /pseudo) in order to create pseudo:
- if the pseudo already exists, another 'available' pseudo is created and returned
- if the pseudo already exists, and all other pseudonymes are already taken, an error is returned
- if the pseudo is free, the pseudo is created and returned

## Project structure
The project structure is a simple layered architecture:
- src: contains the source code
- src/pseudo: feature module, contains everything about Pseudonymes
- src/pseudo/domain: package containing business rules, and entities (entities and repositories should be moved to postgres package)
- src/pseudo/http: package containing all HTTP related classes
- src/pseudo/postgres: package containing all database specific classes
- db: contains database initialization script (used by docker-compose)
- test: contain e2e tests
- dist: contains compiled source code
- root directory: contains all project configuration files
## Launch the application (Docker)

```bash
$ git clone git@github.com:JCalderan/pseudo-app-ts.git
$ cd pseudo-app-ts
$ docker-compose up -d # wait a few seconds for the application and the database to be up and running
$ curl --request POST 'http://localhost:8080/pseudo' --header 'Content-Type: application/json' --data-raw '{"name": "AAA"}'
```

## Installation (Node v17.* and Docker)
This will require Nodejs version 17 or higher.

```bash
$ corepack enable # https://yarnpkg.com/getting-started/install
$ yarn install
```

## Running the app

```bash
$ git clone git@github.com:JCalderan/pseudo-app-ts.git
$ cd pseudo-app-ts
$ docker-compose up -d db

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests (need docker and docker-compose to be installed)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### TODOs:
The following topics need to be implemented or researched:
- use a logger
- make the application port configurable
- enhance coverage on non-domain modules
- build the project docker image with GithubActions
- launch e2e tests with GithubActions
- produce coverage artifact with GithubActions
- inject SQL fixtures in e2e tests before each use cases
- reduce boilerplate code in unit tests
- Refactor the application code with Hexagonal Architecture principles...might need to drop nestjs

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
