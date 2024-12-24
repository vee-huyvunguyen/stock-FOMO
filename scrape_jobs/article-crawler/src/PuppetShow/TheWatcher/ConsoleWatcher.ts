import {
  WatchConfig,
  BaseWatcher,
  WatchThings,
  CheckLogResult,
} from './BaseWatcher';
import { checkObjectToLog } from './watcherUtils';

class ConsoleWatcher implements BaseWatcher {
  public constructor(public config: WatchConfig) {
    this.config = config;
  }
  generateMessage(watchThings: WatchThings): string {
    return (
      new Date().toISOString() +
      '-' +
      (watchThings.level ? watchThings.level + '-' : '') +
      watchThings.msg +
      (watchThings.err ? watchThings.err + '\n' : '')
    );
  }
  log(msg: string): void {
    console.log(msg);
  }
  info(watchThings: WatchThings): void {
    if (this.config.level && ['info', 'warn'].includes(this.config.level)) {
      this.log(this.generateMessage({ level: 'INFO', ...watchThings }));
    }
  }
  error(watchThings: WatchThings): void {
    if (
      this.config.level &&
      ['info', 'warn', 'error'].includes(this.config.level)
    ) {
      this.log(this.generateMessage({ level: 'ERROR', ...watchThings }));
    }
  }
  warn(watchThings: WatchThings): void {
    if (this.config.level === 'warn') {
      this.log(this.generateMessage({ level: 'WARN', ...watchThings }));
    }
  }
  checkInfo<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = checkObjectToLog(toCheck);
    needsLog ? this.info(watchThings) : undefined;
    return { needsLog, checkedObj: toCheck };
  }
  checkError<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = checkObjectToLog(toCheck);
    needsLog ? this.error(watchThings) : undefined;
    return { needsLog, checkedObj: toCheck };
  }
  checkWarn<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = checkObjectToLog(toCheck);
    needsLog ? this.info(watchThings) : undefined;
    return { needsLog, checkedObj: toCheck };
  }
}

export default ConsoleWatcher;
