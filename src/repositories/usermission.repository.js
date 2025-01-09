import { prisma } from "../db.config.js";
import { AlreadyAddedMissionError } from "../errors.js";

// Id로 Mission 찾기
export const findUserMissionById = async (req, missionId) => {
    const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기

    try {
        // USER_MISSION 테이블에서 특정 userId와 missionId가 일치하는 항목 검색
        const userMission = await prisma.USER_MISSION.findUnique({
            where: {
                user_id_mission_id: {
                    user_id: userId,
                    mission_id: missionId
                }
            }
        });
        return userMission; // 미션이 존재하면 해당 레코드를 반환
    } catch (error) {
        console.error("Error finding user mission by ID:", error);
        throw error;
    }
};

// User Mission Data 삽입
export const addUserMission = async (req, data) => {

    const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기
    const { missionId, status } = data;
    console.log("Received data in addUserMission:", data);  // data가 제대로 전달되는지 확인


    try {
        // missionId와 userId 쌍이 이미 존재하는지 확인
        const missionExists = await prisma.userMission.count({
            where: {
                user_id: userId,
                mission_id: missionId,
            }
        });

        // 이미 존재하는 미션이 있다면, 커스텀 에러를 던지기
        if (missionExists > 0) {
            throw new AlreadyAddedMissionError(
                "이미 도전한 미션입니다.",
                { user_id: userId, missionId }
            );
        }

        // 미션 추가 로직
        const userMissionData = {user_id: userId, mission_id: missionId, status: status };
        console.log("Inserting data1:", data);  // `mission_id` 확인

        const result = await prisma.userMission.create({
            data: data
        });

        console.log("Insert result:", result);  // DB 결과 로그

        return result.id; // 새로 생성된 USER_MISSION의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    }
};

// User Mission 완료로 변경하기
export const updateUserMission = async (req, data) => {
    const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기

    const { missionId, status } = data;

    try {
        const result = await prisma.userMission.updateMany({
            where: {
                user_id: userId,
                mission_id: missionId, // 미션 ID
                status: status
            },
            data: {
                status: "done", // 미션 상태 업데이트
            },
        });

        return result.count > 0; // 업데이트된 레코드 수가 0보다 크면 성공
    } catch (err) {
        throw new Error(`미션 완료 업데이트 오류: ${err.message}`);
    }
};
