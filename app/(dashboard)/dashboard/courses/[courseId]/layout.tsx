import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";
import { checkCourseAccess } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { userId } = await auth();
  const { courseId } = await params;

  const authResult = await checkCourseAccess(userId || null, courseId);
  if (!authResult.isAuthorized || !userId) {
    return redirect(authResult.redirect!);
  }

  const [course, progress] = await Promise.all([
    getCourseById(courseId),
    getCourseProgress(userId, courseId),
  ]);

  if (!course) {
    return redirect("/my-courses");
  }

  return (
    <div className="h-full">
      <Sidebar course={course} completedLessons={progress.completedLessons} />
      <main className="h-full lg:pt-[64px] pl-10 lg:pl-96">{children}</main>
    </div>
  );
}
