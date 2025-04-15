import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import router from './routes';
import 'module-alias/register';

const app: Express = express();
const port = process.env.PORT || 4000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server berjalan di http://localhost:${port}`);
});