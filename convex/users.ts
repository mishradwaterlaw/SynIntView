// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) return existingUser._id;

    // If not, create them with a default role
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      image: args.image,
      role: "candidate", // Default role
    });
  },
});

// New Query: Get a specific user's role and data by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// New Query: Get all users (useful for selecting candidates in the scheduler)
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// convex/users.ts

// This query fetches all users except the person currently logged in.
export const getCandidates = query({
  args: { currentUserEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("email"), args.currentUserEmail))
      .collect();
  },
});