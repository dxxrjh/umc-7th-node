import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { userReview } from "../services/review.service.js";

export const handleUserReview = async (req, res, next) => {
    console.log("리뷰 작성을 요청했습니다!");
    console.log("body: ", req.body);
    console.log("shopId: ", req.params.shopId); // shopId 로그 추가

    if (!req.params.shopId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "shopId가 필요합니다." });
    }

    const review = await userReview(req); // 변경: req를 userReview에 전달
    console.log("Response Review:", review);
    res.status(StatusCodes.OK).json({ result: review });
};