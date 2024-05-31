import 'dotenv/config';
import express, { Request, Response } from 'express';
import { 
  UserRoute, 
  OrderRoute, 
  RestaurantRoute, 
  MyRestaurantRoute,
  FavoriteRoute, 
} from './routes';
import cors from 'cors';
import database from './utils/database';
import { allowedOrigins } from './constants';
import log from './utils/logger';

const app = express();
const PORT = parseInt(process.env.PORT as string) || 3001;

app.use(cors({ origin: [...allowedOrigins] })); 
// TODO: create/install strip webhook stuff then add webhook command in pkg.json
app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }));
app.use(express.json({ limit: '5MB' }));

app.get('/health', (_req: Request, res: Response) => res.status(200).json({ message: 'OK' }));

app.use('/api/my/user', UserRoute);
app.use('/api/restaurant', RestaurantRoute);
app.use('/api/order', OrderRoute);
app.use('/api/my/restaurant', MyRestaurantRoute);
app.use('/api/favorite', FavoriteRoute);

function main() {
  const server = app.listen(PORT, () => {
    database.connect();
    log.info(`server started on http://localhost:${PORT}`);
  });

  const signals = ['SIGTERM', 'SIGINT'];

  function gracefulShutdown(signal: string) {
    process.on(signal, () => {
      log.info('Received signal', signal);
      log.info('Shutting down server...');
      server.close();
      database.disconnect();
      log.info('Goodbye...😥💤💤');
      process.exit(0);
    });
  }

  signals.forEach((signal) => gracefulShutdown(signal));
}

main();
