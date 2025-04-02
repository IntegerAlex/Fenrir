// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { createDirectory } from '../utils/container.util';

@Injectable()
export class AuthService {
  login(githubUsername: string, passKey: string): string | null {
    if (passKey === process.env.PASS_KEY) {
      createDirectory(githubUsername);
      return Math.random().toString(36).substring(2); // Generate session ID
    }
    return null;
  }
}
