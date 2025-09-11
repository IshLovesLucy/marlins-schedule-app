import { useGetGameFeedQuery } from '../store/api/mlbApi';
import type { Game } from '../types/mlb';

interface UseGameDetailsProps {
    game: Game;
    teamId: number;
}

interface UseGameDetailsReturn {
    isLoading: boolean;
    error?: unknown;
    formattedVenue: string;
    bothPitchersInfo: string | null;
    liveGameInfo: string | null;
    gameDecisions: string | null;
    currentBatter: string | null;
    currentPitcher: string | null;
    scores: { home: number | null; away: number | null };
}
interface GameFeedData {
    gameData?: {
        venue?: {
            name: string;
            location: {
                city?: string;
                stateAbbrev?: string;
                country?: string;
            };
        };
        probablePitchers?: {
            home?: { fullName?: string };
            away?: { fullName?: string };
        };
    };
    liveData?: {
        linescore?: {
            inningState?: string;
            currentInningOrdinal?: string;
            outs?: number;
        };
        decisions?: {
            winner?: { fullName?: string };
            loser?: { fullName?: string };
            save?: { fullName?: string };
        };
        plays?: {
            currentPlay?: {
                matchup?: {
                    batter?: { fullName?: string };
                    pitcher?: { fullName?: string };
                };
            };
        };
    };
}

const getLastName = (fullName?: string) => fullName?.split(' ').pop() || null;

const formatVenue = (gameFeedData: GameFeedData, fallbackVenue?: { name?: string }) => {
    const venue = gameFeedData?.gameData?.venue;
    if (!venue) return fallbackVenue?.name || 'TBD';

    const { name, location } = venue;

    if (
        location.country === 'Dominican Republic' ||
        (!location.city && !location.stateAbbrev && location.country)
    ) {
        return `${name}, DR`;
    }

    if (location.city && location.stateAbbrev) {
        return `${name}, ${location.city}, ${location.stateAbbrev}`;
    }

    return name;
};

const formatPitchers = (gameFeedData: GameFeedData, status: string) => {
    if (status !== 'S') return null;
    const { away, home } = gameFeedData?.gameData?.probablePitchers || {};
    const awayName = getLastName(away?.fullName);
    const homeName = getLastName(home?.fullName);

    if (awayName && homeName) return `SP: ${awayName} vs SP: ${homeName}`;
    if (awayName) return `SP: ${awayName} vs TBD`;
    if (homeName) return `TBD vs SP: ${homeName}`;
    return null;
};

const formatLiveInfo = (gameFeedData: GameFeedData, status: string) => {
    if (status !== 'I') return null;
    const { inningState, currentInningOrdinal, outs } = gameFeedData?.liveData?.linescore || {};
    if (inningState && currentInningOrdinal && outs !== undefined) {
        return `${inningState} ${currentInningOrdinal}, ${outs} out${outs !== 1 ? 's' : ''}`;
    }
    return null;
};

const formatDecisions = (gameFeedData: GameFeedData, status: string) => {
    if (status !== 'F') return null;
    const { winner, loser, save } = gameFeedData?.liveData?.decisions || {};
    const parts: string[] = [];

    const winnerName = getLastName(winner?.fullName);
    if (winnerName) parts.push(`WP: ${winnerName}`);

    const loserName = getLastName(loser?.fullName);
    if (loserName) parts.push(`LP: ${loserName}`);

    const saveName = getLastName(save?.fullName);
    if (saveName) parts.push(`SV: ${saveName}`);

    return parts.length ? parts.join(', ') : null;
};

const formatCurrentBatter = (gameFeedData: GameFeedData, status: string) => {
    if (status !== 'I') return null;
    const batter = gameFeedData?.liveData?.plays?.currentPlay?.matchup?.batter?.fullName;
    return getLastName(batter);
};

const formatCurrentPitcher = (gameFeedData: GameFeedData, status: string) => {
    if (status !== 'I') return null;
    const pitcher = gameFeedData?.liveData?.plays?.currentPlay?.matchup?.pitcher?.fullName;
    return getLastName(pitcher);
};

const formatScores = (gameFeedData: GameFeedData, fallbackGame?: Game) => {
    const homeRuns = gameFeedData?.liveData?.linescore?.teams?.home?.runs;
    const awayRuns = gameFeedData?.liveData?.linescore?.teams?.away?.runs;

    return {
        home:
            typeof homeRuns === 'number'
                ? homeRuns
                : fallbackGame?.teams?.home?.score ?? null,
        away:
            typeof awayRuns === 'number'
                ? awayRuns
                : fallbackGame?.teams?.away?.score ?? null,
    };
};


export const useGameDetails = ({ game, teamId }: UseGameDetailsProps): UseGameDetailsReturn => {
    const shouldFetch = Boolean(game.gamePk);
    const { data: gameFeedData, isLoading, error } = useGetGameFeedQuery(
        { gamePk: game.gamePk, teamId },
        { skip: !shouldFetch, pollingInterval: 15000 }
    );

    const status = game.status?.statusCode;

    return {
        isLoading,
        error,
        formattedVenue: formatVenue(gameFeedData as GameFeedData, game.venue),
        bothPitchersInfo: formatPitchers(gameFeedData as GameFeedData, status),
        liveGameInfo: formatLiveInfo(gameFeedData as GameFeedData, status),
        gameDecisions: formatDecisions(gameFeedData as GameFeedData, status),
        currentBatter: formatCurrentBatter(gameFeedData as GameFeedData, status),
        currentPitcher: formatCurrentPitcher(gameFeedData as GameFeedData, status),
        scores: formatScores(gameFeedData as GameFeedData, game),
    };
};
