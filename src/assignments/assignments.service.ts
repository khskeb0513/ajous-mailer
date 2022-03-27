import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  FetchDto,
  FetchResponseDto,
  Sorted,
} from './dto/fetch-response.dto';
import { DateTime } from 'luxon';
import { HbsCompileService } from '../sender/hbs-compile.service';

@Injectable()
export class AssignmentsService {
  constructor(private readonly httpService: HttpService) {}

  public async fetch(cookie: string): Promise<FetchResponseDto> {
    if (!cookie) return null;
    const response = await lastValueFrom(
      this.httpService.get(
        'https://eclass2.ajou.ac.kr/learn/api/v1/calendars/calendarItems',
        {
          headers: {
            Cookie: cookie,
          },
          params: {
            since: DateTime.now().setZone('UTC').toFormat('yyyy-MM-dd'),
          },
        },
      ),
    ).catch((e) => {
      return null;
    });
    if (!response) return null;
    const arr: Sorted[] = [];
    const data: FetchDto = response.data;
    data.results
      .sort(
        (a, b) =>
          parseInt(a.endDate.replace(/[^0-9]/gi, ''), 10) -
          parseInt(b.endDate.replace(/[^0-9]/gi, ''), 10),
      )
      .forEach((value) => {
        const setDate = (utcStr: string) =>
          DateTime.fromISO(utcStr, {
            zone: 'UTC',
          })
            .setZone('Asia/Seoul')
            .toLocaleString(
              {
                dateStyle: 'full',
                timeStyle: 'long',
                hour12: false,
              },
              {
                locale: 'ko-KR',
              },
            );
        value.startDate = setDate(value.startDate);
        value.calendarNameLocalizable.rawValue =
          value.calendarNameLocalizable.rawValue.split(': ')[1];
        const arrDate = DateTime.fromISO(value.endDate, {
          zone: 'UTC',
          locale: 'ko-KR',
        })
          .setZone('Asia/Seoul')
          .toLocaleString({
            dateStyle: 'full',
          });
        value.endDate = setDate(value.endDate);
        const arrChild = arr.find((value1) => value1.date === arrDate);
        if (!arrChild) {
          arr.push({
            date: arrDate,
            results: [value],
          });
        } else {
          arrChild.results.push(value);
        }
      });
    return {
      sorted: arr,
    };
  }

  public async render(cookie: string) {
    const response = await this.fetch(cookie);
    if (!response) return null;
    return HbsCompileService.compile(
      '/render/assignments/render.hbs',
      response,
    );
  }
}
