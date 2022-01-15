import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import * as path from 'path';

jest.setTimeout(10000);
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dockerCompose: StartedDockerComposeEnvironment;

  beforeAll(async () => {
    const composeFilePath: string = path.resolve(__dirname, '..');
    const composeFileName = 'docker-compose.yml';

    dockerCompose = await new DockerComposeEnvironment(
      composeFilePath,
      composeFileName,
    ).up();
    console.log('Docker-compose up');
  });

  afterAll(async () => {
    await dockerCompose.down();
    console.log('Docker-compose down');
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Pseudo', () => {
    describe('POST /pseudo', () => {
      it('should return the name of a newly created pseudo', () => {
        return request(app.getHttpServer())
          .post('/pseudo')
          .send({ name: 'AAA' })
          .expect(201)
          .expect({ name: 'AAA' });
      });

      it('should return an Error message for an invalid input name', () => {
        return request(app.getHttpServer())
          .post('/pseudo')
          .send({ name: 'ABCDE' })
          .expect(400)
          .expect({
            statusCode: 400,
            message:
              "Invalid pseudo 'ABCDE' : Pseudo should contains only 3 upper Characters (/^[A-Z]{3}$/)",
          });
      });

      it('should return an Error message for an invalid input schema', () => {
        return request(app.getHttpServer())
          .post('/pseudo')
          .send({ nameee: 'ABC' })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Validation failed',
            error: 'Bad Request',
          });
      });
    });
  });
});
