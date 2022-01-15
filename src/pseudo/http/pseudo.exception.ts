import { HttpException, HttpStatus } from '@nestjs/common';
import {
  InvalidPseudoError,
  NoPseudoAvailableError,
} from '../domain/pseudo.exception';

export class InvalidPseudoHTTPError extends HttpException {
  constructor(origin: InvalidPseudoError) {
    super(origin.message, HttpStatus.BAD_REQUEST);
  }
}

export class NoPseudoAvailableHTTPError extends HttpException {
  constructor(origin: NoPseudoAvailableError) {
    super(origin.message, HttpStatus.CONFLICT);
  }
}
