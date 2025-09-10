import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("gifts").collect();
  },
});

export const getLatestAnnouncement = query({
  handler: async (ctx) => {
    return await ctx.db.query("globalAnnouncements").order("desc").first();
  },
});
