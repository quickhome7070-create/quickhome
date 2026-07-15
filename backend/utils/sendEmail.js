const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "QuickHome <noreply@ghardestiny.com>",
      to,
      subject,
      html,
    });

    console.log("Resend Response:", response);

    return response;

  } catch (error) {

    console.error("Resend Error:", error);

    throw error; // IMPORTANT
  }
};

module.exports = sendEmail;