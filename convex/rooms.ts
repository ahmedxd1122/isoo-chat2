import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

// A helper function to get the owner ID, handling migration
const getOwnerId = (room: Doc<"rooms">) => {
  return room.ownerId ?? (room as any).creatorId;
};

export const list = query({
  handler: async (ctx) => {
    const rooms = await ctx.db.query("rooms").order("desc").collect();
    return Promise.all(
      rooms.map(async (room) => {
        const ownerId = getOwnerId(room);
        if (!ownerId) {
          return { ...room, ownerName: "Unknown" };
        }
        const owner = await ctx.db.get(ownerId);
        const ownerProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", ownerId))
          .unique();
        return {
          ...room,
          ownerName: ownerProfile?.name ?? owner?.name,
        };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room) {
      return null;
    }

    const seats = room.seats
      ? await Promise.all(
          room.seats.map(async (userId) => {
            if (!userId) return null;
            const user = await ctx.db.get(userId);
            const profile = await ctx.db
              .query("userProfiles")
              .withIndex("by_userId", (q) => q.eq("userId", userId))
              .unique();
            const imageUrl = profile?.imageId
              ? await ctx.storage.getUrl(profile.imageId)
              : null;
            return {
              name: profile?.name ?? user?.name,
              userId,
              imageUrl,
              level: profile?.level,
              isVip: profile?.isVip,
              displayId: profile?.displayId,
              frameUrl: profile?.frameUrl,
            };
          })
        )
      : [];

    return { ...room, seats, ownerId: getOwnerId(room) };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const ownerId = await getAuthUserId(ctx);
    if (!ownerId) throw new Error("Not authenticated");

    const ownerProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", ownerId))
      .unique();

    if (!ownerProfile) throw new Error("User profile not found");

    return await ctx.db.insert("rooms", {
      name: args.name,
      image: args.image,
      ownerId,
      displayId: ownerProfile.displayId,
      seats: Array(12).fill(null),
      admins: [],
      bannedUsers: [],
    });
  },
});

export const takeSeat = mutation({
  args: { roomId: v.id("rooms"), seatIndex: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const now = Date.now();
    const userBan = room.bannedUsers?.find(
      (b) => b.userId === userId && b.bannedUntil > now
    );
    if (userBan) {
      throw new Error(
        `You are banned from this room until ${new Date(
          userBan.bannedUntil
        ).toLocaleString()}`
      );
    }

    const seats = room.seats ?? Array(12).fill(null);
    if (args.seatIndex < 0 || args.seatIndex >= 12) {
      throw new Error("Invalid seat index");
    }
    if (seats[args.seatIndex] !== null) {
      throw new Error("Seat already taken");
    }
    // Clear user from any other seat
    const userSeat = seats.findIndex((id) => id === userId);
    if (userSeat !== -1) {
      seats[userSeat] = null;
    }
    seats[args.seatIndex] = userId;

    await ctx.db.patch(room._id, { seats });

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (userProfile) {
      await ctx.db.insert("chatMessages", {
        roomId: args.roomId,
        text: `${userProfile.isVip ? "VIP " : ""}${
          userProfile.name
        } has taken a seat.`,
        isSystemMessage: true,
      });
    }
  },
});

export const leaveSeat = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room || !room.seats) return;

    const seats = [...room.seats];
    const userSeat = seats.findIndex((id) => id === userId);
    if (userSeat !== -1) {
      seats[userSeat] = null;
      await ctx.db.patch(room._id, { seats, speakingSeatIndex: undefined });
    }
  },
});

export const updateSpeakingStatus = mutation({
  args: { roomId: v.id("rooms"), isSpeaking: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const room = await ctx.db.get(args.roomId);
    if (!room) return;

    const userSeatIndex = room.seats?.findIndex((id) => id === userId);
    if (userSeatIndex === undefined || userSeatIndex === -1) return;

    if (args.isSpeaking) {
      await ctx.db.patch(args.roomId, { speakingSeatIndex: userSeatIndex });
    } else {
      if (room.speakingSeatIndex === userSeatIndex) {
        await ctx.db.patch(args.roomId, { speakingSeatIndex: undefined });
      }
    }
  },
});

export const searchUsers = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query) {
      return [];
    }
    const usersByName = await ctx.db
      .query("userProfiles")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .take(5);

    const userByDisplayId = await ctx.db
      .query("userProfiles")
      .withIndex("by_displayId", (q) => q.eq("displayId", args.query))
      .first();

    const results = [...usersByName];
    if (userByDisplayId && !results.find((u) => u._id === userByDisplayId._id)) {
      results.push(userByDisplayId);
    }

    const hydratedResults = await Promise.all(
      results.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        const imageUrl = profile.imageId
          ? await ctx.storage.getUrl(profile.imageId)
          : null;
        return {
          ...user,
          ...profile,
          imageUrl,
        };
      })
    );

    return hydratedResults;
  },
});

export const appointAdmin = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (getOwnerId(room) !== currentUserId)
      throw new Error("Only the room owner can appoint admins.");

    const admins = room.admins ?? [];
    if (admins.includes(args.userId)) return;

    await ctx.db.patch(args.roomId, { admins: [...admins, args.userId] });
  },
});

export const removeAdmin = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (getOwnerId(room) !== currentUserId)
      throw new Error("Only the room owner can remove admins.");

    const admins = room.admins?.filter((id) => id !== args.userId) ?? [];
    await ctx.db.patch(args.roomId, { admins });
  },
});

export const kickUser = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    const isOwner = getOwnerId(room) === currentUserId;
    const isAdmin = room.admins?.includes(currentUserId);
    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to perform this action.");
    }

    const seats = [...(room.seats ?? [])];
    const userSeat = seats.findIndex((id) => id === args.userId);
    if (userSeat !== -1) {
      seats[userSeat] = null;
      await ctx.db.patch(room._id, { seats });

      const kickedUserProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .unique();
      await ctx.db.insert("chatMessages", {
        roomId: args.roomId,
        text: `${kickedUserProfile?.name ?? "A user"} has been kicked.`,
        isSystemMessage: true,
      });
    }
  },
});

export const banUser = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    durationMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    const isOwner = getOwnerId(room) === currentUserId;
    const isAdmin = room.admins?.includes(currentUserId);
    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to perform this action.");
    }

    const bannedUntil = Date.now() + args.durationMinutes * 60 * 1000;
    const bannedUsers =
      room.bannedUsers?.filter((u) => u.userId !== args.userId) ?? [];
    bannedUsers.push({ userId: args.userId, bannedUntil });

    const seats = [...(room.seats ?? [])];
    const userSeat = seats.findIndex((id) => id === args.userId);
    if (userSeat !== -1) {
      seats[userSeat] = null;
    }

    await ctx.db.patch(args.roomId, { bannedUsers, seats });

    const bannedUserProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    await ctx.db.insert("chatMessages", {
      roomId: args.roomId,
      text: `${
        bannedUserProfile?.name ?? "A user"
      } has been banned for ${args.durationMinutes} minutes.`,
      isSystemMessage: true,
    });
  },
});

export const unbanUser = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    const isOwner = getOwnerId(room) === currentUserId;
    const isAdmin = room.admins?.includes(currentUserId);
    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to perform this action.");
    }

    const bannedUsers =
      room.bannedUsers?.filter((u) => u.userId !== args.userId) ?? [];
    await ctx.db.patch(args.roomId, { bannedUsers });
  },
});
