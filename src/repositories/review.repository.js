import { pool } from "../db.config.js";

// Review Data 삽입
export const addReview = async (data, req) => {
    const conn = await pool.getConnection();
    const shopId = req.params.shopId;
    const userId = 10; // 하드코딩된 user_id
    const { rate, content } = data; // userId를 제거하고, rate와 content만 가져옴

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

        // 리뷰 삽입
        const [result] = await conn.query(
            'INSERT INTO REVIEW (user_id, shop_id, rate, content) VALUES (?, ?, ?, ?);',
            [
                userId, // 하드코딩된 user_id
                shopId,
                rate,
                content
            ]
        );
        console.log("Adding review with data:", data);

        return result.insertId; // 새로 생성된 리뷰의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    } finally {
        conn.release(); // 연결 해제
    }
};

// Review 정보 얻기
export const getReview = async (reviewId) => {
    const conn = await pool.getConnection();

    try {
        const [review] = await conn.query(
            'SELECT * FROM REVIEW WHERE id = ?;',
            [reviewId]
        );
        
        if (review.length === 0) { 
            return null; // 리뷰가 없는 경우
        }
        console.log("Retrieved review:", review);

        return review[0];
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    } finally {
        conn.release(); // 연결 해제
    }
};
