function formatPhoneNumber(input) {
  if (!input || typeof input !== "string") return null;

  let cleaned = input.replace(/[\s\u00A0\-()]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = "+" + cleaned.slice(1).replace(/\D/g, "");
  } else {
    cleaned = cleaned.replace(/\D/g, "");
  }

  return cleaned.trim();
}

module.exports = { formatPhoneNumber };
