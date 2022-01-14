import { Test, TestingModule } from '@nestjs/testing';
import { SignupController } from './signup.controller';
import { PseudoService } from '../domain/app.service';

describe('SignupController', () => {
  let signupController: SignupController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [PseudoService],
    }).compile();

    signupController = app.get<SignupController>(SignupController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(signupController.signup()).toBe('Hello World!');
    });
  });
});
