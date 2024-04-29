import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDb from './utils/database';
import { UserRoute, OrderRoute, RestaurantRoute, MyRestaurantRoute, } from './routes';

const app = express();
const PORT = parseInt(process.env.PORT as string)|| 7000;

app.use(cors());
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => res.send({ message: 'health OK!' }));

app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }));

app.use('/api/order', OrderRoute);
app.use('/api/my/user', UserRoute);
app.use('/api/restaurant', RestaurantRoute);
app.use('/api/my/restaurant', MyRestaurantRoute);

app.listen(PORT, async () => {
  await connectDb();
  console.log('server started on http://localhost:7000');
});
