import { useEffect, useState } from 'react';

import { Users } from 'lucide-react';
import SidebarSkeleton from './Skeleton/SidebarSkeleton';
import { useChatStore, User } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

type SocketResponse<T = unknown> = {
  event: string;
  data: T;
};
type MessageResponse = {
  id: string;
  sender: User;
  receiver: User;
  message: string;
  timestamp: number;
};

const Sidebar = () => {
  const {
    getOnlineUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers, authUser, socket } = useAuthStore();
  const [incommingMessage, setIncommingMessage] = useState<string[]>([]);
  useEffect(() => {
    if (!isUsersLoading) {
      getOnlineUsers();
    }
  }, [getOnlineUsers]);

  useEffect(() => {
    if (socket) {
      socket.on(
        'message:receive',
        (response: SocketResponse<MessageResponse>) => {
          if (response.data) {
            const { sender, receiver } = response.data;
            if (
              receiver.id === authUser?.id &&
              sender.id !== selectedUser?.id &&
              !incommingMessage.includes(sender.id)
            ) {
              setIncommingMessage((prev) => [...prev, sender.id]);
            }
          }
        }
      );
    }
    return () => {
      if (socket) socket.off('message:receive');
    };
  }, [socket, authUser?.id, selectedUser?.id, incommingMessage]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const sortedUsers = [...onlineUsers].sort((a, b) => {
    if (a.id === authUser?.id) return -1;
    if (b.id === authUser?.id) return 1;
    return 0;
  });

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {sortedUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setIncommingMessage((prev) =>
                prev.filter((id) => id !== user.id)
              );
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors relative
              ${
                selectedUser?.id === user.id
                  ? 'bg-base-300 ring-1 ring-base-300'
                  : ''
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={'/image/avatar.png'}
                alt={user.username}
                className="size-12 object-cover rounded-full"
              />
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
              />
              {user.id === authUser?.id && (
                <span className="absolute -top-2 -right-2 text-xs bg-base-300 px-1 rounded lg:hidden">
                  You
                </span>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">
                {user.username}
                {user.id === authUser?.id && <span>{`(You)`}</span>}
              </div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user) ? 'Online' : 'Offline'}
              </div>
            </div>

            {incommingMessage.includes(user.id) && (
              <div className="absolute right-1 bg-red-600 w-[20px] rounded-full top-0 md:top-5">
                !
              </div>
            )}
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
