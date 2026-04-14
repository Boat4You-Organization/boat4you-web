import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const transport = nodemailer.createTransport({
    host: 'mail.boat4you.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const htmlTemplate = `
  <div>
    <h2 style="margin-bottom: 16px;">Newsletter:</h2>
    <p style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</p>
  </div>
`;

  const mailOptions: Mail.Options = {
    from: 'no-reply@boat4you.com',
    to: 'info@boat4you.com',
    subject: 'Newsletter | Boat4You',
    html: htmlTemplate,
  };

  try {
    await transport.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  } catch (error) {
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}
