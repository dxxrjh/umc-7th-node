export const bodyToReview=(body) => {

    return{
        rate: body.rate,
        content: body.content
    }
}

export const responseFromUser = ({ review }) => {
    return {
      rate: review.rate,
        content: review.content
    };
  };