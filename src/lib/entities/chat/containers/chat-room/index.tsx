'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { location } from 'ionicons/icons';
import { ArrowUp, Camera, MoreVertical, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useImageViewer } from '@/lib/composite/image/viewer/context';
import { ChatImagePicker } from '@/lib/entities/chat/components/chat-image-picker';
import {
  useChatMessages,
  type ChatMessage,
} from '@/lib/entities/chat/hooks/useChatMessages';
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
import { toast } from '@/components/ui/use-toast';
import { FormatDate } from '@/components/date/format-date';

export function ChatRoom() {
  const t = useTranslations('chat');
  const {
    messages,
    sendMessage,
    loadOlder,
    hasMore,
    editMessage,
    deleteMessage,
    reportMessage,
  } = useChatMessages();
  const { data: shop } = useShop();
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const imageViewer = useImageViewer();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLockRef = useRef(false);

  const scrollToBottom = () => {
    scrollLockRef.current = true;

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        scrollLockRef.current = false;
      }, 3_000);
    });
  };

  const handleScroll = useCallback(async () => {
    // lock loading on scroll
    if (scrollLockRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container || container.scrollTop > 50 || !hasMore) return;
    const prevHeight = container.scrollHeight;
    await loadOlder();
    requestAnimationFrame(() => {
      if (container) {
        const diff = container.scrollHeight - prevHeight;
        container.scrollTop = diff <= 50 ? diff + 1 : diff;
      }
    });
  }, [loadOlder, hasMore]);

  const initialLoadedRef = useRef(false);

  useEffect(() => {
    if (!initialLoadedRef.current && messages.length) {
      initialLoadedRef.current = true;
      scrollToBottom();
    }
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
    if (editing) {
      await editMessage(editing, newMessage, image);
      setEditing(null);
    } else {
      await sendMessage(newMessage, image || undefined, replyTo?.id ?? null);
    }
    setNewMessage('');
    setImage(null);
    setReplyTo(null);
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
        right={
          shop ? (
            <div className="flex items-center gap-2 pr-2">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
                <IonIcon icon={location} className="h-4 w-4 text-white" />

                <div className="flex flex-col leading-tight">
                  <span className="text-white font-semibold text-xs uppercase tracking-wide">
                    {shop.city}
                  </span>

                  <span className="text-white/80 text-[10px] uppercase tracking-wide">
                    {shop.title}
                  </span>
                </div>
              </div>
            </div>
          ) : null
        }
      >
        {t('page_title')}
      </PageHeader>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto px-3"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {Object.entries(
          messages.reduce(
            (acc, message) => {
              const date = message.created_at
                ? new Date(message.created_at).toISOString().split('T')[0]
                : 'unknown';
              acc[date] = acc[date] || [];
              acc[date].push(message);
              return acc;
            },
            {} as Record<string, ChatMessage[]>
          )
        ).map(([dateStr, group]) => {
          const d = new Date(dateStr);
          const today = new Date();
          const isToday =
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate();

          const label = isToday ? (
            t('today')
          ) : (
            <FormatDate format="PP">{dateStr}</FormatDate>
          );

          return (
            <div key={dateStr}>
              <div className="flex justify-center mb-4">
                <div className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full text-sm">
                  {label}
                </div>
              </div>

              {group.map((message) => {
                const isOwn = message.shop_id === shop?.id;

                const sender = isOwn
                  ? t('you')
                  : message.shop_title || shop?.title || '---';

                const time = message.created_at
                  ? new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                const replyMsg = message.reply_to
                  ? messages.find((m) => m.id === message.reply_to)
                  : null;

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
                                    onClick={() => {
                                      setNewMessage(message.content);
                                      setImage(message.image || null);
                                      setEditing(message.id);
                                      textareaRef.current?.focus();
                                    }}
                                  >
                                    {t('edit')}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="justify-start h-10 font-medium px-4 hover:bg-red-100"
                                    onClick={() => deleteMessage(message.id)}
                                  >
                                    {t('delete_for_all')}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    className="justify-start font-medium h-10 px-4 hover:bg-green-100"
                                    onClick={() => {
                                      setReplyTo(message);
                                      textareaRef.current?.focus();
                                    }}
                                  >
                                    {t('reply')}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="justify-start font-medium h-10 px-4 hover:bg-red-100"
                                    onClick={() => {
                                      reportMessage(message.id).then(() =>
                                        toast({
                                          description: t('report_confirmation'),
                                        })
                                      );
                                    }}
                                  >
                                    {t('report')}
                                  </Button>
                                </>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <CardContent className="p-3">
                        {replyMsg && (
                          <div className="border-l-2 pl-2 mb-1 text-xs text-gray-500">
                            <strong>
                              {replyMsg.shop_id === shop?.id
                                ? t('you')
                                : replyMsg.shop_title || shop?.title || '---'}
                            </strong>
                            : {replyMsg.content}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.image && (
                          <div className="mt-2">
                            <img
                              src={message.image || '/placeholder.svg'}
                              alt="Message attachment"
                              className="max-w-xs max-h-60 cursor-pointer rounded-md border border-gray-200"
                              onClick={() =>
                                imageViewer.openViewer(message.image!)
                              }
                            />
                          </div>
                        )}
                        <div className="text-right mt-1 text-xs text-gray-500">
                          {time}
                          {message.updated_at && (
                            <span className="ml-1">({t('edited')})</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
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
              {editing && (
                <div className="text-sm text-gray-500 mb-1 flex justify-between">
                  <span>{t('editing')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(null);
                      setNewMessage('');
                    }}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              )}
              {replyTo && (
                <div className="text-sm text-gray-500 mb-1 flex justify-between">
                  <span>{t('replying')}</span>
                  <span className="truncate ml-2 text-xs">
                    {replyTo.content}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              )}
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
            </div>
          </div>

          <div className="flex items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('message_placeholder')}
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
                  <span>{t('send')}</span>
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
