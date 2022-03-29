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

export class FetchResponseDto {
  results: Results[];
}
