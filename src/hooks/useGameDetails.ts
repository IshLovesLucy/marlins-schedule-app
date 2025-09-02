import { useMemo } from 'react';
import { useGetGameFeedQuery } from '../store/api/mlbApi';
import type { Game } from '../types/mlb';

interface UseGameDetailsProps {
    game: Game;
}

interface UseGameDetailsReturn {
    isLoading: boolean;
    error: Error;
    formattedVenue: string;
    bothPitchersInfo: string | null;
    liveGameInfo: string | null;
    gameDecisions: string | null;
}

export const useGameDetails = ({ game }: UseGameDetailsProps): UseGameDetailsReturn => {
    // Only fetch game feed if we have a valid gamePk
    const shouldFetch = Boolean(game.gamePk);

    const {
        data: gameFeedData,
        isLoading,
        error
    } = useGetGameFeedQuery(game.gamePk, {
        skip: !shouldFetch,
    });

    // Format venue string
    const formattedVenue = useMemo(() => {
        if (!gameFeedData?.gameData?.venue) {
            return game.venue?.name || 'TBD';
        }

        const venue = gameFeedData.gameData.venue;
        const { name, location } = venue;

        // Handle Dominican Republic venues
        if (location.country === 'Dominican Republic' || (!location.city && !location.stateAbbrev && location.country)) {
            return `${name}, DR`;
        }

        // Handle US venues
        if (location.city && location.stateAbbrev) {
            return `${name}, ${location.city}, ${location.stateAbbrev}`;
        }

        // Fallback to just venue name
        return name;
    }, [gameFeedData, game.venue]);

    // NEW: Format both pitchers for preview games
    const bothPitchersInfo = useMemo(() => {
        if (!gameFeedData?.gameData?.probablePitchers || game.status.statusCode !== 'S') {
            return null;
        }

        const { away, home } = gameFeedData.gameData.probablePitchers;
        const awayLastName = away?.fullName?.split(' ').pop();
        const homeLastName = home?.fullName?.split(' ').pop();

        if (awayLastName && homeLastName) {
            return `SP: ${awayLastName} vs SP: ${homeLastName}`;
        } else if (awayLastName) {
            return `SP: ${awayLastName} vs TBD`;
        } else if (homeLastName) {
            return `TBD vs SP: ${homeLastName}`;
        }

        return null;
    }, [gameFeedData, game]);

    // Format live game information
    const liveGameInfo = useMemo(() => {
        if (!gameFeedData?.liveData?.linescore || game.status.statusCode !== 'I') {
            return null;
        }

        const { inningState, currentInningOrdinal, outs } = gameFeedData.liveData.linescore;

        if (inningState && currentInningOrdinal && outs !== undefined) {
            return `${inningState} ${currentInningOrdinal}, ${outs} out${outs !== 1 ? 's' : ''}`;
        }

        return null;
    }, [gameFeedData, game]);

    // Format game decisions for final games
    const gameDecisions = useMemo(() => {
        if (!gameFeedData?.liveData?.decisions || game.status.statusCode !== 'F') {
            return null;
        }

        const { winner, loser, save } = gameFeedData.liveData.decisions;
        const decisions: string[] = [];

        if (winner?.fullName) {
            const lastName = winner.fullName.split(' ').pop();
            decisions.push(`WP: ${lastName}`);
        }
        if (loser?.fullName) {
            const lastName = loser.fullName.split(' ').pop();
            decisions.push(`LP: ${lastName}`);
        }
        if (save?.fullName) {
            const lastName = save.fullName.split(' ').pop();
            decisions.push(`SV: ${lastName}`);
        }

        return decisions.length > 0 ? decisions.join(', ') : null;
    }, [gameFeedData, game]);

    return {
        isLoading,
        error,
        formattedVenue,
        bothPitchersInfo, // NEW: Both pitchers instead of just one
        liveGameInfo,
        gameDecisions,
    };
};