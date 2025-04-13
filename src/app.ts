import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import router from './routes';

const app: Express = express();
const port = process.env.PORT || 8000

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this line to parse cookies
app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server berjalan di http://localhost:${port}`);
});