import * as fs from 'fs';
import * as net from 'net';

export const dockerFile = (
  entryPoint: string,
  buildCommand: string,
  runCommand: string
): string => `
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install && ${buildCommand}
EXPOSE 8080
CMD ["${runCommand}", "${entryPoint}"]
`;

export async function getPort(findPort: number): Promise<number> {
  const server = net.createServer();
  return new Promise((resolve) => {
    server.once('error', (err) => resolve(err.message === 'EADDRINUSE' ? getPort(findPort + 1) : findPort));
    server.once('listening', () => server.close(() => resolve(findPort)));
    server.listen(findPort);
  });
}

export function createDirectory(userName: string): void {
  const linuxUser = process.env.LINUX_USER || 'root';
  const dirPath = `/home/${linuxUser}/${userName.toLowerCase()}`;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
