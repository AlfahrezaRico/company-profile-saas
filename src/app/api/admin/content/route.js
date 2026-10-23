import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET content items (filtered by section if query parameter provided)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    let rows;
    if (section) {
      rows = await query.all("SELECT * FROM cms_content WHERE section = ? ORDER BY order_index ASC", [section]);
    } else {
      rows = await query.all("SELECT * FROM cms_content ORDER BY section ASC, order_index ASC");
    }

    return NextResponse.json({
      success: true,
      content: rows
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Create new content item (Admin only)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { section, title, subtitle, image_url, content, order_index } = await request.json();

    if (!section || !title) {
      return NextResponse.json(
        { success: false, message: 'Section and title are required' },
        { status: 400 }
      );
    }

    const result = await query.run(
      "INSERT INTO cms_content (section, title, subtitle, image_url, content, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [section, title, subtitle || '', image_url || '', content || '', order_index || 0]
    );

    return NextResponse.json({
      success: true,
      message: 'Content item created successfully',
      id: result.lastID
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing content item (Admin only)
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, section, title, subtitle, image_url, content, order_index } = await request.json();

    if (!id || !section || !title) {
      return NextResponse.json(
        { success: false, message: 'ID, Section and Title are required' },
        { status: 400 }
      );
    }

    await query.run(
      "UPDATE cms_content SET section = ?, title = ?, subtitle = ?, image_url = ?, content = ?, order_index = ? WHERE id = ?",
      [section, title, subtitle || '', image_url || '', content || '', order_index || 0, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Content item updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a content item (Admin only)
export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID parameter is required' },
        { status: 400 }
      );
    }

    await query.run("DELETE FROM cms_content WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: 'Content item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
