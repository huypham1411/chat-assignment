import { create } from 'zustand';
import { axiosClient } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

interface AuthStoreState {
  isLoggingIn: boolean;
  onlineUsers: string[];
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,
  authUser: null,
  isUpdatingProfile: false,

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosClient.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
      toast.error((error as any).response.data.message);
      get().connectSocket();
    } catch (error) {
      if (error instanceof Error && error.response) {
        toast.error((error as any).response.data.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  //   connectSocket: () => {
  //     const { authUser } = get();
  //     if (!authUser || get().socket?.connected) return;

  //     const socket = io(BASE_URL, {
  //       query: {
  //         userId: authUser._id,
  //       },
  //     });
  //     socket.connect();

  //     set({ socket: socket });

  //     socket.on("getOnlineUsers", (userIds) => {
  //       set({ onlineUsers: userIds });
  //     });
  //   },
  //   disconnectSocket: () => {
  //     if (get().socket?.connected) get().socket.disconnect();
  //   },
}));
