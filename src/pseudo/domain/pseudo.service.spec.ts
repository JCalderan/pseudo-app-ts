import { PseudoService } from './pseudo.service';
import { Pseudo } from './pseudo.model';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeORMQueryRunnerFactory } from '../postgres/postgres.connectionFactory';
import { NoPseudoAvailableError } from './pseudo.exception';

describe('PseudoService', () => {
  // huge boilerplate to be inject and infer correct types
  // thx to : https://stackoverflow.com/questions/55366037/inject-typeorm-repository-into-nestjs-service-for-mock-data-testing
  type MockType<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [P in keyof T]?: jest.Mock<{}>;
  };

  let service: PseudoService;
  let repositoryMock: MockType<Repository<Pseudo>>;
  const pseudoRepositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
    () => ({
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    }),
  );
  const TypeORMQueryRunnerFactoryMockFactory = () => ({
    getQueryRunner: () => ({
      startTransaction: jest.fn(() => Promise.resolve()),
      commitTransaction: jest.fn(() => Promise.resolve()),
      rollbackTransaction: jest.fn(() => Promise.resolve()),
      release: jest.fn(() => Promise.resolve()),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PseudoService,
        {
          provide: TypeORMQueryRunnerFactory,
          useFactory: TypeORMQueryRunnerFactoryMockFactory,
        },
        {
          provide: getRepositoryToken(Pseudo),
          useFactory: pseudoRepositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<PseudoService>(PseudoService);
    repositoryMock = module.get(getRepositoryToken(Pseudo));
  });

  describe('When a pseudo does not existing in db', () => {
    describe('Pseudo.registerPseudo', () => {
      it('should save a new generated pseudo', async () => {
        // Given
        const aPseudo: Pseudo = Pseudo.of('ANY', 'ANX', 'ANZ');
        repositoryMock.findOne.mockReturnValueOnce(Promise.resolve(undefined));
        repositoryMock.save.mockReturnValueOnce(Promise.resolve(aPseudo));

        // When
        const aSavedPseudo: Pseudo = await service.registerPseudo('ANY');

        // Then
        expect(aSavedPseudo.getName()).toBe('ANY');
        expect(repositoryMock.save).toHaveBeenCalledWith(aPseudo);
      });
    });
  });

  describe("When a pseudo already exists in db and a pseudo is found with it's previous and next values availables", () => {
    describe('Pseudo.registerPseudo', () => {
      it('should save a new pseudo', async () => {
        // Given
        const aPseudo: Pseudo = Pseudo.of('ANY', 'ANX', 'ANZ');
        const aPseudoWithPrevAndNextValuesAvailables: Pseudo = Pseudo.of(
          'ABC',
          'ABB',
          'ABD',
        );
        repositoryMock.findOne.mockReturnValueOnce(Promise.resolve(aPseudo));
        repositoryMock.find.mockReturnValueOnce(
          Promise.resolve([aPseudoWithPrevAndNextValuesAvailables]),
        );
        repositoryMock.save.mockImplementation((_) => _); // always return what we save

        // When
        const aSavedPseudo: Pseudo = await service.registerPseudo('ANY');

        // Then
        const expectedSavedPseudo: Pseudo = Pseudo.of('ABB', 'ABA', 'ABC');
        expectedSavedPseudo.next_value_used = true;
        expect(aSavedPseudo.getName()).toBe(expectedSavedPseudo.name);
        expect(repositoryMock.save).toHaveBeenLastCalledWith(
          expectedSavedPseudo,
        );
      });
    });
  });

  describe("When a pseudo already exists in db and a pseudo is found with only it's previous value available", () => {
    describe('Pseudo.registerPseudo', () => {
      it('should save a new generated pseudo', async () => {
        // Given
        const aPseudo: Pseudo = Pseudo.of('ANY', 'ANX', 'ANZ');
        const aPseudoWithPrevValueAvailable: Pseudo = Pseudo.of(
          'ABC',
          'ABB',
          'ABD',
        );
        aPseudoWithPrevValueAvailable.next_value_used = true;
        repositoryMock.findOne.mockReturnValueOnce(Promise.resolve(aPseudo));
        repositoryMock.find.mockReturnValueOnce(
          Promise.resolve([aPseudoWithPrevValueAvailable]),
        );
        repositoryMock.save.mockImplementation((_) => _); // always return what we save

        // When
        const aSavedPseudo: Pseudo = await service.registerPseudo('ANY');

        // Then
        const expectedSavedPseudo: Pseudo = Pseudo.of('ABB', 'ABA', 'ABC');
        expectedSavedPseudo.next_value_used = true;
        expect(aSavedPseudo.getName()).toBe(expectedSavedPseudo.name);
        expect(repositoryMock.save).toHaveBeenLastCalledWith(
          expectedSavedPseudo,
        );
      });
    });
  });

  describe("When a pseudo already exists in db and another pseudo is found with only it's next value available", () => {
    describe('Pseudo.registerPseudo', () => {
      it('should save a new generated pseudo', async () => {
        // Given
        const aPseudo: Pseudo = Pseudo.of('ANY', 'ANX', 'ANZ');
        const aPseudoWithNextValueAvailable: Pseudo = Pseudo.of(
          'ABC',
          'ABB',
          'ABD', // this 'next' value is available
        );
        aPseudoWithNextValueAvailable.previous_value_used = true;
        repositoryMock.findOne.mockReturnValueOnce(Promise.resolve(aPseudo));
        repositoryMock.find.mockReturnValueOnce(Promise.resolve([])); // look for previous value available => no match
        repositoryMock.find.mockReturnValueOnce(
          Promise.resolve([aPseudoWithNextValueAvailable]), // look for next value available => match
        );
        repositoryMock.save.mockImplementation((_) => _); // always return what we save

        // When
        const aSavedPseudo: Pseudo = await service.registerPseudo('ANY');

        // Then
        const expectedSavedPseudo: Pseudo = Pseudo.of('ABD', 'ABC', 'ABE');
        expectedSavedPseudo.previous_value_used = true;
        expect(aSavedPseudo.getName()).toBe(expectedSavedPseudo.name);
        expect(repositoryMock.save).toHaveBeenLastCalledWith(
          expectedSavedPseudo,
        );
      });
    });
  });

  describe("When a pseudo already exists in db and no pseudo is found with either it's previous and next values availables", () => {
    describe('Pseudo.registerPseudo', () => {
      it('return a rejected promise with an error message', async () => {
        // Given
        const aPseudo: Pseudo = Pseudo.of('ANY', 'ANX', 'ANZ');
        repositoryMock.findOne.mockReturnValueOnce(Promise.resolve(aPseudo));
        repositoryMock.find.mockReturnValueOnce(Promise.resolve([])); // look for previous value available => no match
        repositoryMock.find.mockReturnValueOnce(Promise.resolve([])); // look for next value available => no match
        repositoryMock.save.mockImplementation((_) => _); // always return what we save

        // When
        const pseudoRegistration = () => service.registerPseudo('ANY');

        // Then
        expect(pseudoRegistration).rejects.toEqual(
          new NoPseudoAvailableError('ANY'),
        );
      });
    });
  });
});
