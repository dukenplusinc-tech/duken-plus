'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { IonButton } from '@ionic/react';
import { ArrowUp, Camera, MoreVertical, X } from 'lucide-react';

import { useChatMessages } from '@/lib/entities/chat/hooks/useChatMessages';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page/header';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ChatImagePicker } from '@/lib/entities/chat/components/chat-image-picker';
import { useImageViewer } from '@/lib/composite/image/viewer/context';

export function ChatRoom() {
  const { messages, sendMessage } = useChatMessages();
  const { data: shop } = useShop();
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const imageViewer = useImageViewer();
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !image) return;

    await sendMessage(newMessage, image || undefined);
    setNewMessage('');
    setImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelected = (dataUrl: string) => {
    setImage(dataUrl);
    setPickerOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        className="mb-4"
        right={<IonButton color="success">{shop?.title || 'STORE'}</IonButton>}
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

        {messages.map((message) => {
          const isOwn = message.shop_id === shop?.id;

          const sender = isOwn
            ? 'Вы'
            : message.shop_title || shop?.title || '---';

          const time = message.created_at
            ? new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <div
              key={message.id}
              className={`mb-4 ${isOwn ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}
            >
              <Card
                className={`border-0 shadow-sm overflow-hidden ${isOwn ? 'bg-green-100' : 'bg-white'}`}
              >
                <div
                  className={`border-b ${isOwn ? 'bg-green-200' : 'bg-gray-200'} p-2 flex justify-between items-center`}
                >
                  <span className="font-medium">{sender}</span>
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
                      align={isOwn ? 'end' : 'start'}
                    >
                      <div className="flex flex-col">
                        {isOwn ? (
                          <>
                            <Button
                              variant="ghost"
                              className="justify-start font-medium h-10 px-4 hover:bg-green-100"
                            >
                              Изменить
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-10 font-medium px-4 hover:bg-red-100"
                            >
                              Удалить у всех
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              className="justify-start font-medium h-10 px-4 hover:bg-green-100"
                            >
                              Ответить
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start font-medium h-10 px-4 hover:bg-red-100"
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.image && (
                    <div className="mt-2">
                      <img
                        src={message.image || '/placeholder.svg'}
                        alt="Message attachment"
                        className="max-w-xs max-h-60 cursor-pointer rounded-md border border-gray-200"
                        onClick={() => imageViewer.openViewer(message.image!)}
                      />
                    </div>
                  )}
                  <div className="text-right mt-1 text-xs text-gray-500">
                    {time}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Message Input */}
      <Card className="rounded-none border-x-0 border-b-0 mt-auto">
        <CardContent className="p-3">
          <div className="flex items-end">
            <div className="flex-1 relative">
              {image && (
                <div className="mb-2 relative max-w-[200px]">
                  <img
                    src={image}
                    alt="preview"
                    className="rounded-md border border-gray-200 max-h-32 cursor-pointer"
                    onClick={() => imageViewer.openViewer(image)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2"
                    onClick={() => setImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Сообщение..."
                className="resize-none min-h-[40px] max-h-[120px] pl-16 pr-24 border-2 border-gray-300 rounded-md"
              />
              <div className="absolute left-3 bottom-0 flex items-center h-full">
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 p-0 rounded-full"
                    >
                      <Camera className="h-6 w-6 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ChatImagePicker onImage={handleImageSelected} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="absolute right-3 bottom-0 flex items-center h-full pointer-events-none">
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !image}
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
