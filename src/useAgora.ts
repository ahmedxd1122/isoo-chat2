import { useState, useEffect, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export const useAgora = (
  client: IAgoraRTCClient | null,
  appId: string,
  channelName: string,
  token: string | null,
  userId: string
) => {
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeakersMuted, setIsSpeakersMuted] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const updateSpeakingStatus = useMutation(api.rooms.updateSpeakingStatus);

  useEffect(() => {
    if (!client || !token || !channelName) return;

    const join = async () => {
      if (isJoining) return;
      setIsJoining(true);
      try {
        await client.join(appId, channelName, token, userId);

        const track = await AgoraRTC.createMicrophoneAudioTrack();
        track.setMuted(true);
        await client.publish([track]);
        setLocalAudioTrack(track);
      } catch (error) {
        console.error("Failed to join Agora channel", error);
      } finally {
        setIsJoining(false);
      }
    };

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video"
    ) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
      setRemoteUsers((prevUsers) => [...prevUsers, user]);
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
    };

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prevUsers) => [...prevUsers, user]);
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
    };

    join();

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
      localAudioTrack?.close();
      client.leave();
    };
  }, [client, token, channelName, appId, userId]);

  const toggleMute = async () => {
    if (!localAudioTrack) return;
    const newMutedState = !isMuted;
    await localAudioTrack.setMuted(newMutedState);
    setIsMuted(newMutedState);
    updateSpeakingStatus({ roomId: channelName as Id<"rooms">, isSpeaking: !newMutedState });
  };

  const toggleSpeakers = () => {
    const newSpeakersMutedState = !isSpeakersMuted;
    remoteUsers.forEach((user) => {
      user.audioTrack?.setVolume(newSpeakersMutedState ? 0 : 100);
    });
    setIsSpeakersMuted(newSpeakersMutedState);
  };

  return {
    localAudioTrack,
    remoteUsers,
    isMuted,
    isSpeakersMuted,
    toggleMute,
    toggleSpeakers,
  };
};
