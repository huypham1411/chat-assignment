import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosClient } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { getErrorMessage } from '../utils/getErrorMessage';
import { Socket } from 'socket.io-client';

export type User = {
  id: string;
  username: string;
  online: boolean;
};

export type Message = {
  id: string;
  sender: User;
  receiver: User;
  message: string;
  timestamp: number;
};

type ChatStore = {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  socket: Socket | null;

  // Methods
  getOnlineUsers: () => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  getChatHistory: (userId: string, receiverId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  socket: useAuthStore.getState().socket || null,

  getOnlineUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosClient.get('/users/online');
      set({ users: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUsersLoading: false });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  getChatHistory: async (userId, receiverId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosClient.get(
        `/messages/history/${userId}/${receiverId}`
      );
      set({ messages: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // First, add a new method to handle message subscription
  subscribeToMessages: () => {
    const { socket, selectedUser } = get();
    const currentUser = useAuthStore.getState().authUser;

    if (!socket || !selectedUser || !currentUser) return;

    socket.on('message:receive', (response) => {
      const newMessage = response.data;
      set((state) => ({
        messages: state.messages.some((msg) => msg.id === newMessage.id)
          ? state.messages
          : [...state.messages, newMessage],
      }));
    });
  },

  sendMessage: async (message) => {
    const { socket, selectedUser } = get();
    const currentUser = useAuthStore.getState().authUser;

    if (!socket || !selectedUser || !currentUser) return;

    socket.emit('message:send', {
      receiver: selectedUser,
      message,
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off('message:receive');
  },
}));

useAuthStore.subscribe((state) => {
  useChatStore.setState({ socket: state.socket });
});
