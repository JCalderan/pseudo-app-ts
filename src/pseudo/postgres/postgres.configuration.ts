export default () => ({
  db_host: process.env.DB_HOST || 'localhost',
  db_port: parseInt(process.env.DB_PORT, 10) || 5432,
  db_userName: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_name: process.env.DB_NAME,
});
