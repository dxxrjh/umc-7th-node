import { responseFromUser, responseFromReviews } from "../dtos/review.dto.js";
import { NonExistingShopError } from "../errors.js";
import {
    addReview,
    getReview,
    getAllShopReviews,
    getAllUserReviews
} from "../repositories/review.repository.js";

export const userReview = async (req) => {
    const body = req.body;
    const shopId = req.params.shopId; // shopId를 여기에 추가
    const userId = req.user?.id || req.session?.userId;

    // 리뷰 추가
    const joinUserReview = await addReview(body, req); // req를 넘김

    // 리뷰가 성공적으로 추가되었는지 확인
    if (joinUserReview === null) {
        throw new NonExistingShopError("존재하지 않는 가게입니다.", data);
    }

    // 추가된 리뷰를 ID로 조회
    const review = await getReview(joinUserReview);

    // 응답 반환
    return responseFromUser({ review });
};

export const listShopReview = async(shopId, cursor) => {
    const reviews=await getAllShopReviews(shopId, cursor);
    return responseFromReviews(reviews);
};

export const listUserReview = async (cursor) => {
    const userId = req.user?.id || req.session?.userId;
    const reviews = await getAllUserReviews(userId, cursor);  // userId와 cursor를 넘겨서 해당 사용자의 리뷰 조회
    return responseFromReviews(reviews);
};
