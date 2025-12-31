import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Settings ko thoda badla hai
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Port 465 ke liye true zaroori hai
    auth: {
      user: 'financehubstudio@gmail.com',
      pass: 'btdjdlqmakglbgia', 
    },
  });

  try {
    // Connection test karne ke liye
    await transporter.verify(); 

    await transporter.sendMail({
      from: `"VEDAVERSE" <financehubstudio@gmail.com>`,
      to: 'financehubstudio@gmail.com',
      replyTo: email,
      subject: `New Query from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("DETAILED_ERROR:", error); // Ye error terminal mein dikhega
    return res.status(500).json({ error: error.message });
  }
}