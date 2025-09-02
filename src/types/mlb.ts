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