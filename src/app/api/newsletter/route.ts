import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Validator from 'validator';

// Per-IP in-memory rate limit (10/hour). Single Node process on the FE box,
// so a Map is sufficient; resets on restart.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

const clientIp = (req: NextRequest): string => {
  const realIp = req.headers.get('x-real-ip');

  if (realIp) return realIp.trim();

  // LAST x-forwarded-for element = the one appended by our own nginx.
  const forwarded = req.headers.get('x-forwarded-for');

  return forwarded?.split(',').pop()?.trim() || 'unknown';
};

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(ts => now - ts < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);

    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 10000) {
    hits.forEach((stamps, key) => {
      if (!stamps.some(ts => now - ts < RATE_WINDOW_MS)) hits.delete(key);
    });
  }

  return false;
};

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
  }

  // Only `email` is read — unknown body fields are ignored.
  const body: unknown = await req.json().catch(() => null);
  const email = body && typeof body === 'object' ? (body as { email?: unknown }).email : undefined;

  if (typeof email !== 'string' || email.length > 254 || !Validator.isEmail(email)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
  }

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
    <p style="margin-bottom: 8px;"><strong>Email:</strong> ${Validator.escape(email)}</p>
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
