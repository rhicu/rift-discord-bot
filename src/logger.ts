import pino from 'pino';

class Logger {
  logger: pino.Logger;

  constructor() {
    this.logger = pino({
      prettyPrint: {
        colorize: true,
      },
    });
  }

  info(msg: string, obj?: object) {
    if (obj) {
      this.logger.info(obj, msg);
    }
    this.logger.info(msg);
  }

  debug(msg: string, obj?: object) {
    if (obj) {
      this.logger.debug(obj, msg);
    }
    this.logger.debug(msg);
  }

  error(msg: string, error?: Error) {
    if (error) {
      this.logger.error(error, msg);
    }
    this.logger.error(msg);
  }
}

export default new Logger();
