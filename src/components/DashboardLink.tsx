'use client';

import Link from 'next/link';

export default function DashboardLink() {
  return (
    <Link
      href="/bookings-management"
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition"
    >
      <span>📊</span>
      <span>Dashboard</span>
    </Link>
  );
}
