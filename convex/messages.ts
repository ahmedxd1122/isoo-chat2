import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listConversations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const userConversations = await ctx.db.query("conversations").collect();

    const conversations = userConversations.filter((c) =>
      c.participants.includes(userId)
    );

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participants.find(
          (p) => p !== userId
        )!;
        const otherUser = await ctx.db.get(otherParticipantId);
        const lastMessage = await ctx.db
          .query("privateMessages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .first();
        return {
          ...conversation,
          otherUser,
          lastMessage,
        };
      })
    );

    return conversationsWithDetails;
  },
});

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("privateMessages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const createConversation = mutation({
  args: { participantId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const participants = [userId, args.participantId].sort();

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) => q.eq("participants", participants))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("conversations", {
      participants,
    });
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("Not authenticated");

    await ctx.db.insert("privateMessages", {
      conversationId: args.conversationId,
      authorId,
      text: args.text,
    });
  },
});
