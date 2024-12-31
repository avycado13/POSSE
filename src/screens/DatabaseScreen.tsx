import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../colors';
import List from '../components/List';
import ListItem from '../components/ListItem';
import {
  OfflineStatus,
  useStripeTerminal,
} from '@stripe/stripe-terminal-react-native';

export default function DatabaseScreen() {
  const [offlinePaymentStatus, setOfflinePaymentStatus] =
    useState<OfflineStatus | null>(null);
  const currencySymbols = [
    { value: 'usd', label: '$' },
    { value: 'gbp', label: '￡' },
    { value: 'cad', label: 'C$' },
    { value: 'sgd', label: 'S$' },
    { value: 'eur', label: '€' },
    { value: 'aud', label: 'A$' },
    { value: 'nzd', label: 'NZ$' },
    { value: 'dkk', label: 'DKr' },
    { value: 'sek', label: 'Kr' },
  ];
  const { getOfflineStatus } = useStripeTerminal();
  function getCurrencySymbols(currency: string): string {
    let currencySymbol = '$';
    currencySymbols.map((a) => {
      if (currency === a.value) {
        currencySymbol = a.label;
      }
    });
    return currencySymbol;
  }

  useEffect(() => {
    async function getOfflinePaymentStatus() {
      const status = await getOfflineStatus();
      setOfflinePaymentStatus(status);
    }
    getOfflinePaymentStatus();
  }, [getOfflineStatus]);

  return (
    <ScrollView style={styles.container}>
      <List bolded={false} topSpacing={false} title="PUBLIC INTERFACE SUMMARY">
        {offlinePaymentStatus &&
        offlinePaymentStatus.sdk.offlinePaymentsCount > 0 ? (
          Object.keys(
            offlinePaymentStatus.sdk.offlinePaymentAmountsByCurrency
          ).map((key) => (
            <ListItem
              title={
                getCurrencySymbols(key) +
                ' ' +
                (
                  Number(
                    offlinePaymentStatus.sdk.offlinePaymentAmountsByCurrency[
                      key
                    ]
                  ) / 100
                ).toFixed(2)
              }
            />
          ))
        ) : (
          <></>
        )}
      </List>
      <Text style={styles.infoText}>
        {' '}
        {String(
          offlinePaymentStatus
            ? offlinePaymentStatus.sdk.offlinePaymentsCount
            : 0
        ) + ' payment intent(s)'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light_gray,
    height: '100%',
    paddingVertical: 22,
  },
  infoText: {
    color: colors.dark_gray,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
});