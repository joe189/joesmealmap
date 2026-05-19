import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId  = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: true }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error('Beehiiv error:', res.status, text);
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
