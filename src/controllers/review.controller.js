import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { userReview, listShopReview, listUserReview } from "../services/review.service.js";

export const handleUserReview = async (req, res, next) => {
    /*
    #swagger.summary = '리뷰 작성 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              rate: { type: "number" },
              content: { type: "string" },
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "리뷰 작성 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    user: { type: "object", properties: { id: { type: "number" }},                                                
                    shop: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }}},
                    rate: { type: "number" }
                    content: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "리뷰 작성 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
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
    /*
        #swagger.summary = '가게 리뷰 목록 조회 API';
        #swagger.response[200] = {
            description: "가게 리뷰 목록 조회 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: number },
                                                user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" }}},                                                
                                                shop: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }}},
                                                rate: { type: "number" }
                                                content: { type: "string" }
                                            }
                                        }
                                    },
                                    pagination: { type: "object", properties: { cursor: { type: "number", nullable: true }}}
                                }
                            }
                        }
                    }
                }
            }
        };
     */
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

export const handleListUserReview = async (req, res, next) => {
    /*
        #swagger.summary = '사용자 리뷰 목록 조회 API';
        #swagger.response[200] = {
            description: "사용자 리뷰 목록 조회 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: number },
                                                user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" }}},                                                
                                                shop: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }}},
                                                rate: { type: "number" }
                                                content: { type: "string" }
                                            }
                                        }
                                    },
                                    pagination: { type: "object", properties: { cursor: { type: "number", nullable: true }}}
                                }
                            }
                        }
                    }
                }
            }
        };
     */
    console.log("Cursor from request:", req.query.cursor);
    // cursor 값은 쿼리 파라미터에서 가져오고, 없으면 0으로 설정
    const cursorValue = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    console.log("Cursor passed to repository:", cursorValue);  // 레포지토리로 넘겨지는 값 확인
    
    try {
        // 하드코딩된 userId (여기서 10으로 고정)
        const reviews = await listUserReview(cursorValue);  // 커서값을 전달
        
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