'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { assignUserToCourse, unassignUserFromCourse } from '@/server/actions/institution-modules';

type UserItem = {
  id: string;
  name: string;
  email: string;
  institutionName: string;
};

type CourseItem = {
  id: string;
  titleEn: string;
  slug: string;
};

type EnrollmentItem = {
  id: string;
  userId: string;
  courseId: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  enrolledAt: string;
};

export function EnrollmentManager({
  locale,
  users,
  courses,
  enrollments,
}: {
  locale: string;
  users: UserItem[];
  courses: CourseItem[];
  enrollments: EnrollmentItem[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? '');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? '');

  const onAssign = () => {
    startTransition(async () => {
      const result = await assignUserToCourse(locale, selectedUserId, selectedCourseId);
      if (result?.error) {
        toast({ title: 'Assign failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Enrollment created', description: 'User was mapped to the course.' });
      router.refresh();
    });
  };

  const onUnassign = (userId: string, courseId: string) => {
    startTransition(async () => {
      const result = await unassignUserFromCourse(locale, userId, courseId);
      if (result?.error) {
        toast({ title: 'Unenroll failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Enrollment removed', description: 'User was unmapped from the course.' });
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-black text-slate-900">Manual User-to-Course Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titleEn}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAssign}
            disabled={!selectedUserId || !selectedCourseId || isPending}
            className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:opacity-60"
          >
            Assign Course
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Course</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Enrolled At</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-900">{row.userName}</p>
                  <p className="text-xs text-slate-500">{row.userEmail}</p>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.courseTitle}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-500">{row.enrolledAt}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onUnassign(row.userId, row.courseId)}
                    disabled={isPending}
                    className="h-8 rounded-lg border border-red-200 px-2 text-xs font-bold text-red-700 disabled:opacity-60"
                  >
                    Unenroll
                  </button>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                  No enrollments found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

