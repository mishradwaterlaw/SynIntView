// convex/interviews.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.id("users"),
    interviewerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("interviews", {
      ...args,
      status: "upcoming", // Explicitly set initial status
    });
  },
});


export const getInterviewerList = query({
  args: { interviewerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .filter((q) => q.eq(q.field("interviewerId"), args.interviewerId))
      .collect();
  },
});

// convex/interviews.ts

export const updateInterviewNotes = mutation({
  args: {
    id: v.id("interviews"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { notes: args.notes });
  },
});

// convex/interviews.ts

// ... keep your existing createInterview and updateInterviewNotes functions ...

export const getInterviewById = query({
  args: { id: v.id("interviews") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// convex/interviews.ts
export const finishInterview = mutation({
  args: { id: v.id("interviews") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "completed" });
  },
});

// convex/interviews.ts
export const updateCode = mutation({
  args: { id: v.id("interviews"), code: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { code: args.code });
  },
});