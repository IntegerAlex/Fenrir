// src/subdomain/subdomain.service.ts
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class SubdomainService {
  async setupSubdomain(subdomain: string, port: number, dnsRecordId: string): Promise<string> {
    await this.addDnsRecord(subdomain, dnsRecordId);
    await this.createNginxConfig(subdomain, port);
    await this.createNginxSymlink(subdomain);
    await this.getSSL(subdomain);
    await this.restartNginx();
    return 'Subdomain setup completed';
  }

  private async addDnsRecord(subdomain: string, dnsRecordId: string): Promise<void> {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
    const data = {
      type: 'A',
      name: `${subdomain}.flexr`,
      content: '35.223.20.186',
      ttl: 120,
      proxied: false,
      comment: 'Domain verification record',
      tags: [],
      id: dnsRecordId,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL || '',
        'X-Auth-Key': process.env.CLOUDFLARE_GLOBAL_TOKEN || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error updating DNS record');
    }
  }

  private async createNginxConfig(subdomain: string, port: number): Promise<void> {
    const config = `
server {
    listen 443 ssl;
    server_name ${subdomain}.flexr.flexhost.tech;
    ssl_certificate /etc/letsencrypt/live/${subdomain}.flexr.flexhost.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${subdomain}.flexr.flexhost.tech/privkey.pem;
    location / {
        proxy_pass http://localhost:${port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
    `;

    fs.writeFileSync(`/etc/nginx/sites-available/${subdomain}`, config, { encoding: 'utf8' });
  }

  private async createNginxSymlink(subdomain: string): Promise<void> {
    await execAsync(`sudo ln -s /etc/nginx/sites-available/${subdomain} /etc/nginx/sites-enabled/`);
  }

  private async getSSL(subdomain: string): Promise<void> {
    await execAsync(
      `sudo certbot --nginx -d ${subdomain}.flexr.flexhost.tech --non-interactive --agree-tos --email ${process.env.CERTBOT_EMAIL} && sudo systemctl reload nginx`
    );
  }

  private async restartNginx(): Promise<void> {
    await execAsync('sudo systemctl reload nginx');
  }
}
