import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@shared/schema";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          {course.title}
        </CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add more course details as needed */}
      </CardContent>
    </Card>
  );
}
