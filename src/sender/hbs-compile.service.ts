import { Global, Injectable } from '@nestjs/common';
import * as hbs from 'hbs';
import { readFileSync } from 'fs';
import { join } from 'path';

@Global()
@Injectable()
export class HbsCompileService {
  static compile(path: string, data: any) {
    const source = readFileSync(
      join(__dirname, '../../', 'views/', path),
    ).toString();
    const template = hbs.handlebars.compile(source);
    return template(data);
  }
}
