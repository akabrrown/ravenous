import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  normalizeWhatsAppPhone, 
  createWhatsAppDeepLink, 
  formatWhatsAppMessage 
} from './whatsapp-utils.ts';

describe('WhatsApp Utilities', () => {
  describe('normalizeWhatsAppPhone', () => {
    test('normalizes Ghana local phone number starting with 0', () => {
      assert.strictEqual(normalizeWhatsAppPhone('055 247 1202'), '233552471202');
      assert.strictEqual(normalizeWhatsAppPhone('054-050-0729'), '233540500729');
      assert.strictEqual(normalizeWhatsAppPhone('0599977213'), '233599977213');
    });

    test('normalizes phone number with international + prefix', () => {
      assert.strictEqual(normalizeWhatsAppPhone('+233 55 247 1202'), '233552471202');
      assert.strictEqual(normalizeWhatsAppPhone('+1 (555) 123-4567'), '15551234567');
    });

    test('handles already clean numbers', () => {
      assert.strictEqual(normalizeWhatsAppPhone('233552471202'), '233552471202');
    });

    test('returns null for empty or invalid inputs', () => {
      assert.strictEqual(normalizeWhatsAppPhone(''), null);
      assert.strictEqual(normalizeWhatsAppPhone('abc'), null);
      assert.strictEqual(normalizeWhatsAppPhone(null), null);
    });
  });

  describe('createWhatsAppDeepLink', () => {
    test('generates valid wa.me link with encoded text', () => {
      const link = createWhatsAppDeepLink('055 247 1202', 'Hello World!');
      assert.strictEqual(link, 'https://wa.me/233552471202?text=Hello%20World!');
    });

    test('returns null if phone number cannot be normalized', () => {
      const link = createWhatsAppDeepLink('', 'Hello');
      assert.strictEqual(link, null);
    });
  });

  describe('formatWhatsAppMessage', () => {
    test('formats booking request message', () => {
      const msg = formatWhatsAppMessage('booking', {
        guestName: 'Kwame Asante',
        guestPhone: '055 247 1202',
        guestEmail: 'kwame@example.com',
        eventType: 'Wedding',
        eventDate: '2026-11-20',
        location: 'AICC, Accra',
        requirements: 'Need LED screens and live streaming.',
      });

      assert.ok(msg.includes('NEW BOOKING REQUEST'));
      assert.ok(msg.includes('Kwame Asante'));
      assert.ok(msg.includes('055 247 1202'));
      assert.ok(msg.includes('Wedding'));
      assert.ok(msg.includes('2026-11-20'));
      assert.ok(msg.includes('AICC, Accra'));
    });

    test('formats quote request message', () => {
      const msg = formatWhatsAppMessage('quote', {
        guestName: 'Abena Mansa',
        guestPhone: '024 123 4567',
        guestEmail: 'abena@example.com',
        eventType: 'Corporate Event',
        eventDate: '2026-12-05',
        location: 'Kempinski Hotel, Accra',
        services: ['LED Screen Rental', 'Live Streaming'],
        expectedAttendance: 250,
        requirements: 'Full audio visual setup required.',
      });

      assert.ok(msg.includes('NEW QUOTE REQUEST'));
      assert.ok(msg.includes('Abena Mansa'));
      assert.ok(msg.includes('Corporate Event'));
      assert.ok(msg.includes('250 guests'));
      assert.ok(msg.includes('LED Screen Rental'));
    });

    test('formats contact form message', () => {
      const msg = formatWhatsAppMessage('contact', {
        name: 'Kofi Boateng',
        email: 'kofi@example.com',
        phone: '050 987 6543',
        subject: 'General Question',
        message: 'Do you provide stage lighting for outdoor events?',
      });

      assert.ok(msg.includes('NEW CONTACT MESSAGE'));
      assert.ok(msg.includes('Kofi Boateng'));
      assert.ok(msg.includes('General Question'));
      assert.ok(msg.includes('outdoor events'));
    });
  });
});
