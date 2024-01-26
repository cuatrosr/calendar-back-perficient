export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'mysupersecretjwt',
    expires: process.env.JWT_EXPIRES || '1h',
  },
  database: {
    host: process.env.DATABASE_HOST || '127.0.0.1:27017',
  },
});
