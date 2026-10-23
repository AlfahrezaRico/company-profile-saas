import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Fetch navigation menus ordered by order_index
export async function GET() {
  try {
    const navItems = await query.all("SELECT * FROM navigation ORDER BY order_index ASC");
    return NextResponse.json({
      success: true,
      navigation: navItems
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Bulk update navigation items (create, update, delete, and reorder)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { navigation } = await request.json();

    if (!Array.isArray(navigation)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: navigation array expected' },
        { status: 400 }
      );
    }

    // Wrap in a simple SQL transaction-like execution: delete all and insert the new ones
    // This makes ordering and deleting incredibly simple and bulletproof!
    await query.exec("DELETE FROM navigation");

    for (let i = 0; i < navigation.length; i++) {
      const item = navigation[i];
      // Skip empty labels
      if (!item.label) continue;
      
      await query.run(
        "INSERT INTO navigation (label, url, order_index, is_active) VALUES (?, ?, ?, ?)",
        [item.label, item.url || '#', i + 1, item.is_active ? 1 : 0]
      );
    }

    const updatedNavItems = await query.all("SELECT * FROM navigation ORDER BY order_index ASC");

    return NextResponse.json({
      success: true,
      message: 'Navigation saved successfully',
      navigation: updatedNavItems
    });
  } catch (error) {
    console.error('Error updating navigation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
