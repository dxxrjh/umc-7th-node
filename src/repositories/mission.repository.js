import { pool } from "../db.config.js";

// Mission Data 삽입
export const addMission = async (data, req) => {
    const conn = await pool.getConnection();
    const shopId = req.params.shopId;
    const { description, point, due_date } = data;

    // 가게 존재 여부 확인
    try {
        const [confirm] = await conn.query(
            'SELECT COUNT(*) as count FROM SHOP WHERE id = ?',
            [shopId]
        );

        // shop이 없을 경우
        if (confirm[0].count === 0) {  // '==' 대신 '===' 사용
            return null;
        }

        // 미션 삽입
        const [result] = await conn.query(
            'INSERT INTO MISSION (shop_id, description, point, due_date) VALUES (?, ?, ?, ?);',
            [
                shopId,
                description,
                point,
                due_date
            ]
        );
        console.log("Adding mission with data:", data);

        return result.insertId; // 새로 생성된 미션의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    } finally {
        conn.release(); // 연결 해제
    }
};

// Mission 정보 얻기
export const getMission = async (missionId) => {
    const conn = await pool.getConnection();

    try {
        const [mission] = await conn.query(
            'SELECT * FROM MISSION WHERE id = ?;',
            [missionId]
        );
        
        if (mission.length === 0) { 
            return null; // 리뷰가 없는 경우
        }
        console.log("Retrieved mission:", mission);

        return mission[0];
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    } finally {
        conn.release(); // 연결 해제
    }
};
