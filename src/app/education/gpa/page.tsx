'use client';

import { useState } from 'react';
import { Calculator, Plus, Trash2, Info, GraduationCap } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
}

export default function GPACalculator() {
  const [system, setSystem] = useState<'neb' | 'see'>('neb');
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'English', creditHours: 5, grade: 'A+' },
    { id: '2', name: 'Mathematics', creditHours: 5, grade: 'A' },
    { id: '3', name: 'Science', creditHours: 5, grade: 'B+' },
    { id: '4', name: 'Social Studies', creditHours: 4, grade: 'B' }
  ]);

  const [newSubName, setNewSubName] = useState('');
  const [newSubCredit, setNewSubCredit] = useState(4);
  const [newSubGrade, setNewSubGrade] = useState('A+');

  const gradeToGPA: Record<string, number> = {
    'A+': 4.0,
    'A': 3.6,
    'B+': 3.2,
    'B': 2.8,
    'C+': 2.4,
    'C': 2.0,
    'D': 1.6,
    'NG': 0.0
  };

  const addSubject = () => {
    if (!newSubName.trim()) return;
    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubName,
      creditHours: newSubCredit,
      grade: newSubGrade
    };
    setSubjects([...subjects, newSub]);
    setNewSubName('');
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((sub) => sub.id !== id));
  };

  // Calculate overall GPA
  let totalCreditPoints = 0;
  let totalCredits = 0;
  let hasNG = false;

  subjects.forEach((sub) => {
    const point = gradeToGPA[sub.grade] || 0;
    if (sub.grade === 'NG') hasNG = true;
    totalCreditPoints += point * sub.creditHours;
    totalCredits += sub.creditHours;
  });

  const finalGPA = totalCredits > 0 ? (totalCreditPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          SEE & NEB (+2) GPA Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Calculate your grade point average (GPA) for Secondary Education Examination (SEE) and National Examination Board (NEB Class 11 & 12) under the latest Nepalese grading systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subjects list */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              Subjects & Grades
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSystem('neb')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${system === 'neb' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                NEB (+2)
              </button>
              <button
                onClick={() => setSystem('see')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${system === 'see' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                SEE
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block">{sub.name}</span>
                  <span className="text-xs text-gray-400">Credit Hours: {sub.creditHours}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{sub.grade}</span>
                  <button
                    onClick={() => removeSubject(sub.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add subject form */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <input
              type="text"
              placeholder="Subject name"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="sm:col-span-2 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={newSubCredit}
                onChange={(e) => setNewSubCredit(Number(e.target.value))}
                className="w-1/2 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                title="Credit Hours"
              />
              <select
                value={newSubGrade}
                onChange={(e) => setNewSubGrade(e.target.value)}
                className="w-1/2 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              >
                {Object.keys(gradeToGPA).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addSubject}
              className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Subject
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl space-y-6 text-center">
            <h2 className="text-xl font-bold border-b border-white/20 pb-4">GPA Result</h2>
            <div className="py-6">
              <span className="text-6xl font-black block tracking-tight">{finalGPA}</span>
              <span className="text-xs uppercase tracking-wider opacity-85 font-semibold mt-2 block">
                {hasNG ? 'NG (Non-Graded) Status Present' : 'Passed'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/20 pt-4">
              <div>
                <span className="opacity-95 block text-xs">Total Subjects</span>
                <span className="font-bold text-lg">{subjects.length}</span>
              </div>
              <div>
                <span className="opacity-95 block text-xs">Total Credits</span>
                <span className="font-bold text-lg">{totalCredits}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-yellow-500" /> Grading Scheme
            </h3>
            <div className="text-xs space-y-1.5 text-gray-500 dark:text-gray-400">
              <p>NEB and SEE follow the standard 35-mark pass threshold (NG below 35%).</p>
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono">
                <div>A+ : 90-100% (4.0)</div>
                <div>A : 80-89% (3.6)</div>
                <div>B+ : 70-79% (3.2)</div>
                <div>B : 60-69% (2.8)</div>
                <div>C+ : 50-59% (2.4)</div>
                <div>C : 40-49% (2.0)</div>
                <div>D : 35-39% (1.6)</div>
                <div>NG : &lt;35% (0.0)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
