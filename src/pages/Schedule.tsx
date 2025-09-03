import { useState } from 'react';
import { Container, Paper, Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useGetScheduleByDateQuery } from '../store/api/mlbApi';
import { TEAM_ABBREV_IDS_MAP } from '../constants';
import DateNavigation from '../components/DateNavigation/DateNavigation';
import GameRow from '../components/GameRow/GameRow';
import type { Game } from '../types/mlb';

interface ProcessedGame {
    teamId: number;
    teamName: string;
    level: string;
    gameState: 'noGame' | 'preview' | 'live' | 'final';
    game?: Game;
}

const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const apiDate = formatDateForAPI(selectedDate);
    const { data, error, isLoading, refetch } = useGetScheduleByDateQuery(apiDate);

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    const handleRefresh = () => {
        refetch();
        setLastUpdated(new Date());
    };

    const processScheduleData = (): ProcessedGame[] => {
        const games = data?.dates?.[0]?.games || [];
        const affiliateTeamIds = Object.values(TEAM_ABBREV_IDS_MAP);
        const result: ProcessedGame[] = [];

        affiliateTeamIds.forEach(teamId => {
            const teamGames = games.filter(g =>
                g.teams.home.team.id === teamId ||
                g.teams.away.team.id === teamId
            );

            if (teamGames.length === 0) {
                result.push({
                    teamId,
                    teamName: `Team ${teamId}`,
                    level: 'Unknown',
                    gameState: 'noGame',
                    game: undefined
                });
            } else {
                teamGames.forEach(game => {
                    const isHome = game.teams.home.team.id === teamId;
                    const myTeam = isHome ? game.teams.home : game.teams.away;

                    let gameState: 'preview' | 'live' | 'final' = 'preview';
                    switch (game.status.abstractGameState) {
                        case 'Preview': gameState = 'preview'; break;
                        case 'Live': gameState = 'live'; break;
                        case 'Final': gameState = 'final'; break;
                    }

                    result.push({
                        teamId,
                        teamName: myTeam.team.name,
                        level: 'Unknown',
                        gameState,
                        game
                    });
                });
            }
        });

        return result;
    };

    const scheduleData = processScheduleData();

    return (
        <Container maxWidth="md">
            <DateNavigation
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onRefresh={handleRefresh}
                lastUpdated={lastUpdated}
            />

            {error && (
                <Alert severity="error">
                    Dooh, Swing and MISS! Please try again.
                </Alert>
            )}

            {isLoading && (
                <Box>
                    <CircularProgress />
                    <Typography>Loading schedule...</Typography>
                </Box>
            )}

            {!error && !isLoading && (
                <Paper>
                    {scheduleData.map((gameData, index) => (
                        <GameRow
                            key={`${gameData.teamId}-${gameData.game?.gamePk || 'noGame'}-${index}`}
                            teamId={gameData.teamId}
                            game={gameData.game}
                            gameState={gameData.gameState}
                        />
                    ))}
                </Paper>
            )}
        </Container>
    );
}