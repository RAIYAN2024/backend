type IdType =
  | "uppercase"
  | "lowercase"
  | "number"
  | "mixed"
  | "number-lowercase"
  | "number-uppercase";

export default function GenerateID(
  length: number,
  type: IdType = "mixed"
): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";

  let chars: string;
  switch (type) {
    case "uppercase":
      chars = uppercaseChars;
      break;
    case "lowercase":
      chars = lowercaseChars;
      break;
    case "number":
      chars = numberChars;
      break;
    case "mixed":
      chars = uppercaseChars + lowercaseChars + numberChars;
      break;
    case "number-lowercase":
      chars = numberChars + lowercaseChars;
      break;
    case "number-uppercase":
      chars = numberChars + uppercaseChars;
      break;
    default:
      // This should never happen due to type checking
      throw new Error(
        `Invalid type "${type}". Use "uppercase", "lowercase", "number", or "mixed".`
      );
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}
