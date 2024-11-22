import { responseFromUserMission } from "../dtos/usermission.dto.js";
import { bodyToUserMission } from "../dtos/usermission.dto.js";
import { addUserMission, updateUserMission, findUserMissionById } from "../repositories/usermission.repository.js";

export const startMission = async (missionId) => {
    

    // USER_MISSION에 미션 추가
    const userMissionData = bodyToUserMission(missionId);
    const userMissionId = await addUserMission(userMissionData);

    // 응답 반환
    return responseFromUserMission({ missionId, status: userMissionData.status });
};

export const completeMission = async (missionId) => {
    const userMissionData = bodyToUserMission(missionId);
    const userMissionId = await updateUserMission(userMissionData);

    // 응답 반환
    return responseFromUserMission({ missionId, status: userMissionData.status });
}
