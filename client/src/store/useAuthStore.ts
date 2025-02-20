import { create } from 'zustand';
import { axiosClient } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { getErrorMessage } from '../utils/getErrorMessage.js';

type User<T = Record<string, unknown>> = {
  id: string;
  username: string;
  online: boolean;
} & T;

type AuthStoreState = {
  isLoggingIn: boolean;
  authUser: User | null;
  login: (data: { username: string }) => Promise<void>;
  logout: (data: { userId: string }) => Promise<void>;
  setAuthUser: (user: User | null) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  socket?: Socket;
  onlineUsers: User[];
};
export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isLoggingIn: false,
  onlineUsers: [],
  authUser: null,
  login: async (data: { username: string }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosClient.post('/auth/login', data);
      if (res.data) {
        set({ authUser: res.data });
        sessionStorage.setItem('authUser', JSON.stringify(res.data));
        toast.success('Logged in successfully');
        get().connectSocket();
      }
    } catch (error) {
      if (getErrorMessage(error)) {
        toast.error(getErrorMessage(error));
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async (data: { userId: string }) => {
    try {
      await axiosClient.post('/auth/logout', data);
      set({ authUser: null });
      sessionStorage.removeItem('authUser');
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error) {
      if (getErrorMessage(error)) {
        toast.error(getErrorMessage(error));
      }
    }
  },

  setAuthUser: (user: User | null) => {
    set({ authUser: user });
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;

    const socket = io('http://localhost:4000', {
      query: {
        userId: authUser.id,
      },
    });
    socket.connect();
    set({ socket });

    socket.emit('user:login', authUser.username);

    socket.on('usersOnline', (response: { event: string; data: User[] }) => {
      set({ onlineUsers: response.data });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
  },
}));
