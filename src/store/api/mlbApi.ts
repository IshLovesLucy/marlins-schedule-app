import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TeamResponse, MLBScheduleResponse, GameFeedResponse } from '../../types/mlb';
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
            keepUnusedDataFor: API_CONFIG.CACHE_SCHEDULE_INFO_TIME,
        }),
        getTeamById: builder.query<TeamResponse, number>({
            query: (teamId) => `teams/${teamId}`,
            keepUnusedDataFor: API_CONFIG.CACHE_TEAM_INFO_TIME,
        }),
        getGameFeed: builder.query<GameFeedResponse, { gamePk: number; teamId: number }>({
            query: (gamePk) => ({
                url: `${API_CONFIG.GAME_FEED_URL}game/${gamePk}/feed/live`,
                method: 'GET'
            }),
            keepUnusedDataFor: API_CONFIG.CACHE_GAME_FEED_TIME,
        }),
    }),
});

export const {
    useGetScheduleByDateQuery,
    useGetTeamByIdQuery,
    useGetGameFeedQuery,
} = mlbApi;