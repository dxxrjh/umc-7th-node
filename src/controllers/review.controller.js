import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { userReview, listShopReview } from "../services/review.service.js";

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

export const handleListShopReview = async (req, res, next) => {
    console.log("Cursor from request:", req.query.cursor);
    const cursorValue = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    console.log("Cursor passed to repository:", cursorValue);  // 레포지토리로 넘겨지는 값 확인
    try {
        const reviews = await listShopReview(
            parseInt(req.params.shopId),
            cursorValue
          );

        if (!reviews || !reviews.data || reviews.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No reviews found for this shop',
            });
        }

        const reviewsArray = Array.isArray(reviews.data) ? reviews.data : [reviews.data];

        // BigInt 값과 다른 필드를 안전하게 처리
        const reviewsWithStringifiedBigInt = reviewsArray.map(review => ({
            user_id: review.user_id ? review.user_id.toString() : null,
            user_name: review.USER && review.USER.name ? review.USER.name : "No user name",
            shop_name: review.SHOP && review.SHOP.name ? review.SHOP.name : "No shop name",
            rate: `${review.rate}`,
            content: `${review.content}`,
        }));

        return res.status(200).json({
            data: reviewsWithStringifiedBigInt,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message,
        });
    }
};
