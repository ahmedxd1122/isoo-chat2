import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        const authorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", post.authorId))
          .unique();
        const authorImageUrl = authorProfile?.imageId
          ? await ctx.storage.getUrl(authorProfile.imageId)
          : null;
        const postImageUrl = post.imageId
          ? await ctx.storage.getUrl(post.imageId)
          : null;

        const comments = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .order("desc")
          .collect();
        const hydratedComments = await Promise.all(
          comments.map(async (comment) => {
            const commentAuthor = await ctx.db.get(comment.authorId);
            const commentAuthorProfile = await ctx.db
              .query("userProfiles")
              .withIndex("by_userId", (q) => q.eq("userId", comment.authorId))
              .unique();
            const commentAuthorImageUrl = commentAuthorProfile?.imageId
              ? await ctx.storage.getUrl(commentAuthorProfile.imageId)
              : null;
            return {
              ...comment,
              authorName:
                commentAuthorProfile?.name ?? commentAuthor?.name ?? "Unknown",
              authorImage: commentAuthorImageUrl,
            };
          })
        );

        return {
          ...post,
          authorName: authorProfile?.name ?? author?.name ?? "Unknown",
          authorImage: authorImageUrl,
          imageUrl: postImageUrl,
          comments: hydratedComments,
          commentCount: comments.length,
        };
      })
    );
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
    return Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        const authorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", comment.authorId))
          .unique();
        const authorImageUrl = authorProfile?.imageId
          ? await ctx.storage.getUrl(authorProfile.imageId)
          : null;
        return {
          ...comment,
          authorName: authorProfile?.name ?? author?.name ?? "Unknown",
          authorImage: authorImageUrl,
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    text: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("Not authenticated");

    await ctx.db.insert("posts", {
      authorId,
      text: args.text,
      imageId: args.imageId,
      reactions: [],
    });
  },
});

export const react = mutation({
  args: {
    postId: v.id("posts"),
    type: v.union(
      v.literal("like"),
      v.literal("love"),
      v.literal("laugh"),
      v.literal("sad")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const existingReactionIndex = post.reactions.findIndex(
      (r) => r.userId === userId
    );
    if (existingReactionIndex !== -1) {
      if (post.reactions[existingReactionIndex].type === args.type) {
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        post.reactions[existingReactionIndex].type = args.type;
      }
    } else {
      post.reactions.push({ userId, type: args.type });
    }

    await ctx.db.patch(post._id, { reactions: post.reactions });
  },
});

export const comment = mutation({
  args: {
    postId: v.id("posts"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("Not authenticated");

    await ctx.db.insert("comments", {
      authorId,
      postId: args.postId,
      text: args.text,
    });
  },
});
