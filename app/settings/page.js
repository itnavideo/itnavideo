import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Settings | Itnavideo',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  redirect('/dashboard');
}
