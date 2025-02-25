import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Test } from "@shared/schema";
import { FileText } from "lucide-react";
import { Badge } from "./ui/badge";

interface TestCardProps {
  test: Test;
  onClick?: () => void;
}

export function TestCard({ test, onClick }: TestCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            {test.title}
          </CardTitle>
          <Badge>{test.type}</Badge>
        </div>
        <CardDescription>Course: {test.courseId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {(test.questions as any[]).length} questions
        </div>
      </CardContent>
    </Card>
  );
}
