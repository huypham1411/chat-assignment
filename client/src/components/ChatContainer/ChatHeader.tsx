import { useChatStore } from '../../store/useChatStore';
import { X } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {/* <img
                src={selectedUser?.profilePic || '/avatar.png'}
                alt={selectedUser?.fullName}
              /> */}
            </div>
          </div>

          {/* User info */}
          {selectedUser && (
            <div>
              <h3 className="font-medium">{selectedUser.username}</h3>
              <p className="text-sm text-base-content/70">
                {selectedUser.online ? 'Online' : 'Offline'}
              </p>
            </div>
          )}
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
