import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "alpha Life — Reset Your Password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #FF4D4D; margin-bottom: 8px;">alpha Life</h2>
        <h3 style="color: #2D3748;">Hi ${name},</h3>
        <p style="color: #718096; line-height: 1.6;">
          You requested a password reset. Click the button below to set a new password.
          This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
          style="display: inline-block; background: #FF4D4D; color: #fff;
                 padding: 12px 28px; border-radius: 8px; text-decoration: none;
                 font-weight: bold; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #A0AEC0; font-size: 12px;">
          If you didn't request this, ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });
};

export const sendWelcomeEmail = async (
  email: string,
  name: string,
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to alpha Life 🎯",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #FF4D4D;">alpha Life</h2>
        <h3 style="color: #2D3748;">Welcome, ${name}!</h3>
        <p style="color: #718096; line-height: 1.6;">
          Your account is ready. Start tracking your tasks, timers, goals and fitness — all in one place.
        </p>
        <p style="color: #718096;">Let's build something great.</p>
      </div>
    `,
  });
};
