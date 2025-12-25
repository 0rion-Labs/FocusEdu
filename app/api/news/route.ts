import { NextResponse } from 'next/server';

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY || '';

export async function GET(request: Request) {
  try {
    // Use NewsData.io API - technology news only
    const response = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&category=technology&language=en`,
      { method: 'GET' }
    );

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (jsonError) {
      console.error('Failed to parse News API response:', jsonError);
      return NextResponse.json({ error: 'Invalid response from News API' }, { status: 502 });
    }
    console.log('News API Response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('News API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
