import { NextResponse } from 'next/server';
import { redis, DATA_KEY } from '@/lib/redis';
import { AdminData, getDefaultData } from '@/types/admin';

export async function GET() {
  try {
    const rawData = await redis.get(DATA_KEY);
    if (!rawData) {
      const data = getDefaultData();
      await redis.set(DATA_KEY, JSON.stringify(data));
      return NextResponse.json(data);
    }
    return NextResponse.json(JSON.parse(rawData));
  } catch (error) {
    console.error('Redis GET error:', error);
    return NextResponse.json(getDefaultData());
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    
    // Get existing data to check password
    const rawData = await redis.get(DATA_KEY);
    const currentData = rawData ? JSON.parse(rawData) : getDefaultData();
    
    const providedPassword = request.headers.get('x-admin-password');
    
    if (providedPassword !== currentData.password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await redis.set(DATA_KEY, JSON.stringify(newData));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
