import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

const DEFAULT_SUPABASE_URL = 'https://xfvkesgkfehffavfulde.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_6mvtUKTzP5vh2H7bnU4NfA_gwg_W0bO';

function createSafeDummyQuery(): any {
  const queryHandler: any = {
    select: () => createSafeDummyQuery(),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    upsert: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
    eq: () => createSafeDummyQuery(),
    neq: () => createSafeDummyQuery(),
    gt: () => createSafeDummyQuery(),
    gte: () => createSafeDummyQuery(),
    lt: () => createSafeDummyQuery(),
    lte: () => createSafeDummyQuery(),
    like: () => createSafeDummyQuery(),
    ilike: () => createSafeDummyQuery(),
    is: () => createSafeDummyQuery(),
    in: () => createSafeDummyQuery(),
    contains: () => createSafeDummyQuery(),
    containedBy: () => createSafeDummyQuery(),
    range: () => createSafeDummyQuery(),
    order: () => createSafeDummyQuery(),
    limit: () => createSafeDummyQuery(),
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve: any, reject?: any) => Promise.resolve({ data: [], error: null }).then(resolve, reject),
  };

  return new Proxy(queryHandler, {
    get(target: any, prop: string | symbol) {
      if (prop in target) return target[prop];
      if (prop === 'then') return target.then;
      return () => createSafeDummyQuery();
    },
  });
}

function createSafeDummyAuth(): any {
  const dummyAuth: any = {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { id: 'mock-sub', callback: () => {}, unsubscribe: () => {} } },
      error: null,
    }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: null }),
    signInWithOtp: async () => ({ data: {}, error: null }),
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
    setSession: async () => ({ data: { session: null, user: null }, error: null }),
    refreshSession: async () => ({ data: { session: null, user: null }, error: null }),
    updateUser: async () => ({ data: { user: null }, error: null }),
  };

  return new Proxy(dummyAuth, {
    get(target: any, prop: string | symbol) {
      if (prop in target) return target[prop];
      return async () => ({ data: null, error: null });
    },
  });
}

function createFallbackClient(): ReturnType<typeof createClient<Database>> {
  const fallback = {
    auth: createSafeDummyAuth(),
    from: () => createSafeDummyQuery(),
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      subscribe: () => ({ unsubscribe: () => {} }),
      send: async () => ({ error: null }),
      track: async () => ({ error: null }),
      untrack: async () => ({ error: null }),
      presenceState: () => ({}),
    }),
    removeChannel: () => {},
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null }),
      }),
    },
  };

  return new Proxy(fallback as any, {
    get(target: any, prop: string | symbol) {
      if (prop in target) return target[prop];
      return () => createSafeDummyQuery();
    },
  });
}

function createSupabaseClient() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.warn('[Supabase Client] Missing URL or key. Initializing bulletproof fallback client.');
    return createFallbackClient();
  }

  try {
    const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
      },
      auth: {
        storage: brokeredPreviewStorage(),
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    // Ensure client.auth is safe against missing methods
    if (!client.auth || typeof client.auth.getSession !== 'function') {
      console.warn('[Supabase Client] client.auth is missing getSession. Patching with safe auth.');
      (client as any).auth = createSafeDummyAuth();
    }

    return client;
  } catch (err) {
    console.error('[Supabase Client] createClient error. Falling back to safe mock client:', err);
    return createFallbackClient();
  }
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
