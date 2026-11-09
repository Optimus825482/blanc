import { query } from '../../../lib/db';

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) return new Response(null, { status: 404 });
  const { rows: [image] } = await query(
    `SELECT bytes FROM bb_media WHERE id=$1 AND (
      EXISTS (SELECT 1 FROM bb_content WHERE image=$2)
      OR EXISTS (SELECT 1 FROM bb_categories WHERE image=$2 AND published)
    )`, [id, '/media/' + id]
  );
  if (!image) return new Response(null, { status: 404 });
  return new Response(image.bytes, { headers: {
    'Content-Type': 'image/webp',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=300',
  } });
}
