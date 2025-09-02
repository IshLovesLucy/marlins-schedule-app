import { useGetTeamByIdQuery } from '../store/api/mlbApi';

export function useTeamInfo(teamId: number, options?: { skip?: boolean }) {
    const { data, isLoading, error } = useGetTeamByIdQuery(teamId, {
        skip: options?.skip || teamId <= 0
    });

    const teamInfo = data?.teams?.[0];
    const parentOrgId = teamInfo?.parentOrgId;

    const {
        data: parentOrgData,
        isLoading: parentOrgLoading
    } = useGetTeamByIdQuery(parentOrgId || 0, {
        skip: !parentOrgId || options?.skip
    });

    const parentOrgInfo = parentOrgData?.teams?.[0];

    return {
        teamName: teamInfo?.name || `Team ${teamId}`,
        level: teamInfo?.sport?.name || 'Unknown',
        parentOrgName: teamInfo?.parentOrgName,
        parentOrgAbbreviation: parentOrgInfo?.abbreviation,
        isLoading: isLoading || (parentOrgId ? parentOrgLoading : false),
        error
    };
}