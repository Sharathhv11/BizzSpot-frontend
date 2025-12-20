import  checkPasswordQuality  from "./passwordValidate.js";

export default function getNextPasswordRule(password) {
  if (!password) return "";

  const { checks } = checkPasswordQuality(password);

  if (!checks.length) {
    return "Password must be at least 8 characters";
  }
  if (!checks.lowercase) {
    return "Add at least one lowercase letter";
  }
  if (!checks.uppercase) {
    return "Add at least one uppercase letter";
  }
  if (!checks.number) {
    return "Add at least one number";
  }
  if (!checks.special) {
    return "Add at least one special character";
  }

  return ""; // strong password
}
