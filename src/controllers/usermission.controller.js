import { StatusCodes } from "http-status-codes";
import { startMission } from "../services/usermission.service.js";
import { completeMission } from "../services/usermission.service.js";

// 미션 도전 시작
export const handleStartMission = async (req, res, next) => {
    /*
    #swagger.summary = '미션 도전 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              missionId: { type: "number"}
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "미션 도전 성공 응답",
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
                  missionId: { type: "number" },
                  status: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 도전 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U003" },
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
    const { missionId } = req.body; // 요청 본문에서 missionId 가져오기

    if (!missionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "missionId가 필요합니다." });
    }
    console.log("Mission ID: ", missionId);

    const result = await startMission(req, missionId);
    res.status(StatusCodes.CREATED).json({ result });
};

// 미션 완료
export const handleCompleteMission = async (req, res) => {
    /*
    #swagger.summary = '미션 완료 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              missionId: { type: "number" },
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "미션 완료 성공 응답",
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
                  status: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
  */
    const { missionId } = req.body; // 요청 본문에서 missionId 가져오기

    if (!missionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "missionId가 필요합니다." });
    }

    try {
        // 미션 상태 업데이트
        const result = await completeMission(req,missionId);
        
        if (!result) {
            return res.status(404).json({ error: "미션을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "미션이 완료되었습니다." });
    } catch (err) {
        res.status(500).json({ error: `서버 오류: ${err.message}` });
    }
};