import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Course, TestAttempt } from "@shared/schema";
import { CourseCard } from "@/components/course-card";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: attempts } = useQuery<TestAttempt[]>({
    queryKey: ["/api/students", user?.id, "attempts"],
  });

  return (
    <Layout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Student Dashboard</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Listening</span>
                  <span>7.0</span>
                </div>
                <Progress value={70} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Reading</span>
                  <span>6.5</span>
                </div>
                <Progress value={65} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Writing</span>
                  <span>6.0</span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Speaking</span>
                  <span>7.5</span>
                </div>
                <Progress value={75} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attempts?.map((attempt) => (
                  <div key={attempt.id} className="flex justify-between items-center">
                    <span>Test #{attempt.testId}</span>
                    <span>{attempt.score}/9</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-2xl font-semibold mt-8 mb-4">Your Courses</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
