const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: "QuickHome <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Email sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;