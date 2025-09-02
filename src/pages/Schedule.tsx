import { useState } from 'react';
import { Container, Paper, Alert, Box, CircularProgress, Typography, Switch, FormControlLabel } from '@mui/material';
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
    const [useTestData, setUseTestData] = useState(false); // NEW: Toggle for test data

    const formatDateForAPI = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const apiDate = formatDateForAPI(selectedDate);
    const { data, error, isLoading } = useGetScheduleByDateQuery(apiDate);

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    // NEW: Mock test data for live game testing - using REAL gamePk values
    const getTestScheduleData = (): ProcessedGame[] => {
        // Using the real 6:45 PM game's gamePk
        const realGamePk = 785620; // Real Marlins game PK

        const mockLiveGame: Game = {
            gamePk: realGamePk, // Using REAL gamePk to trigger API call
            gameDate: new Date().toISOString(),
            status: {
                abstractGameState: 'Live', // Force it to show as live for testing
                statusCode: 'I',
                detailedState: 'In Progress'
            },
            teams: {
                away: {
                    score: 4,
                    team: {
                        id: 120,
                        name: 'Washington Nationals'
                    }
                },
                home: {
                    score: 2,
                    team: {
                        id: 146,
                        name: 'Miami Marlins'
                    }
                }
            },
            venue: {
                name: 'loanDepot park'
            }
        } as Game;

        const mockFinalGame: Game = {
            ...mockLiveGame,
            gamePk: 785620, // Use same real gamePk 
            status: {
                abstractGameState: 'Final',
                statusCode: 'F',
                detailedState: 'Game Over'
            },
            teams: {
                away: {
                    score: 2,
                    team: {
                        id: 120,
                        name: 'Washington Nationals'
                    }
                },
                home: {
                    score: 7,
                    team: {
                        id: 146,
                        name: 'Miami Marlins'
                    }
                }
            },
            venue: {
                name: 'loanDepot park'
            }
        } as Game;

        const mockPreviewGame: Game = {
            ...mockLiveGame,
            gamePk: 785620, // Use same real gamePk
            gameDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            status: {
                abstractGameState: 'Preview',
                statusCode: 'S',
                detailedState: 'Scheduled'
            },
            teams: {
                away: {
                    team: {
                        id: 120,
                        name: 'Washington Nationals'
                    }
                },
                home: {
                    team: {
                        id: 146,
                        name: 'Miami Marlins'
                    }
                }
            },
            venue: {
                name: 'loanDepot park'
            }
        } as Game;

        return [
            {
                teamId: 146,
                teamName: 'Miami Marlins',
                level: 'MLB',
                gameState: 'live',
                game: mockLiveGame
            },
            {
                teamId: 467,
                teamName: 'Florida Fire Frogs',
                level: 'Single-A',
                gameState: 'final',
                game: mockFinalGame
            },
            {
                teamId: 564,
                teamName: 'Jacksonville Jumbo Shrimp',
                level: 'Triple-A',
                gameState: 'preview',
                game: mockPreviewGame
            },
            {
                teamId: 385,
                teamName: 'Memphis Redbirds',
                level: 'Triple-A',
                gameState: 'noGame'
            }
        ];
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

    // NEW: Choose between real and test data
    const scheduleData = useTestData ? getTestScheduleData() : processScheduleData();

    return (
        <Container maxWidth="md">
            <DateNavigation
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />

            <svg class="basepathsstyle__StyledBaseSVG-sc-1xzx55b-0 cLwvKO" width="22" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 17.25" aria-label="base"><title>Bases.</title><rect class="basepathsstyle__BaseRect-sc-1xzx55b-1 gKeJOB" fill="transparent" stroke-width="1" stroke="var(--gameday-basepath-color)" width="6" height="6" transform="translate(5.25, 7.25) rotate(-315)" rx="0px" ry="0px"></rect><rect class="basepathsstyle__BaseRect-sc-1xzx55b-1 gKeJOB" fill="transparent" stroke-width="1" stroke="var(--gameday-basepath-color)" width="6" height="6" transform="translate(12, 0.75) rotate(-315)" rx="0px" ry="0px"></rect><rect class="basepathsstyle__BaseRect-sc-1xzx55b-1 gKeJOB onBase" fill="var(--gameday-basepath-color)" stroke-width="1" stroke="var(--gameday-basepath-color)" width="6" height="6" transform="translate(18.75, 7.25) rotate(-315)" rx="0px" ry="0px"></rect></svg>

            {/* NEW: Test Mode Toggle */}
            <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={useTestData}
                            onChange={(e) => setUseTestData(e.target.checked)}
                            color="primary"
                        />
                    }
                    label={
                        <span>
                            🧪 <strong>Test Mode:</strong> {useTestData ? 'Using mock live/final/preview games' : 'Using real API data'}
                        </span>
                    }
                />
            </Box>

            {isLoading && !useTestData ? (
                <Box>
                    <CircularProgress />
                    <Typography>Loading schedule...</Typography>
                </Box>
            ) : (
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