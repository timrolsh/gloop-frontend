"use client";

import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useMemo} from "react";
import {ReactQueryException} from "../consts/exceptions";

const ReactQueryProvider = ({children}) => {
  // Setting error capturing for sentry in react-query
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Stale for 5 Minutes
            refetchOnWindowFocus: false
          }
        },
        mutationCache: new MutationCache({
          onError: (err, _variables, _context, mutation) => {
            new ReactQueryException(err.message, {
              type: "MutationCache",
              _variables,
              _context,
              error: err,
              mutationId: mutation?.mutationId,
              variables: mutation?.state?.variables,
              mutationKey: Array.from(mutation?.options?.mutationKey || [])
            });
          }
        }),
        queryCache: new QueryCache({
          onError: (err, query) => {
            new ReactQueryException(err.message, {type: "QueryCache", error: err, query});
          }
        })
      }),
    []
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
