import { URLSearchParams } from 'url';

export class URLManager {
  public static decodeURL(content: string): string {
    return decodeURIComponent(content);
  }

  public static extractParamsFromURL(content: string): URLSearchParams {
    return new URLSearchParams(content);
  }
}
