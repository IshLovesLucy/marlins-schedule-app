export interface MLBScheduleResponse {
    copyright: string;
    totalItems: number;
    totalEvents: number;
    totalGames: number;
    totalGamesInProgress: number;
    dates: ScheduleDate[];
}

export interface TeamResponse {
    teams: [{
        id: number;
        name: string;
        clubName: string;
        locationName: string;
        abbreviation: string;
        sport: {
            id: number;
            name: string;
        };
        parentOrgName?: string;
        parentOrgId?: number;
    }];
}

export interface GameFeedResponse {
    gameData: {
        venue: {
            name: string;
            location: {
                city?: string;
                stateAbbrev?: string;
                country?: string;
            };
        };
        probablePitchers?: {
            away?: {
                lastName: string;
            };
            home?: {
                lastName: string;
            };
        };
    };
    liveData: {
        linescore?: {
            currentInningOrdinal?: string;
            inningState?: string;
            outs?: number;
        };
        decisions?: {
            winner?: {
                fullName: string;
            };
            loser?: {
                fullName: string;
            };
            save?: {
                fullName: string;
            };
        };
    };
}

export interface GameDetails {
    gamePk: number;
    venue: {
        name: string;
        city?: string;
        state?: string;
        country?: string;
    };
    probablePitchers?: {
        away?: {
            fullName: string;
            lastName: string;
        };
        home?: {
            fullName: string;
            lastName: string;
        };
    };
    liveData?: {
        inning?: number;
        inningOrdinal?: string;
        inningState?: string;
        outs?: number;
        balls?: number;
        strikes?: number;
    };
    decisions?: {
        winner?: {
            fullName: string;
            lastName: string;
        };
        loser?: {
            fullName: string;
            lastName: string;
        };
        save?: {
            fullName: string;
            lastName: string;
        };
    };
}

export interface ScheduleDate {
    date: string;
    totalItems: number;
    totalEvents: number;
    totalGames: number;
    totalGamesInProgress: number;
    games: Game[];
    events: [];
}

export interface Game {
    gamePk: number;
    gameGuid: string;
    link: string;
    gameType: string;
    season: string;
    gameDate: string;
    officialDate: string;
    status: GameStatus;
    teams: {
        away: TeamData;
        home: TeamData;
    };
    venue: Venue;
    content: {
        link: string;
    };
    isTie: boolean;
    gameNumber: number;
    publicFacing: boolean;
    doubleHeader: string;
    gamedayType: string;
    scheduledInnings: number;
    seriesDescription: string;
    dayNight: string;
}

export interface GameStatus {
    abstractGameState: 'Preview' | 'Live' | 'Final';
    codedGameState: string;
    detailedState: string;
    statusCode: string;
    startTimeTBD: boolean;
    abstractGameCode: string;
}

export interface TeamData {
    leagueRecord: {
        wins: number;
        losses: number;
        pct: string;
    };
    score?: number;
    team: Team;
    isWinner?: boolean;
    splitSquad: boolean;
    seriesNumber: number;
}

export interface Team {
    id: number;
    name: string;
    link: string;
}

export interface Venue {
    id: number;
    name: string;
    link: string;
}

export interface AffiliateGame {
    teamId: number;
    teamName: string;
    level: string;
    gameState: 'noGame' | 'preview' | 'live' | 'final';
    opponent?: {
        name: string;
        parentOrg?: string;
    };
    gameInfo?: {
        time?: string;
        venue?: string;
        homeScore?: number;
        awayScore?: number;
        isHome?: boolean;
    };
    rawGame?: Game;
}
export interface Affiliate {
    id: number;
    name: string;
    level: string;
    parent?: string;
}