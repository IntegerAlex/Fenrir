interface Config {
  server: {
    port: number | string;
    baseUrl: string;
  };
  cloudflare: {
    zoneId?: string;
    email?: string;
    token?: string;
  };
  certbot: {
    email?: string;
  };
  redis: {
    url: string;
  };
  postgres: {
    url: string;
  };
}

export const config: Config = {
  server: {
    port: process.env.PORT || 8080,
    baseUrl: process.env.BASEURL || 'http://localhost:8080',
  },
  cloudflare: {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    email: process.env.CLOUDFLARE_EMAIL,
    token: process.env.CLOUDFLARE_GLOBAL_TOKEN,
  },
  certbot: {
    email: process.env.CERTBOT_EMAIL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  postgres: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/flexhost',
  },
};
