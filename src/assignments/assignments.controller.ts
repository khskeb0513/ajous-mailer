import { Body, Controller, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post('/fetch')
  public async fetch(@Body('cookie') cookie: string) {
    return this.assignmentsService.fetch(cookie);
  }

  @Post('/render')
  public async render(@Body('cookie') cookie: string) {
    return this.assignmentsService.render(cookie);
  }
}
