import { useEffect, useState } from 'react';

import { Users } from 'lucide-react';
import SidebarSkeleton from './Skeleton/SidebarSkeleton';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = () => {
  const {
    getOnlineUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();

  useEffect(() => {
    if (!isUsersLoading) {
      getOnlineUsers();
    }
  }, [getOnlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {onlineUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
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
