import redis from '@/app/lib/redis';

export async function evolve(user_id: string) {
  const now = Date.now();
  const { lastEvolvedUser, lastEvolvedAt, currGeneration } = (await redis.hgetall('board')) ?? {};
  if (lastEvolvedUser === user_id) {
    return;
  }
  const lastEvolution = await redis.hget('rateLimits', user_id);
  // if (lastEvolution && now - parseInt(lastEvolution, 10) < 1000) {
  //   throw new Error('hold up!');
  // }
  if (lastEvolvedUser && lastEvolvedAt) {
    await redis.zincrby('userGenerations', 1, user_id);
    await redis.zincrby('users', 1, user_id);
  }
  // await redis.hset('users', user_id);
  await redis.hmset('board', { lastEvolvedUser: user_id, lastEvolvedAt: now });
  await redis.incr('generation');
  // const largestCellGroup  display to user after evolving
}
