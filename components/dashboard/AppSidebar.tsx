'use client';

import { GetCompletionsQueryResult, GetCourseByIdQueryResult, Module } from "@/sanity.types";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateCourseProgress } from "@/lib/courseProgress";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Library, X } from "lucide-react";
import DarkModeToggle from "../DarkModeToggle";
import { Button } from "../ui/button";
import { CourseProgress } from "../CourseProgress";
import { cn } from "@/lib/utils";

interface SidebarProps {
  course: GetCourseByIdQueryResult;
  completedLessons?: GetCompletionsQueryResult["completedLessons"];
}

export function AppSidebar({ course, completedLessons = [] }: SidebarProps) {
  const pathname = usePathname();
  const { open, setOpen, toggleSidebar } = useSidebar();
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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" prefetch={false}>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Library className="h-5 w-5" />
                </Button>
                <span>Course Library</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                className="h-10 w-10"
              >
                <ChevronRight
                  className={cn(
                    "h-5 w-5 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
    </Sidebar>
  )
}