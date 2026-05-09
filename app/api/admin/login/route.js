// API endpoint for secure admin login
// This validates credentials against environment variables instead of hardcoding them
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      return Response.json({ success: true, message: 'Admin login successful' });
    }

    return Response.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
