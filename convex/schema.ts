// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  }).index("by_email", ["email"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(), // Unix timestamp
    status: v.union(v.literal("upcoming"), v.literal("live"), v.literal("completed"), v.literal("failed")),
    streamCallId: v.string(), // Links to GetStream
    candidateId: v.id("users"), // Reference to the candidate
    interviewerId: v.id("users"), // Reference to the admin
    notes: v.optional(v.string()),
    code: v.optional(v.string()), // Store the code content
  language: v.optional(v.string()),
  }).index("by_candidateId", ["candidateId"])
    .index("by_status", ["status"]),
});