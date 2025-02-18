import {
  BaseWatcher,
  WatchThings,
  CheckLogResult,
} from 'PuppetShow/TheWatcher/BaseWatcher';
import { Log } from 'crawlee';
import { isNotValuable } from 'PuppetShow/TheWatcher/watcherUtils';

export default class CrawleeWatcher implements BaseWatcher {
  constructor(public crawleeLogger: Log) {
    this.crawleeLogger = crawleeLogger;
  }
  generateMessage({ msg }: WatchThings): string {
    return msg;
  }
  log(msg: string): void {
    this.crawleeLogger.info(msg);
  }
  info({ msg }: WatchThings): void {
    this.crawleeLogger.info(msg);
  }
  error({ msg }: WatchThings): void {
    this.crawleeLogger.error(msg);
  }
  warn({ msg }: WatchThings): void {
    this.crawleeLogger.warning(msg);
  }
  checkInfo<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = isNotValuable(toCheck);
    needsLog ? this.info(watchThings) : undefined;
    return { needsLog, checkedObj: toCheck };
  }
  checkError<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = isNotValuable(toCheck);
    needsLog ? this.error(watchThings) : undefined;
    return { needsLog, checkedObj: toCheck };
  }
  checkWarn<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = isNotValuable(toCheck);
    needsLog ? this.info(watchThings) : undefined;
    return { needsLog, checkedObj: toCheck };
  }
}
