import { Test, TestingModule } from '@nestjs/testing';
import { PseudoController } from './pseudo.controller';
import { PseudoService } from '../domain/app.service';

describe('SignupController', () => {
  let signupController: PseudoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PseudoController],
      providers: [PseudoService],
    }).compile();

    signupController = app.get<PseudoController>(PseudoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(signupController.signup()).toBe('Hello World!');
    });
  });
});
