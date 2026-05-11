import { redirect } from 'next/navigation';

/**
 * This is the root page of your application.
 * It immediately redirects to the admin login page.
 */
export default function RootPage() {
  // In a real application, you might check for an active session here before redirecting.
  redirect('/admin/login');
}