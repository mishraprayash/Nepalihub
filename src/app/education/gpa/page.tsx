import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'SEE & NEB (+2) GPA Calculator Nepal',
  description: 'Calculate GPA and grade percentages for SEE, NEB (+2), and university grading systems in Nepal. Add/remove subjects, letter grade mapping.',
  keywords: ['gpa calculator', 'see gpa', 'neb gpa', 'plus two gpa', 'nepal education', 'grade calculator', 'mark percentage'],
  alternates: { canonical: 'https://nepalihub.com/education/gpa' },
  openGraph: {
    title: 'SEE & NEB (+2) GPA Calculator',
    description: 'Calculate GPA for SEE, NEB (+2), and university grading systems in Nepal.',
  },
};

export default function Page() { return <Client />; }
