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
