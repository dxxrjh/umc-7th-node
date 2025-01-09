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

  export const responseFromReviews = (reviews) => {
    return {
      data: reviews,  // 리뷰 데이터
      pagination: {
        cursor: reviews.length ? reviews[reviews.length - 1].id : null,  // 다음 페이지의 커서
      },
    };
  };
  