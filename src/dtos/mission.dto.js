export const bodyToMission=(body) => {

    return{
        description: body.description,
      point: body.point,
      due_date:body.due_date
    }
}

export const responseFromUser = ({ mission }) => {
    return {
      description: mission.description,
      point: mission.point,
      due_date:mission.due_date
    };
  };

export const responseFromMissions = (missions) => {
  return {
    data: missions,  // 리뷰 데이터
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id : null,  // 다음 페이지의 커서
    },
  };
};