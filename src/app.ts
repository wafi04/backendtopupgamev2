import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import router from './routes';
import { ConfigEnv } from './config/env';
import cors from 'cors';

const app: Express = express();
const port = ConfigEnv().PORT || 4000

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server berjalan di http://localhost:${port}`);
});