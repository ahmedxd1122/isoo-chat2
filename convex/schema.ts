import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  rooms: defineTable({
    name: v.string(),
    image: v.string(),
    displayId: v.optional(v.string()),
    ownerId: v.optional(v.id("users")),
    creatorId: v.optional(v.id("users")), // Kept for migration
    admins: v.optional(v.array(v.id("users"))),
    bannedUsers: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          bannedUntil: v.number(),
        })
      )
    ),
    seats: v.optional(v.array(v.union(v.id("users"), v.null()))),
    speakingSeatIndex: v.optional(v.number()),
    lockedSeats: v.optional(v.array(v.boolean())),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_creatorId", ["creatorId"]),

  posts: defineTable({
    authorId: v.id("users"),
    text: v.string(),
    imageId: v.optional(v.id("_storage")),
    reactions: v.array(
      v.object({
        userId: v.id("users"),
        type: v.union(
          v.literal("like"),
          v.literal("love"),
          v.literal("laugh"),
          v.literal("sad")
        ),
      })
    ),
  }).index("by_authorId", ["authorId"]),

  comments: defineTable({
    authorId: v.id("users"),
    postId: v.id("posts"),
    text: v.string(),
  }).index("by_postId", ["postId"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    displayId: v.string(),
    name: v.optional(v.string()),
    gender: v.union(v.literal("male"), v.literal("female")),
    birthDate: v.string(),
    country: v.string(),
    imageId: v.optional(v.id("_storage")),
    backgroundImageId: v.optional(v.id("_storage")),
    level: v.optional(v.number()),
    coins: v.optional(v.number()),
    isVip: v.optional(v.boolean()),
    frameUrl: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_displayId", ["displayId"])
    .searchIndex("search_name", { searchField: "name" }),

  chatMessages: defineTable({
    authorId: v.optional(v.id("users")),
    roomId: v.id("rooms"),
    text: v.optional(v.string()),
    giftId: v.optional(v.id("gifts")),
    recipientId: v.optional(v.id("users")),
    isSystemMessage: v.optional(v.boolean()),
  }).index("by_roomId", ["roomId"]),

  followers: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_followingId", ["followingId"])
    .index("by_followerId_followingId", ["followerId", "followingId"]),

  conversations: defineTable({
    participants: v.array(v.id("users")),
  }).index("by_participants", ["participants"]),

  privateMessages: defineTable({
    conversationId: v.id("conversations"),
    authorId: v.id("users"),
    text: v.string(),
  }).index("by_conversationId", ["conversationId"]),

  gifts: defineTable({
    name: v.string(),
    type: v.union(v.literal("png"), v.literal("mp4")),
    url: v.string(),
    price: v.number(),
  }),

  globalAnnouncements: defineTable({
    senderName: v.string(),
    recipientName: v.string(),
    giftName: v.string(),
    roomName: v.string(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
