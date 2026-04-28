'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  downloadCertificateText,
  issueAdminCertificate,
  revokeAdminCertificate,
  verifyCertificateByPublicId,
} from '@/server/actions/institution-modules';

type UserOption = { id: string; name: string; email: string };
type CourseOption = { id: string; titleEn: string };
type CertificateRow = {
  id: string;
  certificateId: string;
  recipientName: string;
  courseName: string;
  issuedAt: string;
  isRevoked: boolean;
  revokedReason: string | null;
};

export function CertificateAdminPanel({
  locale,
  users,
  courses,
  certificates,
}: {
  locale: string;
  users: UserOption[];
  courses: CourseOption[];
  certificates: CertificateRow[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [userId, setUserId] = useState(users[0]?.id ?? '');
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '');
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<string>('');

  const onIssue = () => {
    startTransition(async () => {
      const result = await issueAdminCertificate(locale, {
        userId,
        courseId,
        score: score ? Number(score) : null,
        grade: grade || null,
        expiresAt: expiresAt || null,
      });
      if (result?.error) {
        toast({ title: 'Issue failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Certificate issued', description: `Certificate ID: ${result.certificateId}` });
      router.refresh();
    });
  };

  const onRevoke = (id: string) => {
    const reason = window.prompt('Enter revocation reason:') || 'Revoked by admin';
    startTransition(async () => {
      const result = await revokeAdminCertificate(locale, id, reason);
      if (result?.error) {
        toast({ title: 'Revoke failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Certificate revoked', description: 'The certificate is now marked revoked.' });
      router.refresh();
    });
  };

  const onDownload = (id: string) => {
    startTransition(async () => {
      const result = await downloadCertificateText(id);
      if (result?.error || !result.success) {
        toast({ title: 'Download failed', description: result?.error ?? 'Unknown error', variant: 'destructive' });
        return;
      }
      const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'Download started', description: 'Certificate text file is downloading.' });
    });
  };

  const onVerify = () => {
    startTransition(async () => {
      const result = await verifyCertificateByPublicId(verifyId);
      if (result?.error || !result.success) {
        setVerifyResult(result?.error ?? 'Certificate not found');
        return;
      }
      const c = result.certificate;
      setVerifyResult(
        `${c.certificateId} | ${c.recipientName} | ${c.courseName} | ${c.isRevoked ? `REVOKED (${c.revokedReason ?? 'no reason'})` : 'ACTIVE'}`
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-black text-slate-900">Issue Certificate</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
            {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
            {courses.map((c) => <option key={c.id} value={c.id}>{c.titleEn}</option>)}
          </select>
          <input value={score} onChange={(e) => setScore(e.target.value)} type="number" placeholder="Score" className="h-9 rounded-lg border border-slate-200 px-2 text-sm" />
          <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade" className="h-9 rounded-lg border border-slate-200 px-2 text-sm" />
          <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" className="h-9 rounded-lg border border-slate-200 px-2 text-sm" />
          <button type="button" onClick={onIssue} disabled={isPending} className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:opacity-60">
            Issue
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <h3 className="text-sm font-black text-slate-900">Verify Certificate</h3>
        <div className="flex items-center gap-2">
          <input
            value={verifyId}
            onChange={(e) => setVerifyId(e.target.value)}
            placeholder="Public Certificate ID"
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm w-72"
          />
          <button type="button" onClick={onVerify} disabled={isPending} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700">
            Verify
          </button>
        </div>
        {verifyResult ? <p className="text-xs font-medium text-slate-600">{verifyResult}</p> : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Certificate</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Course</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {certificates.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-xs font-bold text-slate-700">{row.certificateId}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.recipientName}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.courseName}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded font-black uppercase ${row.isRevoked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {row.isRevoked ? 'Revoked' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onDownload(row.id)} disabled={isPending} className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700">
                      Download
                    </button>
                    {!row.isRevoked ? (
                      <button type="button" onClick={() => onRevoke(row.id)} disabled={isPending} className="h-8 rounded-lg border border-red-200 px-2 text-xs font-bold text-red-700">
                        Revoke
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">{row.revokedReason ?? 'Revoked'}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">No certificates found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

