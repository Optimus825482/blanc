import 'server-only';
import { cache } from 'react';
import { query } from './db';

export const settingKeys = [
  'contact_phone', 'contact_whatsapp', 'contact_email', 'address_street', 'address_locality',
  'address_region', 'address_country', 'maps_url', 'hours_text', 'hours_schema',
];

export const getSettings = cache(async () => {
  const { rows } = await query('SELECT key, value FROM bb_settings');
  return Object.fromEntries(settingKeys.map(key => [key, rows.find(row => row.key === key)?.value ?? '']));
});

export function digits(value) {
  return String(value || '').replace(/\D/g, '');
}

export function whatsappLink(settings, text = '') {
  const number = digits(settings.contact_whatsapp);
  if (number.length < 10) return null;
  return 'https://wa.me/' + number + (text ? '?text=' + encodeURIComponent(text) : '');
}

export function phoneLink(settings) {
  const number = digits(settings.contact_phone);
  return number.length >= 10 ? 'tel:+' + number : null;
}

export function hoursRows(settings) {
  return settings.hours_text.split(/\r?\n/).map(line => line.split('=').map(part => part.trim())).filter(parts => parts.length === 2 && parts[0] && parts[1]);
}

export function hoursSchema(settings) {
  const lines = settings.hours_schema.split(/\r?\n/).map(line => line.trim()).filter(line => /^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))?(,(Mo|Tu|We|Th|Fr|Sa|Su))* \d{2}:\d{2}-\d{2}:\d{2}$/.test(line));
  return lines.length ? lines : undefined;
}

export function postalAddress(settings) {
  const address = { '@type': 'PostalAddress' };
  if (settings.address_street) address.streetAddress = settings.address_street;
  if (settings.address_locality) address.addressLocality = settings.address_locality;
  if (settings.address_region) address.addressRegion = settings.address_region;
  if (settings.address_country) address.addressCountry = settings.address_country;
  return address;
}
