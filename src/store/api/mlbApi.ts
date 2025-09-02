import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MLBScheduleResponse } from '../../types/mlb';
import { API_CONFIG, TEAM_IDS, SPORT_IDS } from '../../constants/';

export const mlbApi = createApi({
    reducerPath: 'mlbApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_CONFIG.BASE_URL,
    }),
    endpoints: (builder) => ({
        getScheduleByDate: builder.query<MLBScheduleResponse, string | undefined>({
            query: (date) => {
                const params = new URLSearchParams();

                TEAM_IDS.forEach(id => params.append('teamId', id.toString()));
                SPORT_IDS.forEach(id => params.append('sportId', id.toString()));

                if (date) {
                    params.append('date', date);
                }

                return `schedule?${params.toString()}`;
            },
            keepUnusedDataFor: API_CONFIG.CACHE_TIME,
        }),
    }),
});

export const { useGetScheduleByDateQuery } = mlbApi;