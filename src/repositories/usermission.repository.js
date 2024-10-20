// userMission.repository.js
import { pool } from "../db.config.js";

// User Mission Data 삽입
export const addUserMission = async (data) => {
    const conn = await pool.getConnection();
    const { user_id, mission_id, status } = data;

    try {
        const [result] = await conn.query(
            'INSERT INTO USER_MISSION (user_id, mission_id, status) VALUES (?, ?, ?);',
            [user_id, mission_id, status]
        );

        return result.insertId; // 새로 생성된 USER_MISSION의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    } finally {
        conn.release(); // 연결 해제
    }
};
