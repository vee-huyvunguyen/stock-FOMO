import { Counter, Gauge, Registry } from 'prom-client';
import {
  BaseWatcher,
  WatchConfig,
  WatchThings,
  CheckLogResult,
} from '../PuppetShow/TheWatcher/BaseWatcher';

interface PrometheusConfig extends WatchConfig {
  prometheusUrl: string;
  prefix?: string;
  defaultLabels?: Record<string, string>;
}

export default class PrometheusLogger implements BaseWatcher {
  private registry: Registry;
  private requestCounter: Counter;
  private errorCounter: Counter;
  private scrapeDurationGauge: Gauge;
  private activeRequestsGauge: Gauge;

  constructor(public config: PrometheusConfig) {
    // Initialize Prometheus registry
    this.registry = new Registry();

    // Add default labels if provided
    if (config.defaultLabels) {
      this.registry.setDefaultLabels(config.defaultLabels);
    }

    // Initialize metrics
    const metricPrefix = config.prefix || 'crawler';

    this.requestCounter = new Counter({
      name: `${metricPrefix}_requests_total`,
      help: 'Total number of requests made by the crawler',
      labelNames: ['status', 'url_domain'],
    });

    this.errorCounter = new Counter({
      name: `${metricPrefix}_errors_total`,
      help: 'Total number of errors encountered',
      labelNames: ['error_type'],
    });

    this.scrapeDurationGauge = new Gauge({
      name: `${metricPrefix}_scrape_duration_seconds`,
      help: 'Duration of scraping operations',
      labelNames: ['operation'],
    });

    this.activeRequestsGauge = new Gauge({
      name: `${metricPrefix}_active_requests`,
      help: 'Number of currently active requests',
    });

    // Register metrics
    this.registry.registerMetric(this.requestCounter);
    this.registry.registerMetric(this.errorCounter);
    this.registry.registerMetric(this.scrapeDurationGauge);
    this.registry.registerMetric(this.activeRequestsGauge);

    // Start metrics server
    this.startMetricsServer();
  }

  private async startMetricsServer() {
    try {
      // Connect to external Prometheus server
      const response = await fetch(
        `${this.config.prometheusUrl}/api/v1/write`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: await this.registry.metrics(),
        },
      );

      if (!response.ok) {
        console.error(
          'Failed to connect to Prometheus server:',
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error connecting to Prometheus:', error);
    }
  }

  generateMessage(watchThings: WatchThings): string {
    const { level = 'INFO', msg } = watchThings;
    return `[${level}] ${msg}`;
  }

  log(msg: string): void {
    // Increment request counter based on message content
    if (msg.includes('Processing')) {
      const urlDomain = new URL(msg.split(' ')[1]).hostname;
      this.requestCounter.inc({ status: 'processing', url_domain: urlDomain });
    }
  }
  checkInfo<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = !toCheck;
    if (needsLog) {
      this.errorCounter.inc({
        error_type: 'missing_data',
        error_message: watchThings.msg,
      });
      this.info(watchThings);
    }
    return { needsLog, checkedObj: toCheck };
  }
  info(watchThings: WatchThings): void {
    const msg = this.generateMessage(watchThings);
    this.log(msg);
  }

  warn(watchThings: WatchThings): void {
    const msg = this.generateMessage({ ...watchThings, level: 'WARN' });
    this.log(msg);
    this.errorCounter.inc({ error_type: 'warning' });
  }

  error(watchThings: WatchThings): void {
    const msg = this.generateMessage({ ...watchThings, level: 'ERROR' });
    this.log(msg);
    this.errorCounter.inc({ error_type: 'error' });
  }

  // Additional methods for tracking metrics
  startScraping(operation: string): void {
    this.activeRequestsGauge.inc();
    this.scrapeDurationGauge.startTimer({ operation });
  }

  endScraping(operation: string): void {
    this.activeRequestsGauge.dec();
    this.scrapeDurationGauge.setToCurrentTime({ operation });
  }

  // Method to get current metrics
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
  checkWarn<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = !toCheck;
    if (needsLog) {
      this.errorCounter.inc({
        error_type: 'warning',
        error_message: watchThings.msg,
      });
      this.warn(watchThings);
    }
    return { needsLog, checkedObj: toCheck };
  }

  checkError<T>(toCheck: T, watchThings: WatchThings): CheckLogResult<T> {
    const needsLog = !toCheck;
    if (needsLog) {
      this.errorCounter.inc({
        error_type: 'error',
        error_message: watchThings.msg,
      });
      this.error(watchThings);
    }
    return { needsLog, checkedObj: toCheck };
  }
}
