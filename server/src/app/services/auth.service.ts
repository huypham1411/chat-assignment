import { User } from '@nx-chat-assignment/shared-models';
import { v4 as uuidv4 } from 'uuid';
import { ChatRepository } from '../repositories/chat.repository';

export const AuthService = {
  login: (username: string): User => {
    const existingUser = ChatRepository.getUsersOnline().find(
      (u) => u.username === username
    );

    // For new users
    if (!existingUser) {
      const newUser: User = { id: uuidv4(), username, online: true };
      ChatRepository.addUser(newUser);
      return newUser;
    }

    // For existing users
    existingUser.online = true;
    return existingUser;
  },

  logout: (userId: string) => {
    const user = ChatRepository.getUsersOnline().find((u) => u.id === userId);

    if (!user) {
      return { error: 'User not found' };
    }

    ChatRepository.removeUser(userId);
    return { message: 'User logged out' };
  },
};
