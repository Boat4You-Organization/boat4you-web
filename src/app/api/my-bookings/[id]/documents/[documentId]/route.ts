import { NextRequest, NextResponse } from 'next/server';

import { authFetch } from '@/utils/static/authFetch';

/**
 * Customer-facing proxy that streams a reservation document from the
 * backend. Browsers can't add the Bearer header to a plain `<a download>`,
 * so we route the click through this server route which uses the session
 * cookie via authFetch and forwards the bytes back to the user with the
 * original Content-Type and Content-Disposition.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; documentId: string }> }) {
  const { id, documentId } = await params;

  const upstream = await authFetch(
    `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/my-reservations/${id}/documents/${documentId}`
  );

  if (!upstream.ok) {
    return NextResponse.json({ message: 'Failed to fetch document' }, { status: upstream.status });
  }

  const data = await upstream.arrayBuffer();
  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const contentDisposition = upstream.headers.get('content-disposition') || 'attachment';

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
      'Cache-Control': 'private, no-store',
    },
  });
}
