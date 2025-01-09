import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { shopMission, listShopMission } from "../services/mission.service.js";

export const handleShopMission = async (req, res, next) => {
    /*
    #swagger.summary = '미션 등록 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              description: { type: "string" },
              point: { type: "number" },
              due_date: { type: "string"}
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "미션 등록 성공 응답",
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
                  id: { type: number },
                  shop: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }}},
                  description: { type: "string" },
                  point: { type: "number" },
                  due_date: { type: "string " }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 등록 실패 응답",
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
    console.log("미션 추가를 요청했습니다!");
    console.log("body: ", req.body);
    console.log("shopId: ", req.params.shopId); // shopId 로그 추가

    if (!req.params.shopId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "shopId가 필요합니다." });
    }

    const mission = await shopMission(req); // 변경: req를 shopMission에 전달
    console.log("Response Mission:", mission);
    res.status(StatusCodes.OK).json({ result: mission });
};

export const handleListShopMission = async (req, res, next) => {
    /*
        #swagger.summary = '가게 미션 목록 조회 API';
        #swagger.response[200] = {
            description: "가게 미션 목록 조회 성공 응답",
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
                                                shop: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }}},
                                                description: { type: "string" },
                                                point: { type: "number" },
                                                due_date: { type: "string"}
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
        const missions = await listShopMission(
            parseInt(req.params.shopId),
            cursorValue
          );

        if (!missions || !missions.data || missions.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No missions found for this shop',
            });
        }

        const missionsArray = Array.isArray(missions.data) ? missions.data : [missions.data];

        // BigInt 값과 다른 필드를 안전하게 처리
        const missionsWithStringifiedBigInt = missionsArray.map(mission => ({
            shop_name: mission.SHOP && mission.SHOP.name ? mission.SHOP.name : "No shop name",
            description: `${mission.description}`,
            point: `${mission.point}`,
        }));

        return res.status(200).json({
            data: missionsWithStringifiedBigInt,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch missions',
            error: error.message,
        });
    }
};