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

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Format date for API (YYYY-MM-DD)
    const formatDateForAPI = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    // Don't pass date parameter if it's today (API default)
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const apiDate = isToday ? undefined : formatDateForAPI(selectedDate);

    const { data, error, isLoading } = useGetScheduleByDateQuery(apiDate);

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    // Process API data into component format
    const processScheduleData = (): ProcessedGame[] => {
        const games = data?.dates?.[0]?.games || [];
        const affiliateTeamIds = Object.values(TEAM_ABBREV_IDS_MAP);

        return affiliateTeamIds.map(teamId => {
            // Find if this affiliate has a game
            const game = games.find(g =>
                g.teams.home.team.id === teamId ||
                g.teams.away.team.id === teamId
            );

            if (game) {
                const isHome = game.teams.home.team.id === teamId;
                const myTeam = isHome ? game.teams.home : game.teams.away;

                // Get game state
                let gameState: 'preview' | 'live' | 'final' = 'preview';
                switch (game.status.abstractGameState) {
                    case 'Preview':
                        gameState = 'preview';
                        break;
                    case 'Live':
                        gameState = 'live';
                        break;
                    case 'Final':
                        gameState = 'final';
                        break;
                }

                return {
                    teamId,
                    teamName: myTeam.team.name,
                    level: myTeam.team.sport?.name || 'Unknown',
                    gameState,
                    game
                };
            } else {
                // No game for this affiliate
                return {
                    teamId,
                    teamName: `Team ${teamId}`,
                    level: 'Unknown',
                    gameState: 'noGame' as const
                };
            }
        });
    };

    if (error) {
        return (
            <Container maxWidth="md">
                <DateNavigation
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                />
                <Alert severity="error">
                    Failed to load schedule data. Please try again.
                </Alert>
            </Container>
        );
    }

    const scheduleData = processScheduleData();

    return (
        <Container maxWidth="md">
            <DateNavigation
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />

            {isLoading ? (
                <Box>
                    <CircularProgress />
                    <Typography>Loading schedule...</Typography>
                </Box>
            ) : (
                <Paper>
                    {scheduleData.map((gameData) => (
                        <GameRow
                            key={gameData.teamId}
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