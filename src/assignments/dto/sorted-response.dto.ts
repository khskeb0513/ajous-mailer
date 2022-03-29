import { Results } from './fetch-response.dto';

export class Sorted {
  date: string;
  results: Results[];
}

export class SortedResponseDto {
  sorted: Sorted[];
}
