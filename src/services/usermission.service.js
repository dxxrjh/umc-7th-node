import { responseFromUserMission, bodyToUserMission } from "../dtos/usermission.dto.js";
import { addUserMission, updateUserMission } from "../repositories/usermission.repository.js";

export const startMission = async (req, missionId) => {
    missionId = req.body.missionId;
    const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기

    // USER_MISSION에 미션 추가
    const userMissionData = bodyToUserMission(missionId, userId);  // userId를 전달
    console.log("userMissionData:", userMissionData);
    const userMissionId = await addUserMission(req, userMissionData);

    // 응답 반환
    return responseFromUserMission({ missionId, status: userMissionData.status });
};

export const completeMission = async (req, missionId) => {
    const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기

    const userMissionData = bodyToUserMission(missionId, userId);  // userId를 전달
    const userMissionId = await updateUserMission(req, userMissionData);

    // 응답 반환
    return responseFromUserMission({ missionId, status: userMissionData.status });
};
