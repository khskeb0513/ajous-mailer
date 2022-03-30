import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { SortedResponseDto, Sorted } from './dto/sorted-response.dto';
import { DateTime } from 'luxon';
import { HbsCompileService } from '../sender/hbs-compile.service';
import { FetchResponseDto } from './dto/fetch-response.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly httpService: HttpService) {}

  public async fetch(cookie: string): Promise<FetchResponseDto> {
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
    ).catch(() => {
      return null;
    });
    if (!response) return null;
    return response.data;
  }

  public async sortData(raw: any): Promise<SortedResponseDto> {
    if (!raw) return null;
    const data: FetchResponseDto = raw;
    const arr: Sorted[] = [];
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
        if (!!value.calendarNameLocalizable.rawValue) {
          value.calendarNameLocalizable.rawValue =
            value.calendarNameLocalizable.rawValue.split(': ')[1];
        }
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

  public async render({ cookie = null, raw = null }) {
    if (!!cookie) {
      const fetchDto = await this.fetch(cookie);
      const response = await this.sortData(fetchDto);
      if (!response) return null;
      return HbsCompileService.compile(
        '/render/assignments/render.hbs',
        response,
      );
    }
    if (!!raw) {
      raw = JSON.parse(raw.replace(/\\/gi, ''));
      const response = await this.sortData(raw);
      if (!response) return null;
      return HbsCompileService.compile(
        '/render/assignments/render.hbs',
        response,
      );
    }
    return null;
  }
}
