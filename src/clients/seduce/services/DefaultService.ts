/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable()
export class DefaultService {

    constructor(public readonly http: HttpClient) { }

    /**
     * Get live consumption of all nodes in watt specified by query parameter
     * @param nodes Array of node ids
     * @returns any successful operation
     * @throws ApiError
     */
    public getLiveConsumptionOfAllNodes(
        nodes?: Array<string>,
    ): Observable<{
        name?: string;
        unit?: string;
        data?: number;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/v1/live-consumption',
            query: {
                'nodes': nodes,
            },
            errors: {
                404: `Invalid ID supplied`,
            },
        });
    }

    /**
     * Get production of solar panels
     * @returns any successful operation
     * @throws ApiError
     */
    public getLiveProductionSolarPanels(): Observable<{
        name?: string;
        unit?: string;
        data?: number;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/v1/live-production-solar-panels',
        });
    }

    /**
     * Get production of solar panels
     * @param from Number of hours, from now to get measures
     * @returns any successful operation
     * @throws ApiError
     */
    public getProductionSolarPanels(
        from: number = 2,
    ): Observable<{
        name?: string;
        unit?: string;
        /**
         * array of tuples, first is timestamp and secone is value in watt
         */
        data?: Array<Array<number>>;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/v1/production-solar-panels',
            query: {
                'from': from,
            },
        });
    }

}
