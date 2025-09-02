import React from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { useTeamInfo } from '../../hooks/useTeamInfo';
import { useGameDetails } from '../../hooks/useGameDetails';
import type { Game } from '../../types/mlb';
import './GameRow.css'; // Import the wireframe-matching CSS

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

    const getScoreDisplay = () => {
        if (gameState === 'noGame' || gameState === 'preview' || !game) return null;

        const myScore = myTeam?.score ?? 0;
        const opponentScore = opponentTeam?.score ?? 0;

        return `${myScore} - ${opponentScore}`;
    };

    const getScoreClass = () => {
        if (!game) return '';

        const myScore = myTeam?.score ?? 0;
        const opponentScore = opponentTeam?.score ?? 0;

        if (gameState === 'live' || gameState === 'final') {
            if (myScore > opponentScore) return 'game-row__score--winning';
            if (myScore < opponentScore) return 'game-row__score--losing';
        }
        return '';
    };

    if (teamInfoLoading) {
        return (
            <Box className="game-row">
                <div className="game-row__team-info">
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
                <div className="game-row__team-info">
                    <Typography className="game-row__team-name">{teamName}</Typography>
                </div>
                <div className="game-row__no-game">NO GAME</div>
            </Box>
        );
    }

    if (!game || opponentInfoLoading) {
        return (
            <Box className="game-row">
                <div className="game-row__team-info">
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
            {/* Team Info */}
            <div className="game-row__team-info">
                <Typography className="game-row__team-name">{teamName}</Typography>
                <Typography className="game-row__opponent">
                    {isHome ? 'vs.' : '@'} {formatOpponent()}
                </Typography>
            </div>

            {/* Game Info */}
            <div className="game-row__game-info">
                {gameState === 'preview' && (
                    <>
                        <Typography className="game-row__primary-info">
                            {formatGameTime(game.gameDate)}
                        </Typography>
                        {gameDetailsLoading ? (
                            <span className="game-row__loading">
                                <CircularProgress size={10} />
                            </span>
                        ) : bothPitchersInfo ? (
                            <Typography className="game-row__secondary-info">
                                {bothPitchersInfo}
                            </Typography>
                        ) : (
                            <Typography className="game-row__secondary-info">
                                SP: TBD vs SP: TBD
                            </Typography>
                        )}
                    </>
                )}

                {gameState === 'live' && (
                    <>
                        {gameDetailsLoading ? (
                            <span className="game-row__loading">
                                <CircularProgress size={10} />
                            </span>
                        ) : liveGameInfo ? (
                            <Typography className="game-row__live-info">
                                {liveGameInfo}
                            </Typography>
                        ) : (
                            <Typography className="game-row__live-info">
                                In Progress
                            </Typography>
                        )}
                    </>
                )}

                {gameState === 'final' && (
                    <>
                        {gameDetailsLoading ? (
                            <span className="game-row__loading">
                                <CircularProgress size={10} />
                            </span>
                        ) : gameDecisions ? (
                            <Typography className="game-row__secondary-info">
                                {gameDecisions}
                            </Typography>
                        ) : (
                            <Typography className="game-row__secondary-info">
                                Final
                            </Typography>
                        )}
                    </>
                )}
            </div>

            {/* Score */}
            <div className={`game-row__score ${getScoreClass()}`}>
                {getScoreDisplay() && (
                    <Typography variant="h6" component="span">
                        {getScoreDisplay()}
                    </Typography>
                )}
            </div>

            {/* Status */}
            <div className="game-row__status">
                {gameState === 'preview' && (
                    <Chip
                        label="Preview"
                        size="small"
                        className="game-row__status-chip game-row__status-chip--preview"
                    />
                )}
                {gameState === 'live' && (
                    <Chip
                        label="LIVE"
                        size="small"
                        className="game-row__status-chip game-row__status-chip--live"
                    />
                )}
                {gameState === 'final' && (
                    <Chip
                        label="FINAL"
                        size="small"
                        className="game-row__status-chip game-row__status-chip--final"
                    />
                )}
            </div>

            {/* Venue */}
            <div className="game-row__venue">
                {gameDetailsLoading ? (
                    <span className="game-row__loading">
                        <CircularProgress size={10} />
                    </span>
                ) : (
                    <Typography variant="body2" component="span">
                        {formattedVenue}
                    </Typography>
                )}
            </div>
        </Box>
    );
}