import { Body, Controller, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post('/fetch')
  public async fetch(@Body('cookie') cookie: string) {
    const fetchResponseDto = await this.assignmentsService.fetch(cookie);
    return this.assignmentsService.sortData(fetchResponseDto);
  }

  @Post('/render')
  public async render(@Body('cookie') cookie: string) {
    return this.assignmentsService.render({ cookie });
  }

  @Post('/fetch-safari')
  public async fetchSafari(@Body('raw') raw: string) {
    return this.assignmentsService.sortData(raw);
  }

  @Post('/render-safari')
  public async renderSafari(@Body('raw') raw: string) {
    return this.assignmentsService.render({ raw });
  }
}
