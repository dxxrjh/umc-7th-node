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