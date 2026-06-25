import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Passport Photo Cropper & MRP Photo Tool Nepal',
  description: 'Crop and resize photos to official Nepali passport (MRP) and citizenship sizes. Drag-to-pan, zoom slider, face-silhouette overlay, canvas export.',
  keywords: ['passport photo nepal', 'mrp photo', 'citizenship photo', 'photo cropper', 'passport size', 'nepal passport', 'photo resize'],
  alternates: { canonical: 'https://nepalihub.com/documents/passport-photo' },
  openGraph: {
    title: 'Passport Photo Cropper & MRP Photo Tool',
    description: 'Crop and resize photos to official Nepali passport and citizenship sizes.',
  },
};

export default function Page() { return <Client />; }
