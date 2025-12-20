export default function checkPasswordQuality(password) {
  const result = {
    score: 0,          // 0–4
    strength: "Weak",  // Weak | Medium | Strong
    checks: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    },
  };

  if (!password) return result;

  // Checks
  result.checks.length = password.length >= 8;
  result.checks.lowercase = /[a-z]/.test(password);
  result.checks.uppercase = /[A-Z]/.test(password);
  result.checks.number = /\d/.test(password);
  result.checks.special = /[^A-Za-z0-9]/.test(password);

  // Score calculation
  result.score = Object.values(result.checks).filter(Boolean).length;

  // Strength mapping
  if (result.score <= 2) {
    result.strength = "Weak";
  } else if (result.score <= 4) {
    result.strength = "Medium";
  } else {
    result.strength = "Strong";
  }

  return result;
}
