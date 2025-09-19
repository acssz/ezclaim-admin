"use client";

import { createContext, useContext, useMemo } from "react";
import type { ClientSession } from "@/types/auth";

interface AuthContextValue {
  session: ClientSession | null;
  hasScope: (scope: string) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  hasScope: () => false,
});

export function AuthProvider({
  session,
  children,
}: {
  session: ClientSession | null;
  children: React.ReactNode;
}) {
  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      hasScope: (scope: string) => !!session?.scopes?.includes(scope),
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
