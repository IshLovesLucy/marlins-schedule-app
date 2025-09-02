import { useGetTeamByIdQuery } from '../store/api/mlbApi';

export function useTeamInfo(teamId: number) {
    const { data, isLoading, error } = useGetTeamByIdQuery(teamId);

    const teamInfo = data?.teams?.[0];

    return {
        teamName: teamInfo?.clubName || `Team ${teamId}`,
        level: teamInfo?.sport?.name || 'Unknown',
        parentOrgName: teamInfo?.parentOrgName,
        abbreviation: teamInfo?.abbreviation,
        isLoading,
        error
    };
}