export class Results {
  endDate: string;
  startDate: string;
  title: string;
  itemSourceType: string;
  itemSourceId: string;
  calendarNameLocalizable: {
    rawValue: string;
  };
  color: string;
}

export class FetchDto {
  results: Results[];
}

export class Sorted {
  date: string;
  results: Results[];
}

export class FetchResponseDto {
  sorted: Sorted[];
}
