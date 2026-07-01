import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, phone, interest, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"WildFellas Website" <${process.env.EMAIL}>`,
      to: "wildfellas22@gmail.com",
      replyTo: email,
      subject: "🦁 New WildFellas Safari Inquiry",
      text: `
New inquiry from the WildFellas website.

Name     : ${name}
Email    : ${email}
Phone    : ${phone || "-"}
Interest : ${interest || "-"}

Message:
${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ success: false, error: "Failed to send email" });
  }
}