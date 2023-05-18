import Redis from "ioredis";

export const redis = new Redis(process.env.REDISCLOUD_URL);

export class Cache {
  public static async remember<T = any>(
    key: string,
    seconds: number,
    callback: Function
  ) {
    const previousValue = await redis.get(key);

    if (previousValue) return JSON.parse(previousValue);

    const value = (await callback()) as T;

    redis.set(key, JSON.stringify(value), "EX", seconds);

    return value;
  }

  public static async forget(key: string) {
    return redis.unlink(key);
  }

  public static async increment(key: string) {
    return redis.incr(key);
  }

  public static async rememberForever<T = any>(
    key: string,
    callback: Function
  ) {
    const previousValue = await redis.get(key);

    if (previousValue) return JSON.parse(previousValue);

    const value = (await callback()) as T;

    redis.set(key, JSON.stringify(value));

    return value;
  }
}
