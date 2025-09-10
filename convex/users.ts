import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) {
      return null;
    }
    const user = await ctx.db.get(userId);
    const imageUrl = profile.imageId
      ? await ctx.storage.getUrl(profile.imageId)
      : null;
    const backgroundImageUrl = profile.backgroundImageId
      ? await ctx.storage.getUrl(profile.backgroundImageId)
      : null;

    return {
      ...profile,
      name: user?.name ?? profile.name,
      image: user?.image,
      imageUrl,
      backgroundImageUrl,
    };
  },
});

export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile) {
      return null;
    }
    const imageUrl = profile.imageId
      ? await ctx.storage.getUrl(profile.imageId)
      : null;
    const backgroundImageUrl = profile.backgroundImageId
      ? await ctx.storage.getUrl(profile.backgroundImageId)
      : null;

    return {
      ...user,
      ...profile,
      imageUrl,
      backgroundImageUrl,
    };
  },
});

export const getProfileForPage = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const loggedInUserId = await getAuthUserId(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile) return null;

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .collect();

    const followers = await ctx.db
      .query("followers")
      .withIndex("by_followingId", (q) => q.eq("followingId", args.userId))
      .collect();
    const following = await ctx.db
      .query("followers")
      .withIndex("by_followerId_followingId", (q) =>
        q.eq("followerId", args.userId)
      )
      .collect();

    const isFollowing = loggedInUserId
      ? !!(await ctx.db
          .query("followers")
          .withIndex("by_followerId_followingId", (q) =>
            q.eq("followerId", loggedInUserId).eq("followingId", args.userId)
          )
          .first())
      : false;

    const imageUrl = profile.imageId
      ? await ctx.storage.getUrl(profile.imageId)
      : null;
    const backgroundImageUrl = profile.backgroundImageId
      ? await ctx.storage.getUrl(profile.backgroundImageId)
      : null;

    return {
      ...user,
      ...profile,
      imageUrl,
      backgroundImageUrl,
      posts,
      followers: followers.length,
      following: following.length,
      isFollowing,
    };
  },
});

export const getUserPopupInfo = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const loggedInUserId = await getAuthUserId(ctx);

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return null;

    const user = await ctx.db.get(args.userId);

    const imageUrl = profile.imageId
      ? await ctx.storage.getUrl(profile.imageId)
      : null;

    const isFollowing = loggedInUserId
      ? !!(await ctx.db
          .query("followers")
          .withIndex("by_followerId_followingId", (q) =>
            q.eq("followerId", loggedInUserId).eq("followingId", args.userId)
          )
          .first())
      : false;

    return {
      userId: profile.userId,
      name: profile.name ?? user?.name,
      displayId: profile.displayId,
      level: profile.level,
      isVip: profile.isVip,
      imageUrl,
      isFollowing,
    };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const completeProfile = mutation({
  args: {
    name: v.string(),
    gender: v.union(v.literal("male"), v.literal("female")),
    birthDate: v.string(),
    country: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const displayId = Math.random().toString(36).substring(2, 8).toUpperCase();

    await ctx.db.insert("userProfiles", {
      userId,
      displayId,
      name: args.name,
      gender: args.gender,
      birthDate: args.birthDate,
      country: args.country,
      imageId: args.imageId,
      level: 1,
      coins: 1000,
      isVip: false,
    });

    await ctx.db.patch(userId, { name: args.name });
  },
});

export const follow = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followerId = await getAuthUserId(ctx);
    if (!followerId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("followers")
      .withIndex("by_followerId_followingId", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.userId)
      )
      .first();
    if (existing) return;

    await ctx.db.insert("followers", {
      followerId,
      followingId: args.userId,
    });
  },
});

export const unfollow = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followerId = await getAuthUserId(ctx);
    if (!followerId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("followers")
      .withIndex("by_followerId_followingId", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.userId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
