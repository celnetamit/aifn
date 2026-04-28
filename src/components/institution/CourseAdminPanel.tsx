'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  createAdminCourse,
  setAdminCoursePublished,
  updateAdminCourse,
} from '@/server/actions/institution-modules';

type CourseItem = {
  id: string;
  slug: string;
  titleEn: string;
  summaryEn: string | null;
  estimatedHours: number | null;
  isPublished: boolean;
};

export function CourseAdminPanel({
  locale,
  courses,
}: {
  locale: string;
  courses: CourseItem[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newHours, setNewHours] = useState('');
  const [newPublished, setNewPublished] = useState(false);

  const onCreate = () => {
    startTransition(async () => {
      const result = await createAdminCourse(locale, {
        titleEn: newTitle,
        slug: newSlug,
        summaryEn: newSummary,
        estimatedHours: newHours ? Number(newHours) : null,
        isPublished: newPublished,
      });
      if (result?.error) {
        toast({ title: 'Create failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Course created', description: 'New course has been added.' });
      setNewTitle('');
      setNewSlug('');
      setNewSummary('');
      setNewHours('');
      setNewPublished(false);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-black text-slate-900">Create Course</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          />
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="slug"
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          />
          <input
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            placeholder="Summary"
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          />
          <input
            value={newHours}
            onChange={(e) => setNewHours(e.target.value)}
            placeholder="Hours"
            type="number"
            min={0}
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          />
          <label className="h-9 rounded-lg border border-slate-200 px-2 text-sm flex items-center gap-2">
            <input checked={newPublished} onChange={(e) => setNewPublished(e.target.checked)} type="checkbox" />
            Publish
          </label>
        </div>
        <button
          type="button"
          onClick={onCreate}
          disabled={isPending}
          className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:opacity-60"
        >
          Create Course
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Course</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Hours</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                locale={locale}
                isPending={isPending}
                onDone={() => router.refresh()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseRow({
  course,
  locale,
  isPending,
  onDone,
}: {
  course: CourseItem;
  locale: string;
  isPending: boolean;
  onDone: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(course.titleEn);
  const [summary, setSummary] = useState(course.summaryEn ?? '');
  const [hours, setHours] = useState(course.estimatedHours?.toString() ?? '');
  const [pending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      const result = await updateAdminCourse(locale, course.id, {
        titleEn: title,
        summaryEn: summary,
        estimatedHours: hours ? Number(hours) : null,
      });
      if (result?.error) {
        toast({ title: 'Update failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Course updated', description: 'Course details were saved.' });
      onDone();
    });
  };

  const onTogglePublish = () => {
    startTransition(async () => {
      const result = await setAdminCoursePublished(locale, course.id, !course.isPublished);
      if (result?.error) {
        toast({ title: 'Publish update failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({
        title: !course.isPublished ? 'Course published' : 'Course unpublished',
        description: 'Course visibility has been updated.',
      });
      onDone();
    });
  };

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 rounded border border-slate-200 px-2 text-xs w-56" />
      </td>
      <td className="px-4 py-3 text-xs font-medium text-slate-600">{course.slug}</td>
      <td className="px-4 py-3">
        <input value={hours} onChange={(e) => setHours(e.target.value)} type="number" min={0} className="h-8 rounded border border-slate-200 px-2 text-xs w-20" />
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] px-2 py-1 rounded font-black uppercase ${course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {course.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pending || isPending}
            onClick={onSave}
            className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700"
          >
            Save
          </button>
          <button
            type="button"
            disabled={pending || isPending}
            onClick={onTogglePublish}
            className="h-8 rounded-lg bg-slate-900 px-2 text-xs font-bold text-white"
          >
            {course.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mt-2 h-14 w-full rounded border border-slate-200 px-2 py-1 text-xs"
        />
      </td>
    </tr>
  );
}

