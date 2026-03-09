function formatPhoneNumber(input) {
  if (!input || typeof input !== "string") return null;

  // Remove spaces, dashes, parentheses
  let cleaned = input.replace(/[\s\-()]/g, "");

  // Only digits and optional leading '+'
  cleaned = cleaned.replace(/[^\d+]/g, "");

  return cleaned;
}

module.exports = { formatPhoneNumber };
