'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { useUserId } from '@/lib/entities/users/hooks/useUser';
import { createClient } from '@/lib/supabase/client';

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export interface ChatMessage {
  id: string;
  content: string;
  created_at: string | null;
  user_id: string | null;
  shop_id: string;
  image?: string | null;
  shop_title?: string;
}

export const useChatMessages = () => {
  const { data: shop } = useShop();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const supabase = createClient();
  const [shopIds, setShopIds] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const shopsMapRef = useRef<Record<string, string>>({});

  const fetchMessages = useCallback(async () => {
    if (!shop?.city) return;

    const { data: shops } = await supabase
      .from('shops')
      .select('id, title')
      .eq('city', shop.city);

    const map: Record<string, string> = {};
    const ids = (shops || []).map((s) => {
      map[s.id] = s.title;
      return s.id;
    });
    setShopIds(ids);
    shopsMapRef.current = map;

    if (!ids.length) {
      setMessages([]);
      return;
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .in('shop_id', ids)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load chat messages', error);
      return;
    }

    const enriched = (data as ChatMessage[]).map((m) => ({
      ...m,
      shop_title: shopsMapRef.current[m.shop_id],
    }));
    setMessages(enriched);
  }, [shop?.city, supabase]);

  useEffect(() => {
    fetchMessages().then();
  }, [fetchMessages]);

  const cityHash = useMemo(
    () => (shop?.city ? hashString(shop.city) : ''),
    [shop?.city]
  );

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current).then();
      channelRef.current = null;
    }

    if (!shopIds.length || !cityHash) return;

    (async () => {
      const filter = `shop_id=in.(${shopIds.join(',')})`;
      const channel = supabase
        .channel(`shop_chat_${cityHash}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter },
          (payload) => {
            setMessages((prev) => [
              ...prev,
              {
                ...(payload.new as ChatMessage),
                shop_title:
                  shopsMapRef.current[(payload.new as ChatMessage).shop_id],
              },
            ]);
          }
        )
        .on('broadcast', { event: 'new-message' }, ({ payload }) => {
          const message = payload as ChatMessage;
          setMessages((prev) => [...prev, message]);
        });

      channel.subscribe();

      channelRef.current = channel;
    })();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [shopIds, cityHash, supabase]);

  const userId = useUserId();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!shop?.id || !shop?.city) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          shop_id: shop.id,
          user_id: userId,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Failed to send message', error);
        return;
      }

      const message: ChatMessage = {
        ...(data as ChatMessage),
        shop_title: shop.title,
      };

      // emit new message
      const cityHash = hashString(shop.city);
      await supabase.channel(`shop_chat_${cityHash}`).send({
        type: 'broadcast',
        event: 'new-message',
        payload: message,
      });
    },
    [shop?.id, shop?.city, shop?.title, supabase, userId]
  );

  return { messages, sendMessage, reload: fetchMessages };
};
