import PrettyError from 'pretty-error';
import Winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

export class AppLogger {
  private readonly LOG_MAX_SIZE = 500000000;
  private readonly logger: Winston.Logger | null;
  private readonly prettyError = new PrettyError();
  private logType: string | undefined;
  private static basicOptions = {
    datePattern: 'YYYY-MM-DD',
    dirname: 'storage',
    filename: '%DATE%.log',
    json: true,
    level: 'info',
  };

  constructor(private context: string, filename?: string, subfolder?: string) {
    const options = Object.assign({}, AppLogger.basicOptions);
    const alignColorsAndTime = Winston.format.combine(
      Winston.format.colorize({
        all: true,
      }),
      Winston.format.label({
        label: '[LOGGER]',
      }),
      Winston.format.timestamp({
        format: 'YY-MM-DD HH:MM:SS',
      }),
      Winston.format.printf(
        (info) =>
          ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`,
      ),
    );

    this.logType = filename;
    options.dirname = subfolder
      ? `${options.dirname}/${subfolder}`
      : options.dirname;
    options.filename = subfolder
      ? `${filename}-${options.filename}`
      : options.filename;
    const logger = {
      silent: false,
      level: 'info',
      transports: [
        new Winston.transports.Console({
          format: alignColorsAndTime,
        }),
        new WinstonDailyRotateFile(options),
      ],
    };
    this.logger = Winston.createLogger(logger);
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }

  public log(message: string): void {
    const currentDate = new Date();

    this.logger?.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
  }

  public warn(message: string): void {
    const currentDate = new Date();

    this.logger?.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
  }

  public error(message: string): void {
    const currentDate = new Date();

    this.logger?.error(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
  }
}
