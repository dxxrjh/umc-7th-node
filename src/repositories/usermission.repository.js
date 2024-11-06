import { prisma } from "../db.config.js";

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
