import { createClient } from 'redis';

// Create a Redis client with connection options
export const redisClient = createClient({
    password: '06pyTP1WP9pI9Mmquo8gZe2PXxkH4OIR',
    socket: {
        host: 'redis-15086.c278.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 15086
    }
});

// Handle errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

export default redisClient;