import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error("Twilio credentials not found in environment variables");
}

const client = twilio(accountSid, authToken);

export const sendSms = async (body, to) => {
  try {
    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }

    const message = await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER || "whatsapp:+14155238886",
      body,
      to: `whatsapp:${to}`,
    });

    console.log("SMS sent successfully:", message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    return { success: false, error: error.message };
  }
};
