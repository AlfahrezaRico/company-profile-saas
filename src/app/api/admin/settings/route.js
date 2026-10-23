import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Fetch settings and sections configurations
export async function GET() {
  try {
    const settingsRows = await query.all("SELECT * FROM settings");
    const sectionsRows = await query.all("SELECT * FROM sections ORDER BY rowid ASC");
    
    // Map settings from key-value rows to a single object
    const settings = {};
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({
      success: true,
      settings,
      sections: sectionsRows
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update settings and sections (Admin only)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { settings, sections } = await request.json();

    // 1. Update Settings if provided
    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        await query.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
      }
    }

    // 2. Update Sections if provided
    if (sections && Array.isArray(sections)) {
      for (const sec of sections) {
        await query.run(
          "UPDATE sections SET title = ?, subtitle = ?, is_active = ? WHERE key = ?",
          [sec.title, sec.subtitle, sec.is_active ? 1 : 0, sec.key]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings and configurations updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
