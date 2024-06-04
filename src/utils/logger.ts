import pino from 'pino';
import dayjs from 'dayjs';

const level = 'info';

const log = pino({
  level,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
