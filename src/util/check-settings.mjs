import { devError, devWarn } from "@/util/dev.mjs";

const MAX_LENGTH = Math.pow(2, 10) * 20; // 20kb

export default function checkSettings(settings) {
  let result = "";
  try {
    result = JSON.stringify(settings);
  } catch (e) {
    devError("Failed to serialize state!");
  }
  if (result?.length > MAX_LENGTH) {
    devWarn(
      `Settings object is too big (>${MAX_LENGTH} bytes). ` +
        `Please do not store unnecessary data in settings.`
    );
  }
}
