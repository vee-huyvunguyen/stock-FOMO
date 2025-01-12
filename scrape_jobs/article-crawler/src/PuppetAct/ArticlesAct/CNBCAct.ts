import { ArticleAct } from '.';
import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import { RawNewsPage } from './schemas';
import { TypeCNBCActCSSselector } from '../CSSselectors';

class CNBCAct extends ArticleAct {
  constructor(
    scrapeMaster: ScrapeMaster,
    articleURL: string,
    elements: TypeCNBCActCSSselector,
    pageType?: string,
  ) {
    super(scrapeMaster, articleURL, elements, pageType);
  }

  async checkIsNewsPage(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getOtherNewsLinks(): string[] {
    throw new Error('Method not implemented.');
  }

  getOtherLinks(): string[] {
    throw new Error('Method not implemented.');
  }

  async getNewsInfo(): Promise<RawNewsPage> {
    throw new Error('Method not implemented.');
  }

  async scrape(): Promise<RawNewsPage> {
    throw new Error('Method not implemented.');
  }
}

export default CNBCAct;
