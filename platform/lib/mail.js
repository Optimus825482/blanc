import 'server-only';
import nodemailer from 'nodemailer';

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function smtpHazirMi() {
  return Boolean(process.env.SMTP_HOST?.trim());
}

function transporterOlustur() {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
  });
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  if (!to || !String(to).includes('@')) {
    return { ok: false, reason: 'invalid_recipient' };
  }
  const transporter = transporterOlustur();
  if (!transporter) {
    return { ok: false, reason: 'not_configured' };
  }
  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || 'noreply@beyzablanc.com';
  try {
    const info = await transporter.sendMail({
      from: `Beyza Blanc <${from}>`,
      to,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    });
    return { ok: true, mode: 'smtp', messageId: info.messageId };
  } catch (err) {
    console.error('[mail] Gönderim hatası:', err?.message || err);
    return { ok: false, reason: 'send_failed', error: err?.message || 'E-posta gönderilemedi' };
  }
}

export function quoteNotificationEmail({
  code,
  kind,
  productTitle,
  quantity,
  estimate,
  recipientName,
  customerEmail,
  customerPhone,
  summary,
  trackingUrl,
  adminUrl,
  company,
}) {
  const tur = kind === 'corporate' ? 'Kurumsal Teklif Talebi' : 'Bireysel Teklif Talebi';
  const subject = `[Beyza Blanc] Yeni ${tur} · ${code}`;
  const lines = [
    `Yeni bir ${tur.toLowerCase()} alındı.`,
    '',
    `Teklif Kodu: ${code}`,
    `Ürün: ${productTitle || 'Özel Tasarım'}`,
    `Adet: ${quantity || 1}`,
    estimate !== null && estimate !== undefined ? `Tahmini Tutar: ${Number(estimate).toLocaleString('tr-TR')} TL` : null,
    recipientName ? `Alıcı Adı: ${recipientName}` : null,
    company?.firma ? `Firma: ${company.firma}` : null,
    company?.yetkili ? `Yetkili: ${company.yetkili}` : null,
    customerEmail ? `Müşteri E-posta: ${customerEmail}` : null,
    customerPhone ? `Müşteri Telefon: ${customerPhone}` : null,
    '',
    `Yönetim Paneli: ${adminUrl}`,
    `Müşteri Takip Sayfası: ${trackingUrl}`,
    '',
    '--- Özet ---',
    summary || '',
  ].filter(Boolean);

  const html = `
    <div style="font-family:Georgia,serif;color:#2b151a;background:#fbf7f1;padding:24px;border:1px solid #d9cbb8;max-width:640px;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6b52;">BEYZA BLANC · YENİ TEKLİF TALEBİ</p>
      <h2 style="margin:0 0 16px;font-size:22px;color:#512730;">${escapeHtml(tur)} · ${escapeHtml(code)}</h2>
      <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;margin-bottom:16px;">
        <tr><td style="padding:6px 0;color:#6e564a;">Ürün</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(productTitle || 'Özel Tasarım')} (${escapeHtml(quantity || 1)} adet)</td></tr>
        ${estimate !== null && estimate !== undefined ? `<tr><td style="padding:6px 0;color:#6e564a;">Tahmini Tutar</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(Number(estimate).toLocaleString('tr-TR'))} TL</td></tr>` : ''}
        ${customerEmail ? `<tr><td style="padding:6px 0;color:#6e564a;">Müşteri E-posta</td><td style="padding:6px 0;">${escapeHtml(customerEmail)}</td></tr>` : ''}
        ${customerPhone ? `<tr><td style="padding:6px 0;color:#6e564a;">Müşteri Telefon</td><td style="padding:6px 0;">${escapeHtml(customerPhone)}</td></tr>` : ''}
        ${company?.firma ? `<tr><td style="padding:6px 0;color:#6e564a;">Firma / Yetkili</td><td style="padding:6px 0;">${escapeHtml(company.firma)} ${company.yetkili ? '· ' + escapeHtml(company.yetkili) : ''}</td></tr>` : ''}
      </table>
      <p style="margin:0 0 16px;">
        <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#512730;color:#fffaf4;padding:10px 18px;text-decoration:none;border-radius:6px;font-family:Arial,sans-serif;font-size:13px;">Yönetim Panelinde Aç</a>
      </p>
      <pre style="white-space:pre-wrap;background:#fffaf4;padding:12px;border:1px solid #e5d8c8;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;">${escapeHtml(summary || '')}</pre>
    </div>
  `;

  return { subject, text: lines.join('\n'), html };
}

export function quoteReplyEmail({
  code,
  customerName,
  price,
  deliveryInfo,
  message,
  trackingUrl,
  settings,
}) {
  const subject = `Beyza Blanc Teklifiniz Hazır · ${code}`;
  const greeting = customerName ? `Merhaba ${customerName},` : 'Merhaba,';
  const lines = [
    greeting,
    '',
    `${code} kodlu Beyza Blanc özel tasarım teklif talebiniz incelendi ve teklifiniz hazırlandı.`,
    '',
    price ? `Teklif Tutarı: ${price} TL` : null,
    deliveryInfo ? `Teslim / Hazırlık Bilgisi: ${deliveryInfo}` : null,
    message ? `\nAtölye Notu:\n${message}` : null,
    '',
    `Tasarımınızı ve güncel teklif durumunuzu antetli özet olarak görüntülemek için:`,
    trackingUrl,
    '',
    'Saygılarımızla,',
    'Beyza Blanc · Kişiye Özel Belçika Çikolatası & Hediyelik Atölyesi',
    settings?.contact_phone ? `Tel: ${settings.contact_phone}` : null,
    settings?.contact_email ? `E-posta: ${settings.contact_email}` : null,
  ].filter(Boolean);

  const html = `
    <div style="font-family:Georgia,serif;color:#2b151a;background:#fbf7f1;padding:28px;border:1px solid #d9cbb8;max-width:640px;">
      <div style="border-bottom:2px solid #512730;padding-bottom:14px;margin-bottom:20px;">
        <p style="margin:0;font-size:22px;letter-spacing:2px;color:#512730;font-weight:600;">BEYZA BLANC</p>
        <p style="margin:4px 0 0;font-size:12px;color:#7a6254;">Kişiye Özel Belçika Çikolatası &amp; Kurumsal Hediyelik Atölyesi</p>
      </div>
      <p style="font-size:15px;line-height:1.6;">${escapeHtml(greeting)}</p>
      <p style="font-size:15px;line-height:1.6;"><strong>${escapeHtml(code)}</strong> kodlu teklif talebiniz atölyemiz tarafından değerlendirildi. Teklif detaylarınız aşağıdadır:</p>
      <div style="background:#fffaf4;border:1px solid #e5d8c8;padding:16px;margin:16px 0;font-family:Arial,sans-serif;font-size:14px;">
        ${price ? `<p style="margin:0 0 8px;"><strong>Teklif Tutarı:</strong> ${escapeHtml(price)} TL</p>` : ''}
        ${deliveryInfo ? `<p style="margin:0 0 8px;"><strong>Teslim / Hazırlık Bilgisi:</strong> ${escapeHtml(deliveryInfo)}</p>` : ''}
        ${message ? `<p style="margin:8px 0 0;white-space:pre-line;"><strong>Atölye Mesajı:</strong><br/>${escapeHtml(message)}</p>` : ''}
      </div>
      <p style="margin:20px 0;">
        <a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#512730;color:#fffaf4;padding:12px 22px;text-decoration:none;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;">Teklif &amp; Antetli Özeti Görüntüle</a>
      </p>
      <hr style="border:none;border-top:1px solid #e5d8c8;margin:24px 0 12px;" />
      <p style="margin:0;font-size:12px;color:#7a6254;font-family:Arial,sans-serif;">
        Beyza Blanc Atölye · ${escapeHtml([settings?.address_locality, settings?.address_region].filter(Boolean).join(', ') || 'Alsancak · Girne')}
        ${settings?.contact_phone ? ' · ' + escapeHtml(settings.contact_phone) : ''}
      </p>
    </div>
  `;

  return { subject, text: lines.join('\n'), html };
}
