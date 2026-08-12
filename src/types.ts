export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageType =
  | 'text'
  | 'image'
  | 'audio'
  | 'voice_note'
  | 'document'
  | 'poll'
  | 'location'
  | 'contact';

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string; // ISO string or format "10:30 ص"
  type: MessageType;
  status: MessageStatus;
  isPinned?: boolean;
  isStarred?: boolean;
  replyToMessage?: {
    id: string;
    senderName: string;
    content: string;
  };
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number; // seconds
  pollTitle?: string;
  pollOptions?: PollOption[];
  location?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  statusText: string;
  isOnline: boolean;
  lastSeen?: string;
  isAI?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  isAI?: boolean;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  participants: User[];
  description?: string;
  lastMessage?: Message;
  typingText?: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type?: 'text' | 'image';
  mediaUrl?: string;
  caption?: string;
  text?: string;
  backgroundColor?: string;
  timestamp: string;
  viewed: boolean;
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followersCount: string;
  description: string;
  lastUpdate: string;
  isFollowing: boolean;
  unread: boolean;
}

export interface ActiveCall {
  id: string;
  chatId: string;
  contact: User;
  type: 'voice' | 'video';
  isIncoming: boolean;
  duration: number; // in seconds
  isMuted: boolean;
  isVideoOff: boolean;
  status: 'ringing' | 'connected' | 'ended';
}
