import { NextResponse } from 'next/server';

// Simple in-memory rate limiting. 
// WARNING: This resets on server restarts or serverless cold starts. 
// For production, use a distributed store like Redis (e.g., Upstash).
const loginAttempts = new Map();

export async function POST(req) {
  try {
    // 1. Identify the client by IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    const now = Date.now();
    const MAX_ATTEMPTS = 5;
    const WINDOW_MS = 15 * 60 * 1000; // 15 minute lockout window

    let record = loginAttempts.get(ip);

    // 2. Check if the IP is currently rate-limited
    if (record && (now - record.startTime) < WINDOW_MS) {
      if (record.count >= MAX_ATTEMPTS) {
        return NextResponse.json({ success: false, message: 'Too many login attempts. Please try again in 15 minutes.' }, { status: 429 });
      }
      record.count++;
    } else {
      // Start a new window for this IP
      record = { count: 1, startTime: now };
    }
    loginAttempts.set(ip, record);

    const { username, password } = await req.json();

    // These should be set in .env.local without the NEXT_PUBLIC_ prefix
    // to ensure they are never exposed to the client.
    const expectedUser = process.env.ADMIN_USER || 'itnavideo';
    const expectedPass = process.env.ADMIN_PASSWORD || 'password';

    if (username === expectedUser && password === expectedPass) {
      // 3. Clear the rate limit record on a successful login
      loginAttempts.delete(ip);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}