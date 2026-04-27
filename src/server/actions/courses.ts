'use server';

import { prisma } from '@/lib/db';
import { requireSession, getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/navigation';

export async function getCourses() {
  // Public access allowed for catalog
  return await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      track: true,
      _count: {
        select: { modules: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getCourseBySlug(slug: string) {
  // We can also allow public viewing of course details (outline)
  return await prisma.course.findUnique({
    where: { slug },
    include: {
      track: true,
      modules: {
        where: { status: 'published' },
        orderBy: { sortOrder: 'asc' },
        include: {
          lessons: {
            where: { status: 'published' },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });
}

export async function getLessonBySlug(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  // Lesson content is strictly protected
  await requireSession();


  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      module: {
        slug: moduleSlug,
        course: { slug: courseSlug },
      },
    },
    include: {
      contentBlocks: {
        orderBy: { sortOrder: 'asc' },
      },
      module: {
        include: { 
          course: true,
          lessons: {
            where: { status: 'published' },
            orderBy: { sortOrder: 'asc' },
            select: { id: true, slug: true, titleEn: true }
          }
        },
      },
    },
  });

  if (!lesson) return null;

  // Find adjacent lessons in the same module
  const lessons = lesson.module.lessons;
  const currentIndex = lessons.findIndex((l: any) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return {
    ...lesson,
    prevLesson,
    nextLesson,
  };
}

export async function enrollInCourse(courseId: string) {
  const session = await requireSession();

  try {
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId,
        },
      },
    });

    if (existing) {
      return { success: true };
    }

    await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId,
      },
    });

    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Enrollment error:', error);
    return { error: 'Failed to enroll in course' };
  }
}

export async function checkEnrollment(courseId: string) {
  const session = await getSession();
  if (!session) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId,
      },
    },
  });

  return !!enrollment;
}

export async function completeLesson(lessonId: string) {
  const session = await requireSession();

  try {
    await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.id,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Find the next lesson to redirect to
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { 
        module: { 
          include: { 
            course: true,
            lessons: { 
              orderBy: { sortOrder: 'asc' },
              where: { status: 'published' }
            }
          } 
        } 
      }
    });

    if (!currentLesson) return { success: true };

    const courseSlug = currentLesson.module.course.slug;
    const moduleSlug = currentLesson.module.slug;
    const lessons = currentLesson.module.lessons;
    const currentIndex = lessons.findIndex((l: any) => l.id === lessonId);
    
    revalidatePath(`/dashboard/courses/${courseSlug}`);

    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      return { 
        success: true, 
        nextUrl: `/dashboard/courses/${courseSlug}/${moduleSlug}/${nextLesson.slug}` 
      };
    } else {
      // Check if there is a next module
      const modules = await prisma.module.findMany({
        where: { courseId: currentLesson.module.courseId, status: 'published' },
        orderBy: { sortOrder: 'asc' },
        include: { lessons: { orderBy: { sortOrder: 'asc' }, where: { status: 'published' } } }
      });

      const currentModuleIndex = modules.findIndex((m: any) => m.id === currentLesson.moduleId);
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
          return {
            success: true,
            nextUrl: `/dashboard/courses/${courseSlug}/${nextModule.slug}/${nextModule.lessons[0].slug}`
          };
        }
      }
    }

    return { success: true, nextUrl: `/dashboard/courses/${courseSlug}` };
  } catch (error) {
    console.error('Lesson completion error:', error);
    return { error: 'Failed to mark lesson as complete' };
  }
}

export async function getCourseProgress(courseId: string) {
  const session = await getSession();
  if (!session) return { completed: 0, total: 0, percentage: 0 };

  const [totalLessons, completedProgress] = await Promise.all([
    prisma.lesson.count({
      where: {
        module: { courseId, status: 'published' },
        status: 'published'
      }
    }),
    prisma.progress.count({
      where: {
        userId: session.id,
        isCompleted: true,
        lesson: {
          module: { courseId }
        }
      }
    })
  ]);

  return {
    completed: completedProgress,
    total: totalLessons,
    percentage: totalLessons > 0 ? Math.round((completedProgress / totalLessons) * 100) : 0
  };
}

export async function getLessonProgress(lessonId: string) {
  const session = await getSession();
  if (!session) return null;

  return await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.id,
        lessonId,
      }
    }
  });
}

export async function getEnrolledCourses() {
  const session = await getSession();
  if (!session) return [];

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id, isActive: true },
    include: {
      course: {
        include: {
          track: true,
          modules: {
            where: { status: 'published' },
            include: {
              lessons: {
                where: { status: 'published' },
              },
            },
          },
        },
      },
    },
  });

  const enrolledWithProgress = await Promise.all(
    enrollments.map(async (e: any) => {
      const progress = await getCourseProgress(e.course.id);
      return {
        ...e.course,
        progress,
      };
    })
  );

  return enrolledWithProgress;
}
