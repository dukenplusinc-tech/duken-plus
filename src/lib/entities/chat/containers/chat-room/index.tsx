'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { IonButton } from '@ionic/react';
import { ArrowUp, Camera, MapPin, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page/header';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  image?: string;
  isOwn: boolean;
}

export function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'маг. Южный',
      text: 'Всем привет!',
      time: '13:00',
      isOwn: false,
    },
    {
      id: '2',
      sender: 'маг. Аян',
      text: 'Привет!',
      time: '13:05',
      isOwn: false,
    },
    {
      id: '3',
      sender: 'маг. Юбилейный',
      text: 'Всем привет!',
      time: '13:07',
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tgoSQwz5GyOxwhqnnF6UaP76gtx99g.png',
      isOwn: false,
    },
    {
      id: '4',
      sender: 'Вы',
      text: 'Привет!',
      time: '13:10',
      isOwn: true,
    },
    {
      id: '5',
      sender: 'Вы',
      text: 'Всем удачной торговли!',
      time: '13:15',
      isOwn: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`; // Max height of 120px
    }
  }, [newMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: 'Вы',
        text: newMessage,
        time: `${hours}:${minutes}`,
        isOwn: true,
      },
    ]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        className="mb-4"
        right={<IonButton color="success">STORE</IonButton>}
      >
        CHAT
      </PageHeader>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full text-sm">
            сегодня
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.isOwn ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}
          >
            <Card
              className={`border-0 shadow-sm overflow-hidden ${message.isOwn ? 'bg-green-100' : 'bg-white'}`}
            >
              <div
                className={`border-b ${message.isOwn ? 'bg-green-200' : 'bg-gray-200'} p-2 flex justify-between items-center`}
              >
                <span className="font-medium">{message.sender}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-black/10"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align={message.isOwn ? 'end' : 'start'}
                  >
                    <div className="flex flex-col">
                      {message.isOwn ? (
                        <>
                          <Button
                            variant="ghost"
                            className="justify-start h-10 px-4 hover:bg-green-100"
                          >
                            Изменить
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start h-10 px-4 hover:bg-red-100"
                          >
                            Удалить у всех
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            className="justify-start h-10 px-4 hover:bg-green-100"
                          >
                            Ответить
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start h-10 px-4 hover:bg-red-100"
                          >
                            Пожаловаться
                          </Button>
                        </>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <CardContent className="p-3">
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.image && (
                  <div className="mt-2">
                    <img
                      src={message.image || '/placeholder.svg'}
                      alt="Message attachment"
                      className="max-w-full rounded-md border border-gray-200"
                    />
                  </div>
                )}
                <div className="text-right mt-1 text-xs text-gray-500">
                  {message.time}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Message Input */}
      <Card className="rounded-none border-x-0 border-b-0 mt-auto">
        <CardContent className="p-3">
          <div className="flex items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Сообщение..."
                className="resize-none min-h-[40px] max-h-[120px] pl-16 pr-24 border-2 border-gray-300 rounded-md"
              />
              <div className="absolute left-3 bottom-0 flex items-center h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 p-0 rounded-full"
                >
                  <Camera className="h-6 w-6 text-gray-500" />
                </Button>
              </div>
              <div className="absolute right-3 bottom-0 flex items-center h-full pointer-events-none">
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-8 px-3 py-1 bg-success hover:bg-success/90 text-white rounded-md pointer-events-auto flex items-center gap-1"
                >
                  <span>Send</span>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
