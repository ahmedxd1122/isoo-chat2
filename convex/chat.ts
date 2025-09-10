import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

export const list = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(100);
    messages.reverse();

    const authorIds = [
      ...new Set(
        messages.map((m) => m.authorId).filter(Boolean) as Id<"users">[]
      ),
    ];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a])
    );

    const authorProfiles = await Promise.all(
      authorIds.map((id) =>
        ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", id))
          .unique()
      )
    );
    const authorProfileMap = new Map(
      authorProfiles.filter(Boolean).map((p) => [p!.userId, p])
    );

    const authorImageUrls = await Promise.all(
      authorProfiles
        .filter((p) => p?.imageId)
        .map((p) => ctx.storage.getUrl(p!.imageId!))
    );
    const authorImageUrlMap = new Map(
      authorProfiles
        .filter((p) => p?.imageId)
        .map((p, i) => [p!.userId, authorImageUrls[i]])
    );

    const giftIds = [
      ...new Set(
        messages.map((m) => m.giftId).filter(Boolean) as Id<"gifts">[]
      ),
    ];
    const gifts = await Promise.all(giftIds.map((id) => ctx.db.get(id)));
    const giftMap = new Map(gifts.filter(Boolean).map((g) => [g!._id, g]));

    const messagesWithDetails = messages.map((message) => {
      const author = message.authorId ? authorMap.get(message.authorId) : null;
      const authorProfile = message.authorId
        ? authorProfileMap.get(message.authorId)
        : null;
      const authorImageUrl = message.authorId
        ? authorImageUrlMap.get(message.authorId)
        : null;
      const gift = message.giftId ? giftMap.get(message.giftId) : null;
      return {
        ...message,
        author:
          author && authorProfile
            ? { ...author, ...authorProfile, imageUrl: authorImageUrl }
            : null,
        gift,
      };
    });

    return messagesWithDetails;
  },
});

export const send = mutation({
  args: {
    roomId: v.id("rooms"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    await ctx.db.insert("chatMessages", {
      authorId: userId,
      roomId: args.roomId,
      text: args.text,
    });
  },
});

export const sendGift = mutation({
  args: {
    roomId: v.id("rooms"),
    giftId: v.id("gifts"),
    recipientId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const gift = await ctx.db.get(args.giftId);
    if (!gift) {
      throw new Error("Gift not found");
    }
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!userProfile || (userProfile.coins ?? 0) < gift.price) {
      throw new Error("Not enough coins");
    }

    await ctx.db.patch(userProfile._id, {
      coins: (userProfile.coins ?? 0) - gift.price,
    });

    await ctx.db.insert("chatMessages", {
      authorId: userId,
      roomId: args.roomId,
      giftId: args.giftId,
      recipientId: args.recipientId,
    });
  },
});
