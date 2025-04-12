import express, { Express } from 'express';
import router from './routes';

const app: Express = express();
const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)

app.listen(port, () => {
  console.log(`⚡️[server]: Server berjalan di http://localhost:${port}`);
});