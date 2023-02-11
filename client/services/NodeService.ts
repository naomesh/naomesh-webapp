/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable()
export class NodeService {

    constructor(public readonly http: HttpClient) {}

    /**
     * Get live consumption of node. It sums PSU 0 and PSU 1
     * It sums PSU 0 and PSU 1
     * @param nodeId ID of the node
     * @returns any sucessful operation
     * @throws ApiError
     */
    public getLiveConsumptionOfNode(
        nodeId: string,
    ): Observable<{
        name?: string;
        unit?: string;
        data?: number;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/v1/{nodeID}/live-consumption',
            path: {
                'nodeID': nodeId,
            },
            errors: {
                404: `invalid node id, not found`,
            },
        });
    }

    /**
     * Get consumption of node
     * It is in watt
     * @param nodeId ID of the node
     * @param step number of seconde, granularity, step
     * @param from Number of hours, from now to get measures
     * @returns any successful operation
     * @throws ApiError
     */
    public getConsumptionOfNode(
        nodeId: string,
        step: number = 0.5,
        from: number = 2,
    ): Observable<{
        name?: string;
        unit?: string;
        /**
         * Total consumption in kWh
         */
        sum?: number;
        /**
         * array of tuples, first is timestamp and secone is value in watt
         */
        data?: Array<Array<number>>;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/v1/{nodeID}/consumption-diff',
            path: {
                'nodeID': nodeId,
            },
            query: {
                'step': step,
                'from': from,
            },
            errors: {
                400: `invalid node id, not found`,
            },
        });
    }

    /**
     * Get consumption of node with historical data
     * historical data
     * @param nodeId ID of the node
     * @param step number of s, granularity, step
     * @param range Array of start;end
     * @returns any successful operation
     * @throws ApiError
     */
    public getConsumptionOfNodeHistorical(
        nodeId: string,
        step: number = 0.5,
        range?: Array<string>,
    ): Observable<{
        name?: string;
        unit?: string;
        /**
         * Total consumption in kWh
         */
        sum?: number;
        data?: Array<{
            start?: number;
            end?: number;
            /**
             * array of tuples, first is timestamp and secone is value in watt
             */
            data?: Array<Array<number>>;
        }>;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/v1/{nodeID}/consumption',
            path: {
                'nodeID': nodeId,
            },
            query: {
                'step': step,
                'range': range,
            },
            errors: {
                400: `invalid node id, not found`,
            },
        });
    }

}
