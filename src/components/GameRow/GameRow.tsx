import { useState, useMemo } from 'react';
import { Box, Chip, CircularProgress, Popover, Typography } from '@mui/material';
import { useTeamInfo } from '../../hooks/useTeamInfo';
import { useGameDetails } from '../../hooks/useGameDetails';
import type { Game } from '../../types/mlb';

interface GameRowProps {
    teamId: number;
    game?: Game;
    gameState: 'noGame' | 'preview' | 'live' | 'final';
}

const formatGameTime = (gameDate: string) =>
    new Date(gameDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
    });

const splitPitchers = (info: string | null) =>
    info ? info.replace(/SP:\s*/g, '').split(' vs ') : [];

const filterDecisions = (
    decisions: string | null,
    marlinsWinning: boolean,
    side: 'marlins' | 'opponent'
) => {
    if (!decisions) return null;
    const parts = decisions.split(', ');
    return (
        parts
            .filter((d) =>
                side === 'marlins'
                    ? marlinsWinning
                        ? d.startsWith('WP:') || d.startsWith('SV:')
                        : d.startsWith('LP:')
                    : marlinsWinning
                        ? d.startsWith('LP:')
                        : d.startsWith('WP:') || d.startsWith('SV:')
            )
            .join(', ') || null
    );
};

export default function GameRow({ teamId, game, gameState }: GameRowProps) {
    const { teamName, level, isLoading: teamInfoLoading } = useTeamInfo(teamId);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const opponentTeamId = game
        ? game.teams.home.team.id === teamId
            ? game.teams.away.team.id
            : game.teams.home.team.id
        : null;

    const {
        teamName: opponentName,
        parentOrgAbbreviation: opponentParentAbbrev,
        isLoading: opponentInfoLoading,
    } = useTeamInfo(opponentTeamId || 0, { skip: !opponentTeamId });

    const {
        formattedVenue,
        bothPitchersInfo,
        liveGameInfo,
        gameDecisions,
        currentBatter,
        currentPitcher,
        isLoading: gameDetailsLoading,
        scores,
    } = useGameDetails({ game: game || ({} as Game), teamId });

    const isHome = game?.teams.home.team.id === teamId;

    const marlinsWinning =
        (isHome ? scores.home ?? 0 : scores.away ?? 0) >
        (isHome ? scores.away ?? 0 : scores.home ?? 0);

    const isMarlinsAtBat = useMemo(() => {
        if (gameState !== 'live' || !liveGameInfo) return false;
        const lower = liveGameInfo.toLowerCase();
        return (isHome && lower.includes('bottom')) || (!isHome && lower.includes('top'));
    }, [gameState, liveGameInfo, isHome]);

    const pitchers = useMemo(() => splitPitchers(bothPitchersInfo), [bothPitchersInfo]);
    const marlinsPitcher = isHome ? pitchers[1] : pitchers[0];
    const opponentPitcher = isHome ? pitchers[0] : pitchers[1];

    const marlinsDecisions = useMemo(
        () => filterDecisions(gameDecisions, marlinsWinning, 'marlins'),
        [gameDecisions, marlinsWinning]
    );
    const opponentDecisions = useMemo(
        () => filterDecisions(gameDecisions, marlinsWinning, 'opponent'),
        [gameDecisions, marlinsWinning]
    );

    const opponentDisplay = useMemo(() => {
        const display = opponentName || game?.teams.away.team.name || '';
        return opponentParentAbbrev ? `${display} (${opponentParentAbbrev})` : display;
    }, [opponentName, opponentParentAbbrev, game]);

    const loading = teamInfoLoading || (!game && gameState !== 'noGame') || opponentInfoLoading;
    const noGame = gameState === 'noGame';

    return (
        <Box className={`game-row ${noGame ? 'game-row--no-game' : ''}`}>
            {/* Loading */}
            {loading && (
                <div className="game-row__team-name">
                    <span className="game-row__loading">
                        <CircularProgress size={12} /> Loading...
                    </span>
                </div>
            )}

            {/* No game */}
            {!loading && noGame && (
                <>
                    <div className="game-row__team-name">{teamName}</div>
                    <div className="game-row__no-game">NO GAME</div>
                </>
            )}

            {/* Game content */}
            {!loading && !noGame && (
                <>
                    {/* Cell 1: Team Name + Level + Score */}
                    <div className="game-row__team-name">
                        {level && (
                            <>
                                <span onClick={(e) => setAnchorEl(e.currentTarget)} className="game-row__level-icon">
                                    <img src="src/assets/imgs/level.png" width="28" alt="" />
                                </span>
                                {teamName}
                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                >
                                    <Typography sx={{ fontSize: 12, color: 'var(--text-primary)', padding: '2px' }}>
                                        Level: {level}
                                    </Typography>
                                </Popover>
                            </>
                        )}
                        {(gameState === 'live' || gameState === 'final') && (
                            <span
                                className={`game-row__score ${marlinsWinning ? 'game-row__score--winning' : 'game-row__score--losing'
                                    }`}
                            >
                                {isHome ? scores.home ?? 0 : scores.away ?? 0}
                            </span>
                        )}
                    </div>

                    {/* Cell 2: Opponent + Score */}
                    <div className="game-row__opponent">
                        {isHome ? 'vs' : '@'} {opponentDisplay}
                        {(gameState === 'live' || gameState === 'final') && (
                            <span
                                className={`game-row__score ${!marlinsWinning ? 'game-row__score--winning' : 'game-row__score--losing'
                                    }`}
                            >
                                {isHome ? scores.away ?? 0 : scores.home ?? 0}
                            </span>
                        )}
                    </div>

                    {/* Cell 3: Time/Inning/Status */}
                    <div className="game-row__time-status">
                        {gameState === 'preview' && (
                            <span className="game-row__game-time">{formatGameTime(game!.gameDate)}</span>
                        )}
                        {gameState === 'live' && liveGameInfo && (
                            <span className="game-row__live-info">{liveGameInfo}</span>
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
                        {gameState === 'preview' && marlinsPitcher && (
                            <span className="game-row__pitcher-info">SP: {marlinsPitcher}</span>
                        )}
                        {gameState === 'live' && isMarlinsAtBat && currentBatter && (
                            <span className="game-row__at-bat">At Bat: {currentBatter}</span>
                        )}
                        {gameState === 'live' && !isMarlinsAtBat && currentPitcher && (
                            <span className="game-row__pitcher-info">Pitching: {currentPitcher}</span>
                        )}
                        {gameState === 'final' && marlinsDecisions && (
                            <span className="game-row__pitcher-decisions">{marlinsDecisions}</span>
                        )}
                    </div>

                    {/* Cell 5: Bottom Center */}
                    <div className="game-row__bottom-center">
                        {gameState === 'preview' && opponentPitcher && (
                            <span className="game-row__pitcher-info">SP: {opponentPitcher}</span>
                        )}
                        {gameState === 'live' && !isMarlinsAtBat && currentBatter && (
                            <span className="game-row__at-bat">AT BAT: {currentBatter}</span>
                        )}
                        {gameState === 'live' && isMarlinsAtBat && currentPitcher && (
                            <span className="game-row__pitcher-info">P: {currentPitcher}</span>
                        )}
                        {gameState === 'final' && opponentDecisions && (
                            <span className="game-row__pitcher-decisions">{opponentDecisions}</span>
                        )}
                    </div>

                    {/* Cell 6: Venue */}
                    <div className="game-row__venue">
                        {gameDetailsLoading ? <CircularProgress size={10} /> : formattedVenue}
                    </div>
                </>
            )}
        </Box>
    );
}
