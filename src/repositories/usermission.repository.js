import { prisma } from "../db.config.js";

//Id로 Mission 찾기
export const findUserMissionById = async (userId, missionId) => {
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
export const addUserMission = async (data) => {
    const { user_id, mission_id, status } = data;

    try {
        const result = await prisma.userMission.create({
            data: {
                user_id: user_id,
                mission_id: mission_id,
                status: status,
            }
        });

        return result.id; // 새로 생성된 USER_MISSION의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    }
};

//User Mission 완료로 변경하기
export const updateUserMission = async (data) => {
    const { user_id, mission_id, status } = data;
    try {
        const result = await prisma.userMission.updateMany({
            where: {
                user_id: user_id,
                mission_id: mission_id, // 미션 ID
                status: status
            },
            data: {
                status: "done", // 미션 상태 업데이트
            },
        });

        return result.id;
        return updatedMission.count > 0; // 업데이트된 레코드 수가 0보다 크면 성공
    } catch (err) {
        throw new Error(`미션 완료 업데이트 오류: ${err.message}`);
    }
};

