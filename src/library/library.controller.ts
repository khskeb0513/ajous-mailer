import { Body, Controller, Post } from '@nestjs/common';
import { LibraryService } from './library.service';

@Controller('/library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('/fetch')
  public async fetch(@Body('cookieValue') cookieValue: string) {
    return this.libraryService.fetch(cookieValue);
  }

  @Post('/render')
  public async render(@Body('cookieValue') cookieValue: string) {
    return this.libraryService.render(cookieValue);
  }
}
