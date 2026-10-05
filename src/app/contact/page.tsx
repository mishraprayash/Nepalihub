import { useId } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the NepalHub team for support, feedback, or business inquiries.',
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/contact' },
};

export default function ContactPage() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 text-ink-soft text-sm leading-relaxed space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Contact Us</h1>
        <p className="text-sm text-ink-faint">We&apos;d love to hear from you. Send us a message!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">Get in Touch</h2>
          <p>
            Whether you have a feature request, found a bug, or just want to say hello, feel free to drop us an email or use the contact form. We strive to reply to all inquiries within 24-48 hours.
          </p>
          <div className="mt-4 space-y-2">
            <p><strong>Email:</strong> <a href="mailto:support@nepalihub.com" className="text-simrik hover:text-simrik-deep hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/60 rounded">support@nepalihub.com</a></p>
            <p><strong>Business:</strong> <a href="mailto:business@nepalihub.com" className="text-simrik hover:text-simrik-deep hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/60 rounded">business@nepalihub.com</a></p>
          </div>
        </section>

        <section className="bg-surface p-6 rounded-2xl shadow-sm border border-line">
          <form className="space-y-4" action="#" method="POST">
            <div>
              <label htmlFor={nameId} className="block text-xs font-medium text-ink-soft mb-1">Name</label>
              <input type="text" id={nameId} name="name" required className="w-full px-3 py-2 border border-line rounded-lg bg-surface-raised text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor={emailId} className="block text-xs font-medium text-ink-soft mb-1">Email</label>
              <input type="email" id={emailId} name="email" required className="w-full px-3 py-2 border border-line rounded-lg bg-surface-raised text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor={messageId} className="block text-xs font-medium text-ink-soft mb-1">Message</label>
              <textarea id={messageId} name="message" rows={4} required className="w-full px-3 py-2 border border-line rounded-lg bg-surface-raised text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 resize-none transition-all" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full py-2.5 px-4 bg-simrik hover:bg-simrik-deep text-surface-raised font-medium rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
