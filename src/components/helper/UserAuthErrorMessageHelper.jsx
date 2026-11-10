export function getLoginErrorMessage(error) {
  if (!error) return "Something went wrong. Please try again.";

  if (error.name === "AuthRetryableFetchError") {
    return "Network error. Check your connection.";
  }

  switch (error.code) {
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_confirmed":
      return "Your email hasn't been confirmed yet.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
