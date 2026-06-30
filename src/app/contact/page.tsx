import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the NepalHub team for support, feedback, or business inquiries.',
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/contact' },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Get in Touch</h2>
          <p>
            Whether you have a feature request, found a bug, or just want to say hello, feel free to drop us an email or use the contact form. We strive to reply to all inquiries within 24-48 hours.
          </p>
          <div className="mt-4 space-y-2">
            <p><strong>Email:</strong> <a href="mailto:support@nepalihub.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@nepalihub.com</a></p>
            <p><strong>Business:</strong> <a href="mailto:business@nepalihub.com" className="text-blue-600 dark:text-blue-400 hover:underline">business@nepalihub.com</a></p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <form className="space-y-4" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" id="email" name="email" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea id="message" name="message" rows={4} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
