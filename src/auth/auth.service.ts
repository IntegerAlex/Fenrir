// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { createDirectory } from '../utils/container.util';

@Injectable()
export class AuthService {
  login(passKey: string): string | null {
    if (passKey === process.env.PASS_KEY) {
      return Math.random().toString(36).substring(2); // Generate session ID
    }
    return null;
  }
}
