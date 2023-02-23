/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable()
export class WebApiService {
  constructor(public readonly http: HttpClient) {}

  /**
   * Get live consumption of all nodes in watt specified by query parameter
   * @param nodes Array of node ids
   * @returns any successful operation
   * @throws ApiError
   */
  public postStartTask(
    idProject: string,
    files: File[],
    energy: string,
    quality: string
  ): Observable<{
    name?: string;
    unit?: string;
    data?: number;
  }> {
    const formData = new FormData();

    for (const file of files) {
      formData.append(file.name, file, file.name);
    }

    formData.append('energy', energy);
    formData.append('quality', quality);

    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: `/upload/${idProject}`,
      body: formData,
      errors: {
        400: `Invalid request`,
      },
    });
  }

  public getResults() {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: `/results`,
      errors: {
        400: `Invalid request`,
      },
    });
  }

  public getResultData(id: string) {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: `/results/${id}`,
      errors: {
        400: `Invalid request`,
      },
    });
  }
}
