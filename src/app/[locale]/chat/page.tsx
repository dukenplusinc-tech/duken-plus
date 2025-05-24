import type { Metadata } from 'next';

import { ChatRoom } from '@/lib/entities/chat/containers/chat-room';

export const metadata: Metadata = {
  title: 'Chat',
  description: '...',
};

export default async function ChatPage() {
  return <ChatRoom />;
}
