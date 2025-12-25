import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'technology';

  try {
    const response = await fetch(
      `https://news-api14.p.rapidapi.com/v2/trendings?topic=${topic}&language=en`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'news-api14.p.rapidapi.com',
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
        },
      }
    );

    const data = await response.json();
    console.log('News API Response:', JSON.stringify(data, null, 2));

    return NextResponse.json(data);



    console.error('News API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
