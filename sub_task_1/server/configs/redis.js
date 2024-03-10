import Redis from "ioredis";

const redisClient = new Redis(process.env.REDISCLOUD_URL);
redisClient.on('connect', () => {
  console.log("Successfully connected to redis");
})
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
  throw Error(err.message);
});

export {
  redisClient
}