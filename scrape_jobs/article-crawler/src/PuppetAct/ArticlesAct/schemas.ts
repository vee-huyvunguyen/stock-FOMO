import { DateTime } from 'luxon';
import { getErrorMessage } from '../../utils';

type FieldName = string;
type FieldError = string;
type ScrapeFailStep =
  | 'load-page'
  | 'failed-to-dectect-page-type'
  | 'undesired-page-type'
  | 'scrape-element';

type FailReport = {
  failStep: ScrapeFailStep;
  manuallyParsedPageType?: string;
  loadPageError?: string;
  fieldsFailedToScrape?: [FieldName, FieldError][];
};

type ScrapeStatus = {
  success: boolean;
  detectedPageType?: PageType;
  failReport?: FailReport;
};

class ScrapeStatusHandler {
  constructor(public scrapeStatus: ScrapeStatus) {
    this.scrapeStatus = scrapeStatus;
  }
  static new() {
    return new ScrapeStatusHandler({ success: true });
  }
  updateSuccess(pageType: PageType) {
    this.scrapeStatus.success = true;
    this.scrapeStatus.failReport = undefined;
    this.updatePageType(pageType);
  }
  updateFail() {
    this.scrapeStatus.success = false;
  }
  getStatus(): ScrapeStatus {
    return this.scrapeStatus;
  }
  isSuccess(): boolean {
    return this.scrapeStatus.success;
  }
  updatePageType(pageType: PageType) {
    this.scrapeStatus.detectedPageType = pageType;
  }
  updateFailStep(step: ScrapeFailStep) {
    this.updateFail();
    this.updateFailReport({ failStep: step });
  }
  updateManuallyParsedPageType(parsedPageType: string) {
    this.updateFailReport({
      failStep: 'scrape-element',
      manuallyParsedPageType: parsedPageType,
    });
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
      ? oldFailedFields.concat(failedField)
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
type RawNewsPage = {
  url: string;
  content_elements: string[];
  author_element: string;
  post_datetime_element: string;
  category_element: string;
  content: string[];
  author: string;
  post_datetime: DateTime;
  category: string;
  other_news_links: string[];
  other_links: string[];
  scrape_status: ScrapeStatus;
  scraped_at: DateTime;
  inserted_at: DateTime;
};

export { RawNewsPage, ScrapeStatus, ScrapeFailStep, ScrapeStatusHandler };
