import { User, InsertUser, Course, Test, TestAttempt } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: Omit<Course, "id">): Promise<Course>;
  
  // Test operations
  getTests(courseId: number): Promise<Test[]>;
  getTestById(id: number): Promise<Test | undefined>;
  createTest(test: Omit<Test, "id">): Promise<Test>;
  
  // Test attempts
  getTestAttempts(studentId: number): Promise<TestAttempt[]>;
  createTestAttempt(attempt: Omit<TestAttempt, "id">): Promise<TestAttempt>;
  updateTestAttempt(id: number, score: number, feedback: string): Promise<TestAttempt>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private tests: Map<number, Test>;
  private testAttempts: Map<number, TestAttempt>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.tests = new Map();
    this.testAttempts = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: Omit<Course, "id">): Promise<Course> {
    const id = this.currentId++;
    const newCourse = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async getTests(courseId: number): Promise<Test[]> {
    return Array.from(this.tests.values()).filter(
      (test) => test.courseId === courseId
    );
  }

  async getTestById(id: number): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async createTest(test: Omit<Test, "id">): Promise<Test> {
    const id = this.currentId++;
    const newTest = { ...test, id };
    this.tests.set(id, newTest);
    return newTest;
  }

  async getTestAttempts(studentId: number): Promise<TestAttempt[]> {
    return Array.from(this.testAttempts.values()).filter(
      (attempt) => attempt.studentId === studentId
    );
  }

  async createTestAttempt(attempt: Omit<TestAttempt, "id">): Promise<TestAttempt> {
    const id = this.currentId++;
    const newAttempt = { ...attempt, id };
    this.testAttempts.set(id, newAttempt);
    return newAttempt;
  }

  async updateTestAttempt(
    id: number,
    score: number,
    feedback: string
  ): Promise<TestAttempt> {
    const attempt = this.testAttempts.get(id);
    if (!attempt) throw new Error("Test attempt not found");
    
    const updated = { ...attempt, score, feedback };
    this.testAttempts.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
