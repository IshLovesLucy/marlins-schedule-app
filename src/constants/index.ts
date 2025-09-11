export const TEAM_ABBREV_IDS_MAP = {
    MARLINS: 146,
    MMP: 385,
    F_MRL: 467,
    JAX: 564,
    BEL: 554,
    D_MRL: 619,
    MIA_3276: 3276,
    PNS: 4124,
    MIA_3277: 3277,
    JUP: 479,
    D_MIA: 2127,
} as const;

export const SPORT_IDS_MAP = {
    MLB: 1,
    AAA: 11,
    AA: 12,
    HIGH_A: 13,
    A: 14,
    ROOKIE: 16,
    SPRING_TRAINING: 21,
} as const;

export const API_CONFIG = {
    BASE_URL: 'https://statsapi.mlb.com/api/v1/',
    GAME_FEED_URL: 'https://statsapi.mlb.com/api/v1.1/',
    CACHE_SCHEDULE_INFO_TIME: 300,   // 5 minutes
    CACHE_TEAM_INFO_TIME: 3600,      // 1 hour
    CACHE_GAME_FEED_TIME: 15,        // 15 seconds
    POLLING_GAME_FEED_INTERVAL: 15000, // 15 seconds (ms)
} as const;


export const TEAM_IDS = Object.values(TEAM_ABBREV_IDS_MAP);
export const SPORT_IDS = Object.values(SPORT_IDS_MAP);