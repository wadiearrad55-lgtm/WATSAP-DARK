import React, { useState, useEffect } from 'react';
import {
  CURRENT_USER,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STATUSES,
  INITIAL_CHANNELS,
  INITIAL_USERS,
} from './data/mockData';
import { Chat, Message, StatusStory, Channel, User, ActiveCall } from './types';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { StatusViewer } from './components/StatusViewer';
import { ChannelsView } from './components/ChannelsView';
import { CallModal } from './components/CallModal';
import { PollModal } from './components/PollModal';
import { NewChatModal } from './components/NewChatModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { SettingsModal } from './components/SettingsModal';
import { playMessageSentSound, playMessageReceivedSound } from './utils/soundEffects';
import { MessageSquare, Bot } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_ai');
  const [statuses, setStatuses] = useState<StatusStory[]>(INITIAL_STATUSES);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [activeTab, setActiveTab] = useState<'chats' | 'status' | 'channels'>('chats');

  // UI Modals & Drawers state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false);
  const [showPollModal, setShowPollModal] = useState<boolean>(false);
  const [replyTargetMessage, setReplyTargetMessage] = useState<Message | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const activeMessages = activeChatId ? messagesMap[activeChatId] || [] : [];

  // Toggle Dark Mode class on document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle sending a message
  const handleSendMessage = async (
    content: string,
    type: Message['type'] = 'text',
    extraData: any = {}
  ) => {
    if (!activeChatId) return;

    const newMsgId = `msg_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg: Message = {
      id: newMsgId,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp,
      type,
      status: 'sent',
      replyToMessage: replyTargetMessage
        ? {
            id: replyTargetMessage.id,
            senderName: replyTargetMessage.senderName,
            content: replyTargetMessage.content,
          }
        : undefined,
      ...extraData,
    };

    playMessageSentSound();

    // Add message to chat list
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update last message in chat preview
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMessage: newMsg,
            }
          : c
      )
    );

    setReplyTargetMessage(null);

    // Check if target chat is Gemini / Meta AI or automatic bot
    if (activeChat?.isAI) {
      // Set typing indicator
      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, typingText: 'يكتب الآن...' } : c))
      );

      try {
        const history = (messagesMap[activeChatId] || []).map((m) => ({
          role: m.senderId === currentUser.id ? 'user' : 'model',
          content: m.content,
        }));
        history.push({ role: 'user', content });

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            image: extraData.mediaUrl,
          }),
        });

        const data = await response.json();
        const aiReply = data.reply || 'أعتذر، حدث خطأ أثناء معالجة الطلب.';

        const aiMsg: Message = {
          id: `msg_ai_${Date.now()}`,
          chatId: activeChatId,
          senderId: 'ai_assistant',
          senderName: 'Meta AI',
          content: aiReply,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'read',
        };

        playMessageReceivedSound();

        setMessagesMap((prev) => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), aiMsg],
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  typingText: undefined,
                  lastMessage: aiMsg,
                }
              : c
          )
        );
      } catch (err) {
        console.error(err);
        setChats((prev) =>
          prev.map((c) => (c.id === activeChatId ? { ...c, typingText: undefined } : c))
        );
      }
    } else if (activeChat && !activeChat.isGroup) {
      // Simulate contact auto-reply after 2 seconds for interactive feel!
      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          chatId: activeChatId,
          senderId: activeChat.participants.find((p) => p.id !== currentUser.id)?.id || 'user_other',
          senderName: activeChat.name,
          content: 'وصلتني رسالتك! سأرد عليك بالتفصيل فور انتهائي من العمل 👍',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'read',
        };

        playMessageReceivedSound();

        setMessagesMap((prev) => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), replyMsg],
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  lastMessage: replyMsg,
                }
              : c
          )
        );
      }, 2000);
    }
  };

  // Vote on poll
  const handleVotePoll = (messageId: string, optionId: string) => {
    if (!activeChatId) return;

    setMessagesMap((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id === messageId && m.pollOptions) {
          const updatedOptions = m.pollOptions.map((opt) => {
            if (opt.id === optionId) {
              const hasVoted = opt.votes.includes(currentUser.id);
              const newVotes = hasVoted
                ? opt.votes.filter((id) => id !== currentUser.id)
                : [...opt.votes, currentUser.id];
              return { ...opt, votes: newVotes };
            }
            return opt;
          });
          return { ...m, pollOptions: updatedOptions };
        }
        return m;
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Add Reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeChatId) return;

    setMessagesMap((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id === messageId) {
          const existing = { ...(m.reactions || {}) };
          const userList = existing[emoji] || [];
          if (userList.includes(currentUser.id)) {
            existing[emoji] = userList.filter((id) => id !== currentUser.id);
            if (existing[emoji].length === 0) delete existing[emoji];
          } else {
            existing[emoji] = [...userList, currentUser.id];
          }
          return { ...m, reactions: existing };
        }
        return m;
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== messageId),
    }));
  };

  // Create new poll
  const handleCreatePoll = (question: string, options: string[]) => {
    const pollOptions = options.map((optText, idx) => ({
      id: `opt_${Date.now()}_${idx}`,
      text: optText,
      votes: [],
    }));

    handleSendMessage(question, 'poll', {
      pollTitle: question,
      pollOptions,
    });
  };

  // Start Call
  const handleStartCall = (type: 'voice' | 'video') => {
    if (!activeChat) return;
    const contactUser = activeChat.participants.find((p) => p.id !== currentUser.id) || INITIAL_USERS.user_ahmed;
    setActiveCall({
      id: `call_${Date.now()}`,
      chatId: activeChat.id,
      contact: contactUser,
      type,
      isIncoming: false,
      duration: 0,
      isMuted: false,
      isVideoOff: false,
      status: 'ringing',
    });
  };

  // Pin / Unpin chat
  const handlePinChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Archive chat
  const handleArchiveChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isArchived: !c.isArchived } : c))
    );
  };

  // Create or Select custom user
  const handleSelectUser = (user: User) => {
    const existingChat = chats.find((c) => !c.isGroup && c.participants.some((p) => p.id === user.id));
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newChatId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        name: user.name,
        avatar: user.avatar,
        isGroup: false,
        unreadCount: 0,
        participants: [currentUser, user],
      };
      setChats([newChat, ...chats]);
      setActiveChatId(newChatId);
    }
  };

  // Create Group
  const handleCreateGroup = (name: string, members: User[]) => {
    const newChatId = `chat_group_${Date.now()}`;
    const newGroupChat: Chat = {
      id: newChatId,
      name,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      isGroup: true,
      unreadCount: 0,
      participants: [currentUser, ...members],
      description: `مجموعة ${name}`,
    };
    setChats([newGroupChat, ...chats]);
    setActiveChatId(newChatId);
  };

  // Toggle Channel follow
  const handleToggleChannelFollow = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, isFollowing: !ch.isFollowing } : ch))
    );
  };

  // Add status story
  const handleAddStatus = (newStatus: Partial<StatusStory>) => {
    const story: StatusStory = {
      id: `st_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: 'الآن',
      viewed: true,
      type: 'text',
      ...newStatus,
    };
    setStatuses([story, ...statuses]);
  };

  // Reply to status story
  const handleReplyStatus = (story: StatusStory, text: string) => {
    handleSendMessage(`الرد على حالتك: ${text}`, 'text');
    setActiveTab('chats');
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans ${
      isDarkMode ? 'bg-[#0c1317] text-gray-100' : 'bg-[#d1d7db] text-gray-900'
    }`}>
      
      {/* Outer App Frame Padding for Web Feel */}
      <div className="w-full h-full flex overflow-hidden max-w-[1700px] mx-auto shadow-2xl">
        
        {/* Left Navigation & Chat List Sidebar */}
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setChats((prev) =>
              prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
            );
          }}
          currentUser={currentUser}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          unreadStatusesCount={statuses.filter((s) => !s.viewed).length}
          onOpenNewChatModal={() => setShowNewChatModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenProfile={() => setShowProfileDrawer(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onPinChat={handlePinChat}
          onArchiveChat={handleArchiveChat}
        />

        {/* Main Content Area according to active tab */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {activeTab === 'chats' && (
            activeChat ? (
              <div className="flex-1 flex flex-col h-full">
                <ChatWindow
                  chat={activeChat}
                  messages={activeMessages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onStartCall={handleStartCall}
                  onVotePoll={handleVotePoll}
                  onAddReaction={handleAddReaction}
                  onDeleteMessage={handleDeleteMessage}
                  onReplyMessage={setReplyTargetMessage}
                  replyTargetMessage={replyTargetMessage}
                  onClearReplyTarget={() => setReplyTargetMessage(null)}
                  isDarkMode={isDarkMode}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  replyTargetMessage={replyTargetMessage}
                  onClearReplyTarget={() => setReplyTargetMessage(null)}
                  onOpenPollModal={() => setShowPollModal(true)}
                  isDarkMode={isDarkMode}
                />
              </div>
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center border-r ${
                isDarkMode ? 'bg-[#222e35] border-gray-800' : 'bg-[#f0f2f5] border-gray-200'
              }`}>
                <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                  <MessageSquare className="w-16 h-16 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">واتساب ويب (WhatsApp Web)</h1>
                <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                  أرسل واستقبل الرسائل والمكالمات، ودردش مع المساعد الذكي Meta AI مباشرةً بكل سهولة.
                </p>
              </div>
            )
          )}

          {activeTab === 'status' && (
            <StatusViewer
              statuses={statuses}
              currentUser={currentUser}
              onClose={() => setActiveTab('chats')}
              onAddStatus={handleAddStatus}
              onReplyStatus={handleReplyStatus}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'channels' && (
            <ChannelsView
              channels={channels}
              onToggleFollow={handleToggleChannelFollow}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      {activeCall && (
        <CallModal
          call={activeCall}
          onEndCall={() => setActiveCall(null)}
          onToggleMute={() => setActiveCall({ ...activeCall, isMuted: !activeCall.isMuted })}
          onToggleVideo={() => setActiveCall({ ...activeCall, isVideoOff: !activeCall.isVideoOff })}
        />
      )}

      {showPollModal && (
        <PollModal
          onClose={() => setShowPollModal(false)}
          onCreatePoll={handleCreatePoll}
          isDarkMode={isDarkMode}
        />
      )}

      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onSelectUser={handleSelectUser}
          onCreateGroup={handleCreateGroup}
          availableUsers={Object.values(INITIAL_USERS)}
          isDarkMode={isDarkMode}
        />
      )}

      {showProfileDrawer && (
        <ProfileDrawer
          currentUser={currentUser}
          onClose={() => setShowProfileDrawer(false)}
          onUpdateProfile={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
          isDarkMode={isDarkMode}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}
    </div>
  );
}
