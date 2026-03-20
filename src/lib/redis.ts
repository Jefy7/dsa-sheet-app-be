type RedisLike = {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, opts?: { ex?: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
  flushall(): Promise<unknown>;
};

class InMemoryRedis implements RedisLike {
  private readonly store = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return (this.store.get(key) as T | undefined) ?? null;
  }

  async set<T>(key: string, value: T): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async flushall(): Promise<string> {
    this.store.clear();
    return 'OK';
  }
}

let redisClient: RedisLike;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports,global-require
  const { Redis } = require('@upstash/redis');
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
} catch {
  redisClient = new InMemoryRedis();
}

export const redis = redisClient;
