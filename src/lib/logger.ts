import pino from 'pino';

class Logger {
  logger: pino.Logger;

  constructor() {
    this.logger = pino({
      prettyPrint: {
        colorize: true,
        translateTime: true,
      },
      level: 'debug',
    });
  }

  info(msg: string, obj?: object) {
    if (obj) {
      this.logger.info(obj, msg);
    } else {
      this.logger.info(msg);
    }
  }

  debug(msg: string, obj?: object) {
    if (obj) {
      this.logger.debug(obj, msg);
    } else {
      this.logger.debug(msg);
    }
  }

  error(msg: string, error?: Error) {
    if (error) {
      this.logger.error(error, msg);
    } else {
      this.logger.error(msg);
    }
  }
}

export default new Logger();
