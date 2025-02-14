import { getErrorMessage } from '@/utils';
import { PageType } from '@/PuppetAct/ActConfig/CSSselectors';

type FieldName = string;
type FieldError = string;
type ScrapeFailStep =
  | 'load-page'
  | 'failed-to-dectect-page-type'
  | 'undesired-page-type'
  | 'scrape-element';

type FailReport = {
  failStep: ScrapeFailStep;
  loadPageError?: string;
  fieldsFailedToScrape?: [FieldName, FieldError][];
};

type ScrapeStatus = {
  success: boolean;
  pageType?: {
    detected?: PageType;
    manuallyParsed?: PageType;
  };
  failReport?: FailReport;
};

class ScrapeStatusHandler {
  constructor(public scrapeStatus: ScrapeStatus) {
    this.scrapeStatus = scrapeStatus;
  }
  static new() {
    return new ScrapeStatusHandler({ success: true });
  }
  updateSuccess() {
    this.scrapeStatus.success = true;
    this.scrapeStatus.failReport = undefined;
  }
  updateFail() {
    this.scrapeStatus.success = false;
  }
  getDetectedPageType(): string | undefined {
    return this.scrapeStatus.pageType?.detected;
  }
  isSuccess(): boolean {
    return this.scrapeStatus.success;
  }
  updatePageType(pageType: PageType, how: 'detected' | 'manuallyParsed') {
    if (!this.scrapeStatus.pageType) {
      this.scrapeStatus.pageType = {};
    }
    if (how == 'detected') {
      this.scrapeStatus.pageType.detected = pageType;
    } else this.scrapeStatus.pageType.manuallyParsed = pageType;
  }
  updateFailStep(step: ScrapeFailStep) {
    this.updateFail();
    this.updateFailReport({ failStep: step });
  }
  updateManuallyParsedPageType(parsedPageType: string) {
    this.updatePageType(parsedPageType, 'manuallyParsed');
  }
  updateDetectedPageType(parsedPageType: string) {
    this.updatePageType(parsedPageType, 'detected');
  }
  updateLoadPageError(err: unknown) {
    this.updateFailReport({
      failStep: 'load-page',
      loadPageError: getErrorMessage(err),
    });
  }
  updateUndesiredPageError() {
    this.updateFailReport({ failStep: 'undesired-page-type' });
  }
  updateFailedToDectectPageType() {
    this.updateFailReport({ failStep: 'failed-to-dectect-page-type' });
  }
  addFieldsFailedToScrape(failedField: [FieldName, FieldError]) {
    const oldFailedFields = this.scrapeStatus.failReport?.fieldsFailedToScrape;
    const newFailedFields = oldFailedFields
      ? [...oldFailedFields, failedField]
      : [failedField];
    this.updateFailReport({
      failStep: 'scrape-element',
      fieldsFailedToScrape: newFailedFields,
    });
  }
  updateFailReport(updates: FailReport) {
    this.updateFail();
    this.scrapeStatus.failReport = {
      ...this.scrapeStatus.failReport,
      ...updates,
    };
  }
}

export { ScrapeStatusHandler, ScrapeStatus, ScrapeFailStep };
