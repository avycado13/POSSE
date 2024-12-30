import React, { useState, useCallback } from 'react';
import { StripeTerminalProvider } from '@stripe/stripe-terminal-react-native';
import App from './App';
import { AppContext, api } from './AppContext';

export default function Root() {
  const [lastSuccessfulChargeId, setLastSuccessfulChargeId] = useState<string | null>(null);

  const fetchTokenProvider = useCallback(async (): Promise<string> => {
    if (!api) {
      console.error('API instance is not available.');
      return '';
    }

    try {
      const resp = await api.createConnectionToken();

      if ('error' in resp) {
        console.error('Could not fetch connection token:', resp.error);
        return '';
      }

      return resp.secret || '';
    } catch (error) {
      console.error('Unexpected error while fetching connection token:', error);
      return '';
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        api,
        setLastSuccessfulChargeId: (id) => setLastSuccessfulChargeId(id),
        lastSuccessfulChargeId,
      }}
    >
      <StripeTerminalProvider
        logLevel="verbose"
        tokenProvider={fetchTokenProvider}
      >
        <App />
      </StripeTerminalProvider>
    </AppContext.Provider>
  );
}
