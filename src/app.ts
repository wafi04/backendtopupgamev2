import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import router from './routes';
import { ConfigEnv } from './config/env';

const app: Express = express();
const port = ConfigEnv("production").PORT || 4000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server berjalan di http://localhost:${port}`);
});