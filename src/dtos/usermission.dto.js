export const bodyToUserMission = (missionId) => {
    return {
        user_id: 10, // 하드코딩된 user_id
        mission_id: missionId,
        status: 'doing' // 기본 상태를 'none'으로 설정
    };
};

export const responseFromUserMission = ({ missionId, status }) => {
    return {
        mission_id: missionId,
        status: status
    };
};
