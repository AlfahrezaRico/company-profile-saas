import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // 1. Authenticate session
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // 2. Fetch all initial dashboard data directly from the database
  let settings = {};
  let sections = [];
  let navigation = [];
  let cmsContent = [];
  let submissions = [];

  try {
    // Fetch settings
    const settingsRows = await query.all("SELECT * FROM settings");
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });

    // Fetch sections
    sections = await query.all("SELECT * FROM sections ORDER BY rowid ASC");

    // Fetch navigation
    navigation = await query.all("SELECT * FROM navigation ORDER BY order_index ASC");

    // Fetch CMS Content
    cmsContent = await query.all("SELECT * FROM cms_content ORDER BY section ASC, order_index ASC");

    // Fetch submissions
    submissions = await query.all("SELECT * FROM contact_submissions ORDER BY created_at DESC");
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }

  return (
    <AdminDashboard 
      initialSettings={settings}
      initialSections={sections}
      initialNavigation={navigation}
      initialCmsContent={cmsContent}
      initialSubmissions={submissions}
    />
  );
}
