import { NextResponse } from 'next/server';
import { getLiveTechnicianLocation } from '@/lib/tracking';

interface RouteParams {
  params: Promise<{ requestId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { requestId } = await params;
    const data = await getLiveTechnicianLocation(requestId);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching technician location', error);
    return NextResponse.json(
      { message: 'Unable to fetch technician location' },
      { status: 500 },
    );
  }
}
