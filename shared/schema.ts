import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('student'),
  name: text("name").notNull(),
  email: text("email").notNull()
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  teacherId: integer("teacher_id").notNull()
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  studentId: integer("student_id").notNull()
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  courseId: integer("course_id").notNull(),
  type: text("type").notNull(), // 'reading', 'writing', 'listening', 'speaking'
  questions: json("questions").notNull()
});

export const testAttempts = pgTable("test_attempts", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull(),
  studentId: integer("student_id").notNull(),
  answers: json("answers").notNull(),
  score: integer("score"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
  email: true
});

export const insertCourseSchema = createInsertSchema(courses);
export const insertTestSchema = createInsertSchema(tests);
export const insertTestAttemptSchema = createInsertSchema(testAttempts);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type TestAttempt = typeof testAttempts.$inferSelect;
