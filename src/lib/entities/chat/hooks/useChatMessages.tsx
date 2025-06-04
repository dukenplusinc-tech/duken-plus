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
  updated_at: string | null;
  deleted_at: string | null;
  user_id: string | null;
  shop_id: string;
  image?: string | null;
  shop_title?: string;
}

const PAGE_SIZE = 20;

export const useChatMessages = () => {
  const { data: shop } = useShop();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const supabase = createClient();
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const shopsMapRef = useRef<Record<string, string>>({});
  const oldestRef = useRef<string | null>(null);
  const loadingRef = useRef(false);

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
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    if (error) {
      console.error('Failed to load chat messages', error);
      return;
    }

    const reversed = (data as ChatMessage[]).reverse();
    oldestRef.current = reversed[0]?.created_at ?? null;
    const enriched = reversed.map((m) => ({
      ...m,
      shop_title: shopsMapRef.current[m.shop_id],
    }));
    setMessages(enriched);
    setHasMore(reversed.length === PAGE_SIZE);
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
            const incoming = {
              ...(payload.new as ChatMessage),
              shop_title:
                shopsMapRef.current[(payload.new as ChatMessage).shop_id],
            };
            setMessages((prev) => {
              if (prev.some((m) => m.id === incoming.id)) {
                return prev;
              }
              return [...prev, incoming];
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter },
          (payload) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === payload.new.id
                  ? {
                      ...(payload.new as ChatMessage),
                      shop_title:
                        shopsMapRef.current[
                          (payload.new as ChatMessage).shop_id
                        ],
                    }
                  : m
              )
            );
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'chat_messages', filter },
          (payload) => {
            setMessages((prev) =>
              prev.filter((m) => m.id !== (payload.old as ChatMessage).id)
            );
          }
        );

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
    async (content: string, image?: string) => {
      if (!shop?.id || !shop?.city) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          shop_id: shop.id,
          user_id: userId,
          image: image || null,
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

      setMessages((prev) => [...prev, message]);
    },
    [shop?.id, shop?.city, shop?.title, supabase, userId]
  );

  const loadOlder = useCallback(async () => {
    if (loadingRef.current || !oldestRef.current || !shopIds.length || !hasMore) {
      return;
    }
    loadingRef.current = true;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .in('shop_id', shopIds)
      .lt('created_at', oldestRef.current)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    if (error) {
      console.error('Failed to load older messages', error);
      loadingRef.current = false;
      return;
    }

    const reversed = (data as ChatMessage[]).reverse();
    if (reversed.length) {
      oldestRef.current = reversed[0].created_at;
    }
    setHasMore(reversed.length === PAGE_SIZE);
    const enriched = reversed.map((m) => ({
      ...m,
      shop_title: shopsMapRef.current[m.shop_id],
    }));
    setMessages((prev) => [...enriched, ...prev]);
    loadingRef.current = false;
  }, [shopIds, supabase, hasMore]);

  const editMessage = useCallback(
    async (id: string, content: string, image?: string | null) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .update({
          content,
          image: image || null,
          // do not rely on updated_at column existence to avoid schema cache error
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Failed to edit message', error);
        return;
      }

      const editedAt = new Date().toISOString();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...(data as ChatMessage),
                shop_title: m.shop_title,
                updated_at: (data as ChatMessage).updated_at ?? editedAt,
              }
            : m
        )
      );
    },
    [supabase]
  );

  const deleteMessage = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete message', error);
        return;
      }

      setMessages((prev) => prev.filter((m) => m.id !== id));
    },
    [supabase]
  );

  return {
    messages,
    sendMessage,
    loadOlder,
    hasMore,
    editMessage,
    deleteMessage,
    reload: fetchMessages,
  };
};
