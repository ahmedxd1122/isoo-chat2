"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { RtcTokenBuilder, RtcRole } from "agora-token";

export const generateToken = action({
  args: {
    channelName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      throw new Error(
        "Agora App ID or Certificate is not set in environment variables."
      );
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Token expiration time, 0 means it never expires
    const tokenExpiration = 0;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      args.channelName,
      user.subject, // Use Convex user subject as UID
      role,
      tokenExpiration,
      privilegeExpiredTs
    );

    return token;
  },
});
