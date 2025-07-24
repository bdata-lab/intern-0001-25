import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute stale time
          },
          dehydrate: {
            // Include pending queries in dehydration
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
          },
        },
      });
}

let browserQueryClient = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {/* Uncomment the line below if you want to use ReactQueryDevtools */}
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}

export { getQueryClient };