import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import MessageSkeleton from './Skeleton/MesageSkeleton';
import MessageInput from './MesageInput';
import { formatMessageTime } from '../../utils/formatMessageTime';

const ChatContainer = () => {
  const {
    messages,
    isMessagesLoading,
    getChatHistory,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (selectedUser && authUser) {
      getChatHistory(authUser.id, selectedUser.id);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getChatHistory, authUser, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />{' '}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`chat ${
              message.sender.id === authUser?.id ? 'chat-end' : 'chat-start'
            }`}
            ref={
              index === messages.length - 1
                ? (messageEndRef as React.RefObject<HTMLDivElement>)
                : undefined
            }
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src="/image/avatar.png" alt="avt" />
              </div>
            </div>
            <div className="chat-header mb-1">
              <span className="font-bold mr-2">
                {message.sender.id === authUser?.id
                  ? authUser.username
                  : selectedUser?.username}
              </span>
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.timestamp)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                message.sender.id === authUser?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
