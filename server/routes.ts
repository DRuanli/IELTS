import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCourseSchema, insertTestSchema, insertTestAttemptSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Courses
  app.get("/api/courses", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.post("/api/courses", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.sendStatus(401);
    }
    
    const parsed = insertCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const course = await storage.createCourse(parsed.data);
    res.status(201).json(course);
  });

  // Tests
  app.get("/api/courses/:courseId/tests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tests = await storage.getTests(parseInt(req.params.courseId));
    res.json(tests);
  });

  app.post("/api/courses/:courseId/tests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.sendStatus(401);
    }

    const parsed = insertTestSchema.safeParse({
      ...req.body,
      courseId: parseInt(req.params.courseId)
    });
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const test = await storage.createTest(parsed.data);
    res.status(201).json(test);
  });

  // Test attempts
  app.post("/api/tests/:testId/attempts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertTestAttemptSchema.safeParse({
      ...req.body,
      testId: parseInt(req.params.testId),
      studentId: req.user.id,
      submittedAt: new Date()
    });
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const attempt = await storage.createTestAttempt(parsed.data);
    res.status(201).json(attempt);
  });

  app.get("/api/students/:studentId/attempts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    if (req.user.role !== "teacher" && req.user.id !== parseInt(req.params.studentId)) {
      return res.sendStatus(401);
    }

    const attempts = await storage.getTestAttempts(parseInt(req.params.studentId));
    res.json(attempts);
  });

  app.patch("/api/attempts/:attemptId", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.sendStatus(401);
    }

    const { score, feedback } = req.body;
    const attempt = await storage.updateTestAttempt(
      parseInt(req.params.attemptId),
      score,
      feedback
    );
    res.json(attempt);
  });

  const httpServer = createServer(app);
  return httpServer;
}
