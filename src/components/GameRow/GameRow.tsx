import { Box, Typography, Chip } from '@mui/material';
import { useTeamInfo } from '../../hooks/useTeamInfo';
import type { Game } from '../../types/mlb';

interface GameRowProps {
    teamId: number;
    game?: Game;
    gameState: 'noGame' | 'preview' | 'live' | 'final';
}

export default function GameRow({ teamId, game, gameState }: GameRowProps) {
    const { teamName, isLoading: teamInfoLoading } = useTeamInfo(teamId);

    // Get opponent team info for parent org
    const opponentTeamId = game ? (
        game.teams.home.team.id === teamId
            ? game.teams.away.team.id
            : game.teams.home.team.id
    ) : null;

    const {
        teamName: opponentName,
        parentOrgName: opponentParentOrg,
        abbreviation: opponentAbbrev,
        isLoading: opponentInfoLoading
    } = useTeamInfo(opponentTeamId || 0);

    if (teamInfoLoading) {
        return <Box><Typography>Loading...</Typography></Box>;
    }

    if (gameState === 'noGame') {
        return (
            <Box>
                <Typography variant="h6">{teamName}</Typography>
                <Typography>NO GAME</Typography>
            </Box>
        );
    }

    if (!game || opponentInfoLoading) return <Typography>Loading game info...</Typography>;

    const isHome = game.teams.home.team.id === teamId;
    const myTeam = isHome ? game.teams.home : game.teams.away;
    const opponentTeam = isHome ? game.teams.away : game.teams.home;

    const formatOpponent = () => {
        let display = opponentName;

        if (opponentParentOrg && opponentParentOrg !== opponentName) {

            display += ` (${opponentAbbrev})`;
        }

        return display;
    };

    const renderGameContent = () => {
        switch (gameState) {
            case 'preview': {
                const gameTime = new Date(game.gameDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                return (
                    <Box>
                        <Typography variant="h6">{teamName}</Typography>
                        <Typography>
                            {isHome ? 'vs.' : '@'} {formatOpponent()}
                        </Typography>
                        <Typography variant="h6">{gameTime}</Typography>
                    </Box>
                );
            }

            case 'live':
                return (
                    <Box>
                        <Typography variant="h6">
                            {teamName} {myTeam.score || 0}
                        </Typography>
                        <Typography>
                            {isHome ? 'vs.' : '@'} {formatOpponent()} {opponentTeam.score || 0}
                        </Typography>
                        <Chip label="LIVE" size="small" />
                    </Box>
                );

            case 'final':
                return (
                    <Box>
                        <Typography variant="h6">
                            {teamName} {myTeam.score || 0}
                        </Typography>
                        <Typography>
                            {isHome ? 'vs.' : '@'} {formatOpponent()} {opponentTeam.score || 0}
                        </Typography>
                        <Chip label="FINAL" size="small" />
                    </Box>
                );
        }
    };

    return <Box>{renderGameContent()}</Box>;
}