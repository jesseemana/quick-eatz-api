import 'dotenv/config';
import express, { Request, Response } from 'express';
import { 
  RestaurantRoute, 
  UserRoute, 
  FavoriteRoute, 
  OrderRoute, 
  ReviewRoute,
  MyRestaurantRoute,
} from './routes';
import cors from 'cors';
import helmet from 'helmet';
import { log, database } from './utils';
import { allowedOrigins } from './constants';

const app = express();
const PORT = parseInt(process.env.PORT as string) || 3001;

app.use(helmet())
app.use(cors({ origin: [...allowedOrigins] })); 
// TODO: create/install strip webhook stuff then add webhook command in pkg.json
app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }));
app.use(express.json({ limit: '5MB' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});

app.use('/api/my/user', UserRoute);
app.use('/api/restaurant', RestaurantRoute);
app.use('/api/order', OrderRoute);
app.use('/api/my/restaurant', MyRestaurantRoute);
app.use('/api/favorite', FavoriteRoute);
app.use('/api/review', ReviewRoute);

function main() {
  const server = app.listen(PORT, () => {
    database.connect();
    log.info(`server started on http://localhost:${PORT}`);
  });

  const signals = ['SIGTERM', 'SIGINT'];

  function gracefulShutdown(signal: string) {
    process.on(signal, () => {
      log.info(`Received signal: ${signal}, shutting down server...`);
      server.close();
      database.disconnect();
      log.info('Goodbye...😥💤💤');
      process.exit(0);
    });
  }

  signals.forEach((signal) => gracefulShutdown(signal));
}

main();
