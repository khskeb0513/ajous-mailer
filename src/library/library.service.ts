import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { HbsCompileService } from '../sender/hbs-compile.service';

@Injectable()
export class LibraryService {
  constructor(private readonly httpService: HttpService) {}

  public async fetch(cookieValue: string) {
    const parsed = JSON.parse(cookieValue).accessToken;
    const response = await lastValueFrom(
      this.httpService.get(
        'https://library.ajou.ac.kr/pyxis-api/1/api/charges',
        {
          headers: {
            'pyxis-auth-token': parsed,
          },
        },
      ),
    );
    if (!response.data.success) {
      return null;
    } else {
      return { sorted: response.data.data.list };
    }
  }

  public async render(cookieValue: string) {
    const response = await this.fetch(cookieValue);
    if (!response) return null;
    return HbsCompileService.compile('/render/library/render.hbs', response);
  }
}
