import { NextResponse } from 'next/server';

// Simple in-memory rate limiting. 
// WARNING: This resets on Vercel deployments/cold starts.
const loginAttempts = new Map();

export async function POST(req) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    const now = Date.now();
    const MAX_ATTEMPTS = 5;
    const WINDOW_MS = 15 * 60 * 1000;

    let record = loginAttempts.get(ip);

    if (record && (now - record.startTime) < WINDOW_MS) {
      if (record.count >= MAX_ATTEMPTS) {
        return NextResponse.json({ success: false, message: 'Too many login attempts.' }, { status: 429 });
      }
      record.count++;
    } else {
      record = { count: 1, startTime: now };
    }
    loginAttempts.set(ip, record);

    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USER || 'itnavideo';
    const expectedPass = process.env.ADMIN_PASSWORD || 'password';

    if (username === expectedUser && password === expectedPass) {
      loginAttempts.delete(ip);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}