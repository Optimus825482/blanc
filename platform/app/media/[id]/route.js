import { query } from '../../../lib/db';

// Herkese açık görsel servisi: yalnızca yayındaki bir kayda bağlı görseller verilir
// (içerik, özel gün, ürün tipi, tasarım, teklif görseli). Panel önizlemesi /admin/media/[id] altında.
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) return new Response(null, { status: 404 });
  const { rows: [image] } = await query(
    `SELECT bytes FROM bb_media WHERE id=$1 AND (
      EXISTS (SELECT 1 FROM bb_content WHERE image=$2)
      OR EXISTS (SELECT 1 FROM bb_categories WHERE image=$2 AND published)
      OR EXISTS (SELECT 1 FROM bb_occasions WHERE image=$2 AND published)
      OR EXISTS (SELECT 1 FROM bb_product_types WHERE image=$2 AND published)
      OR EXISTS (SELECT 1 FROM bb_designs WHERE image=$2 AND published)
      OR EXISTS (SELECT 1 FROM bb_quotes WHERE image_id=$1 OR logo_id=$1)
    )`, [id, '/media/' + id]
  );
  if (!image) return new Response(null, { status: 404 });
  return new Response(image.bytes, { headers: {
    'Content-Type': 'image/webp',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=300',
  } });
}
