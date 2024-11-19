import { responseFromUserMission } from "../dtos/usermission.dto.js";
import { AlreadyAddedMissionError } from "../errors.js";
import { bodyToUserMission } from "../dtos/usermission.dto.js";
import { addUserMission, updateUserMission, findUserMissionById } from "../repositories/usermission.repository.js";

export const startMission = async (missionId) => {

    // 미션이 이미 추가되었는지 확인
    const existingMission = await findUserMissionById(missionId);
    if (existingMission) {
        throw new AlreadyAddedMissionError("이미 추가된 미션입니다.", { missionId });
    }

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
