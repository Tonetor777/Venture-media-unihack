'use client';

import { GetCompletionsQueryResult, GetCourseByIdQueryResult, Module } from "@/sanity.types";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateCourseProgress } from "@/lib/courseProgress";
import Link from "next/link";
import { ArrowLeft, Check, PlayCircle } from "lucide-react";
import DarkModeToggle from "../DarkModeToggle";
import { CourseProgress } from "../CourseProgress";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface SidebarProps {
  course: GetCourseByIdQueryResult;
  completedLessons?: GetCompletionsQueryResult["completedLessons"];
}

export function AppSidebar({ course, completedLessons = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);

  useEffect(() => {
    if (pathname && course?.modules) {
      const currentModuleId = course.modules.find((module) =>
        module.lessons?.some(
          (lesson) =>
            pathname ===
            `/dashboard/courses/${course._id}/lessons/${lesson._id}`
        )
      )?._id;

      if (currentModuleId && !openModules.includes(currentModuleId)) {
        setOpenModules((prev) => [...prev, currentModuleId]);
      }
    }
  }, [pathname, course, openModules]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!course || !isMounted) {
    return null;
  }

  const progress = calculateCourseProgress(
    course.modules as unknown as Module[],
    completedLessons
  );


  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" asChild>
              <div className="flex items-center justify-between">
                <Link href="/my-courses" prefetch={false} className="flex items-center gap-x-2 text-sm hover:text-primary transition-colors">
                  <div className="flex items-center gap-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Course Library</span>
                  </div>
                </Link>
                <DarkModeToggle />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup>
          <SidebarGroupContent>
            <h1 className="font-semibold text-2xl">{course.title}</h1>
            <CourseProgress
              progress={progress}
              variant="success"
              label="Course Progress"
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Accordion
              type="multiple"
              value={openModules}
              onValueChange={setOpenModules}
            >
              {course.modules?.map((module, moduleIndex) => (
                <AccordionItem
                  key={module._id}
                  value={module._id}
                  className={cn(
                    "border-none",
                    moduleIndex % 2 === 0 ? "bg-muted/30" : "bg-background"
                  )}
                >
                  <AccordionTrigger className="hover:no-underline transition-colors p-0">
                    <SidebarMenuButton asChild className="h-full">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground min-w-[28px]">
                          {String(moduleIndex + 1).padStart(2, "0")}
                        </span>
                        <div className="flex flex-col gap-y-1 text-left">
                          <p className="text-sm font-medium">
                            {module.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-1">
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const isActive =
                          pathname ===
                          `/dashboard/courses/${course._id}/lessons/${lesson._id}`;
                        const isCompleted = completedLessons.some(
                          (completion) => completion.lesson?._id === lesson._id
                        );

                        return (
                          <Link
                            key={lesson._id}
                            prefetch={false}
                            href={`/dashboard/courses/${course._id}/lessons/${lesson._id}`}
                            onClick={close}
                            className={cn(
                              "flex items-center pl-8 lg:pl-10 pr-2 lg:pr-4 py-2 gap-x-2 lg:gap-x-4 group hover:bg-muted/50 transition-colors relative",
                              isActive && "bg-muted",
                              isCompleted && "text-muted-foreground"
                            )}
                          >
                            <span className="text-xs font-medium text-muted-foreground min-w-[28px]">
                              {String(lessonIndex + 1).padStart(2, "0")}
                            </span>
                            {isCompleted ? (
                              <Check className="h-4 w-4 shrink-0 text-green-500" />
                            ) : (
                              <PlayCircle
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-primary/80"
                                )}
                              />
                            )}
                            <span
                              className={cn(
                                "text-sm line-clamp-2 min-w-0",
                                isCompleted &&
                                "text-muted-foreground line-through decoration-green-500/50"
                              )}
                            >
                              {lesson.title}
                            </span>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-primary" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar >
  )
}