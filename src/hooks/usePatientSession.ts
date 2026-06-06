import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PAYOR, type PayorId } from '../data/payors';

const STORAGE_KEY = 'vascularscreen.session.v1';

export interface PatientSession {
  activeIds: string[];
  payor: PayorId;
  aaaPriorSbe: boolean;
}

const empty: PatientSession = {
  activeIds: [],
  payor: DEFAULT_PAYOR,
  aaaPriorSbe: false,
};

function load(): PatientSession {
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as PatientSession;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

export function usePatientSession() {
  const [session, setSession] = useState<PatientSession>(empty);

  useEffect(() => {
    setSession(load());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const toggle = useCallback((id: string) => {
    setSession((s) => ({
      ...s,
      activeIds: s.activeIds.includes(id)
        ? s.activeIds.filter((x) => x !== id)
        : [...s.activeIds, id],
    }));
  }, []);

  const setPayor = useCallback((payor: PayorId) => {
    setSession((s) => ({ ...s, payor }));
  }, []);

  const setAaaPriorSbe = useCallback((aaaPriorSbe: boolean) => {
    setSession((s) => ({ ...s, aaaPriorSbe }));
  }, []);

  const reset = useCallback(() => {
    setSession(empty);
  }, []);

  return { session, toggle, setPayor, setAaaPriorSbe, reset };
}
