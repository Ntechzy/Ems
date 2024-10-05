import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
const IV_LENGTH = 16; 

export const encrypt = (text) => {
  text = `${text}`;
  const iv = crypto.randomBytes(IV_LENGTH); 
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; 
};

export const decrypt = (encryptedText) => {
  if (typeof encryptedText !== "string") {
    throw new Error("Encrypted text must be a string");
  }
  try {
    const textParts = encryptedText.split(":");
    if (textParts.length !== 2) {
      throw new Error("Invalid encrypted text format");
    }

    const iv = Buffer.from(textParts[0], "hex"); 
    const encrypted = textParts[1]; 

    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch (err) {
    return ""
  }
};

