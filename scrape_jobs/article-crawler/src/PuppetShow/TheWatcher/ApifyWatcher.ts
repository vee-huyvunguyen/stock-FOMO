import { Logger, LogLevel } from 'apify';
import {
  BaseWatcher,
  WatchThings,
  CheckLogResult,
} from './BaseWatcher.js';
import { isNotValuable } from './watcherUtils.js';

export default class CrawleeWatcher implements BaseWatcher {
  constructor(public crawleeLogger: Logger) {
    this.crawleeLogger = crawleeLogger;
  }

  generateMessage({ msg }: WatchThings): string {
    return msg;
  }

  log(msg: string): void {
    this.crawleeLogger.log(LogLevel.INFO, msg);
  }

  info({ msg }: WatchThings): void {
    this.crawleeLogger.log(LogLevel.INFO, msg);
  }

  error({ msg }: WatchThings): void {
    this.crawleeLogger.log(LogLevel.ERROR, msg);
  }

  warn({ msg }: WatchThings): void {
    this.crawleeLogger.log(LogLevel.WARNING, msg);
  }

  checkInfo<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = isNotValuable(toCheck as object);
    if (needsLog) {
      this.info(watchThings);
    }
    return { needsLog, checkedObj: toCheck };
  }

  checkError<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = isNotValuable(toCheck as object);
    if (needsLog) {
      this.error(watchThings);
    }
    return { needsLog, checkedObj: toCheck };
  }

  checkWarn<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = isNotValuable(toCheck as object);
    if (needsLog) {
      this.info(watchThings);
    }
    return { needsLog, checkedObj: toCheck };
  }
}
