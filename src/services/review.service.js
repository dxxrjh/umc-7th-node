import { responseFromUser } from "../dtos/review.dto.js";
import {
    addReview,
    getReview,
} from "../repositories/review.repository.js";

export const userReview = async (req) => {
    const body = req.body;
    const shopId = req.params.shopId; // shopId를 여기에 추가
    const userId = 10; // 하드코딩된 user_id

    // 리뷰 추가
    const joinUserReview = await addReview(body, req); // req를 넘김

    // 리뷰가 성공적으로 추가되었는지 확인
    if (joinUserReview === null) {
        throw new Error("존재하지 않는 가게입니다.");
    }

    // 추가된 리뷰를 ID로 조회
    const review = await getReview(joinUserReview);

    // 응답 반환
    return responseFromUser({ review });
};