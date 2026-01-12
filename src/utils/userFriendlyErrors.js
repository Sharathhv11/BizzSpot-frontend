const getUserFriendlyMessage = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  // 400 – user mistake
  if (status === 400) {
    if (message?.toLowerCase().includes("invalid")) {
      return "The link you followed is invalid or broken. Please check the URL or browse from a valid page.";
    }

    return "There was something wrong with your request. Please try again.";
  }

  // 401 – auth issues
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  // 403 – forbidden
  if (status === 403) {
    return "You don’t have permission to access this page.";
  }

  // 404 – not found
  if (status === 404) {
    return "We couldn’t find the business you’re looking for.";
  }

  // 500 – server issues
  if (status >= 500) {
    return "Something went wrong on our side. Please try again later.";
  }

  // Fallback
  return "Something went wrong. Please try again.";
};


export default getUserFriendlyMessage;