import { escapeRegExp } from "../utils.js";

export const HEARTBEAT_TOKEN = "HEARTBEAT_OK";
export const SILENT_REPLY_TOKEN = "NO_REPLY";

export function isSilentReplyText(
  text: string | undefined,
  token: string = SILENT_REPLY_TOKEN,
): boolean {
  if (!text) {
    return false;
  }
  const escaped = escapeRegExp(token);
  // Match only the exact silent token with optional surrounding whitespace.
  // This prevents
  // substantive replies ending with NO_REPLY from being suppressed (#19537).
  return new RegExp(`^\\s*${escaped}\\s*$`).test(text);
}

export function isSilentReplyPrefixText(
  text: string | undefined,
  token: string = SILENT_REPLY_TOKEN,
): boolean {
  if (!text) {
    return false;
  }
  const normalized = text.trimStart().toUpperCase();
  if (!normalized) {
    return false;
  }
  const upperToken = token.toUpperCase();
  // Check if the normalized text is a progressive character-by-character
  // prefix of the token. This catches early characters (e.g. "N", "NO")
  // before the underscore appears, preventing flash-then-delete on channels
  // that post messages before the full token is received.
  if (normalized.length <= upperToken.length && upperToken.startsWith(normalized)) {
    // Only match if all characters are valid token characters (A-Z, _)
    if (/^[A-Z_]+$/.test(normalized)) {
      return true;
    }
  }
  return false;
}
