# Flexr

<p align="center">
  <img src="./logo.png" width="200" alt="mascot">
</p>

---

> Flexr is a self-hosted platform that automates the containerization and deployment of Node.js applications. It provides automatic SSL, DNS management, and container orchestration.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/node-v18%2B-green)](https://nodejs.org)

## Overview

Fenrir simplifies the deployment of Node.js applications by automating the processes involved in building containers, generating SSL certificates, configuring DNS, and monitoring deployments. It integrates with GitHub to streamline deployment workflows and provides real-time updates on deployment status.

## Features

- **Automated Deployment Pipeline**
  - Builds containers using Podman
  - Generates SSL certificates automatically with Certbot
  - Configures DNS dynamically through Cloudflare
  - Sets up an NGINX reverse proxy

- **Monitoring & Management**
  - Provides real-time deployment status
  - Monitors container health
  - Tracks resource usage
  - Maintains deployment history

- **Security**
  - Automatically manages SSL/TLS certificates
  - Configures secure proxy settings
  - Ensures container isolation

## Why I Created Flexr

I created Flexr to simplify the deployment process for Node.js applications, making it easier for developers to manage their applications without getting bogged down by the complexities of containerization and deployment. My goal is to provide a tool that enhances productivity and streamlines workflows.

## Prerequisites

- Node.js (v18+) & TypeScript
- Podman
- PostgreSQL
- Redis
- NGINX
- Cloudflare Account

## Environment Variables

```bash
# System Configuration
LINUX_USR=your_linux_user
HOST=your_domain

# Cloudflare Configuration
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_EMAIL=your_email
CLOUDFLARE_GLOBAL_TOKEN=your_api_token

# Certbot Configuration
CERTBOT_EMAIL=your_email
```

## API Reference

### Deployment Endpoints

```typescript
POST /v1/runContainer
{
  "userName": "string",
  "projectName": "string",
  "repoLink": "string",
  "entryPoint": "string",
  "buildCommand": "string",
  "runCommand": "string"
}
```

### Management Endpoints

- `GET /v1/health` - System health check
- `GET /v1/repositories` - List GitHub repositories
- `GET /v1/profile` - User profile information
- `GET /htmx/deployments` - Deployment history

## Architecture

- **Frontend**: HTMX + Vanilla JavaScript
- **Backend**: TypeScript & Express.js
- **Database**: PostgreSQL + Redis
- **Container**: Podman
- **Proxy**: NGINX
- **DNS**: Cloudflare API
- **SSL**: Certbot

## Currently Building For

Fenrir is currently built for RHEL-based distributions. While it can work on any Linux distribution as the necessary utilities are available, it has not been extensively tested on other systems.

## Demo

[![Demo Video](https://img.youtube.com/vi/your_video_id/0.jpg)](https://www.youtube.com/watch?v=your_video_id)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 3 of the License.

---
Made with ❤️ by Akshat Kotpalliwar (alias IntegerAlex on GitHub)
```
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

