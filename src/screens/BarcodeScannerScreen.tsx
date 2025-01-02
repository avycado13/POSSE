import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../colors';
import { Api } from '../api/api'
import { AppContext } from '../AppContext'

export default function BarcodeScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const { api, setLastSuccessfulChargeId } = useContext(AppContext);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const handleBarCodeScanned = async (scanningResult: { data: string }) => {
    setScanned(true);
    try {
      // Replace with your backend API URL
      const response = await fetch(`${api.api_url}/products/${scanningResult["data"]}`);
      const product = await response.json();
      
      // Navigate back to previous screen with product data
      navigation.navigate('ReaderDisplayScreen', {
        productData: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert(`Failed to fetch product for barcode: ${scanningResult.data}`);
    }
  };


  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} barcodeScannerSettings={{
    barcodeTypes: ["upc_a","upc_e"],
    }} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },
  header: {
    color: colors.dark_gray,
    fontSize: 16,
    marginVertical: 12,
    paddingLeft: 22,
  },
  info: {
    color: colors.dark_gray,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });