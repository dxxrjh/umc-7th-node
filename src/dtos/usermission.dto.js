export const bodyToUserMission = (missionId, userId) => {
    console.log("bodyToUserMission params:", missionId, userId);  // 인자 확인

    return {
        user_id: userId,
        mission_id: missionId,
        status: 'doing'
    };
};

export const responseFromUserMission = ({ missionId, status }) => {
    return {
        mission_id: missionId,
        status: status
    };
};
