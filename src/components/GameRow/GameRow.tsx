import { Box, Chip, CircularProgress } from '@mui/material';
import { useTeamInfo } from '../../hooks/useTeamInfo';
import { useGameDetails } from '../../hooks/useGameDetails';
import type { Game } from '../../types/mlb';

interface GameRowProps {
    teamId: number;
    game?: Game;
    gameState: 'noGame' | 'preview' | 'live' | 'final';
}

export default function GameRow({ teamId, game, gameState }: GameRowProps) {
    const { teamName, isLoading: teamInfoLoading } = useTeamInfo(teamId);

    const opponentTeamId = game ? (
        game.teams.home.team.id === teamId
            ? game.teams.away.team.id
            : game.teams.home.team.id
    ) : null;

    const {
        teamName: opponentName,
        parentOrgAbbreviation: opponentParentAbbrev,
        isLoading: opponentInfoLoading
    } = useTeamInfo(opponentTeamId || 0, { skip: !opponentTeamId });

    const {
        formattedVenue,
        bothPitchersInfo,
        liveGameInfo,
        gameDecisions,
        isLoading: gameDetailsLoading
    } = useGameDetails({ game: game || {} as Game });

    const isHome = game?.teams.home.team.id === teamId;
    const myTeam = isHome ? game?.teams.home : game?.teams.away;
    const opponentTeam = isHome ? game?.teams.away : game?.teams.home;

    const formatOpponent = () => {
        let display = opponentName || opponentTeam?.team.name;
        if (opponentParentAbbrev) {
            display += ` (${opponentParentAbbrev})`;
        }
        return display;
    };

    const formatGameTime = (gameDate: string) => {
        return new Date(gameDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/New_York'
        });
    };

    // Helper functions for 2x3 grid logic
    const isMarlinsWinning = () => {
        if (!game) return false;
        const myScore = myTeam?.score ?? 0;
        const opponentScore = opponentTeam?.score ?? 0;
        return myScore > opponentScore;
    };

    const isMarlinsAtBat = () => {
        if (!game || gameState !== 'live' || !liveGameInfo) return false;

        const isTopInning = liveGameInfo.toLowerCase().includes('top');
        const isBottomInning = liveGameInfo.toLowerCase().includes('bottom');

        // Marlins batting logic: Home + Bottom OR Away + Top
        if (isHome && isBottomInning) return true;
        if (!isHome && isTopInning) return true;

        return false;
    };

    const getMarlinsStartingPitcher = () => {
        if (!bothPitchersInfo) return null;
        const pitchers = bothPitchersInfo.split(' vs ');
        return isHome ? pitchers[1]?.replace('SP: ', '') : pitchers[0]?.replace('SP: ', '');
    };

    const getOpponentStartingPitcher = () => {
        if (!bothPitchersInfo) return null;
        const pitchers = bothPitchersInfo.split(' vs ');
        return isHome ? pitchers[0]?.replace('SP: ', '') : pitchers[1]?.replace('SP: ', '');
    };

    const getMarlinsDecisions = () => {
        if (!gameDecisions) return null;
        const decisions = gameDecisions.split(', ');
        const marlinsDecisions = [];

        decisions.forEach(decision => {
            if (isMarlinsWinning()) {
                if (decision.startsWith('WP:') || decision.startsWith('SV:')) {
                    marlinsDecisions.push(decision);
                }
            } else {
                if (decision.startsWith('LP:')) {
                    marlinsDecisions.push(decision);
                }
            }
        });

        return marlinsDecisions.length > 0 ? marlinsDecisions.join(', ') : null;
    };

    const getOpponentDecisions = () => {
        if (!gameDecisions) return null;
        const decisions = gameDecisions.split(', ');
        const opponentDecisions = [];

        decisions.forEach(decision => {
            if (isMarlinsWinning()) {
                if (decision.startsWith('LP:')) {
                    opponentDecisions.push(decision);
                }
            } else {
                if (decision.startsWith('WP:') || decision.startsWith('SV:')) {
                    opponentDecisions.push(decision);
                }
            }
        });

        return opponentDecisions.length > 0 ? opponentDecisions.join(', ') : null;
    };

    if (teamInfoLoading) {
        return (
            <Box className="game-row">
                <div className="game-row__team-name">
                    <span className="game-row__loading">
                        <CircularProgress size={12} />
                        Loading...
                    </span>
                </div>
            </Box>
        );
    }

    if (gameState === 'noGame') {
        return (
            <Box className="game-row game-row--no-game">
                <div className="game-row__team-name">{teamName}</div>
                <div className="game-row__no-game">NO GAME</div>
            </Box>
        );
    }

    if (!game || opponentInfoLoading) {
        return (
            <Box className="game-row">
                <div className="game-row__team-name">
                    <span className="game-row__loading">
                        <CircularProgress size={12} />
                        Loading game info...
                    </span>
                </div>
            </Box>
        );
    }

    return (
        <Box className="game-row">
            {/* Cell 1: Team Name + Score */}
            <div className="game-row__team-name">
                {teamName}
                {(gameState === 'live' || gameState === 'final') && (
                    <span className={`game-row__score ${isMarlinsWinning() ? 'game-row__score--winning' : 'game-row__score--losing'}`}>
                        {' '}{myTeam?.score ?? 0}
                    </span>
                )}
            </div>

            {/* Cell 2: Opponent + Score */}
            <div className="game-row__opponent">
                {isHome ? 'vs' : '@'} {formatOpponent()}
                {(gameState === 'live' || gameState === 'final') && (
                    <span className={`game-row__score ${!isMarlinsWinning() ? 'game-row__score--winning' : 'game-row__score--losing'}`}>
                        {' '}{opponentTeam?.score ?? 0}
                    </span>
                )}
            </div>

            {/* Cell 3: Time/Inning/Status */}
            <div className="game-row__time-status">
                {gameState === 'preview' && (
                    <span className="game-row__game-time">
                        {formatGameTime(game.gameDate)}
                    </span>
                )}

                {gameState === 'live' && liveGameInfo && (
                    <span className="game-row__live-info">
                        {liveGameInfo}
                    </span>
                )}

                {gameState === 'final' && (
                    <Chip
                        label="FINAL"
                        size="small"
                        className="game-row__status-chip game-row__status-chip--final"
                    />
                )}
            </div>

            {/* Cell 4: Bottom Left */}
            <div className="game-row__bottom-left">
                {gameState === 'preview' && getMarlinsStartingPitcher() && (
                    <span className="game-row__pitcher-info">
                        SP: {getMarlinsStartingPitcher()}
                    </span>
                )}

                {gameState === 'live' && isMarlinsAtBat() && (
                    <span className="game-row__at-bat">AT BAT</span>
                )}

                {gameState === 'live' && !isMarlinsAtBat() && getMarlinsStartingPitcher() && (
                    <span className="game-row__pitcher-info">
                        P: {getMarlinsStartingPitcher()}
                    </span>
                )}

                {gameState === 'final' && getMarlinsDecisions() && (
                    <span className="game-row__pitcher-decisions">
                        {getMarlinsDecisions()}
                    </span>
                )}
            </div>

            {/* Cell 5: Bottom Center */}
            <div className="game-row__bottom-center">
                {gameState === 'preview' && getOpponentStartingPitcher() && (
                    <span className="game-row__pitcher-info">
                        SP: {getOpponentStartingPitcher()}
                    </span>
                )}

                {gameState === 'live' && !isMarlinsAtBat() && (
                    <span className="game-row__at-bat">AT BAT</span>
                )}

                {gameState === 'live' && isMarlinsAtBat() && getOpponentStartingPitcher() && (
                    <span className="game-row__pitcher-info">
                        P: {getOpponentStartingPitcher()}
                    </span>
                )}

                {gameState === 'final' && getOpponentDecisions() && (
                    <span className="game-row__pitcher-decisions">
                        {getOpponentDecisions()}
                    </span>
                )}
            </div>

            {/* Cell 6: Venue */}
            <div className="game-row__venue">
                {gameDetailsLoading ? (
                    <CircularProgress size={10} />
                ) : (
                    formattedVenue
                )}
            </div>
        </Box>
    );
}