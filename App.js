import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

import Button from './components/Button';
import CircleButton from './components/CircleButton';
import Root from './Root'


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <View style={styles.footerContainer}>
        <Button label="Start New Order" onPress={CartView} />
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <CircleButton onPress={onAddSticker} />
        </View>
      </View>
    </View>
      );
}

cart = []

function onAddSticker() {
const [facing, setFacing] = useState<CameraType>('back');
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
return (
  <View style={styles.container}>
    <CameraView style={styles.camera} facing={facing} barcodeScannerSettings={{
    barcodeTypes: ["upc_a"],
  }} onBarcodeScanned={AddProduct}>
    </CameraView>
  </View>
);
}

function AddProduct(Barcode) {
  fetch(`https://api.upcdatabase.org/product/${Barcode["data"]}`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer THISISALIVEDEMOAPIKEY19651D54X47'
    }
})
.then(response => response.json())  // Convert the responseh to JSON
.then(data => cart.push(data))     // Handle the data
.catch(error => console.error('Error:', error));  // Handle any errors
}


const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

function CartView(){
  return (
    <View style={styles.container}>
      <FlatList
      data={cart}
      renderItem={({ item }) => <Item title={item.title} />}
      keyExtractor={item => item.id} />
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <CircleButton onPress={onAddSticker} />
          <Button label="Bill Order" onPress={PaymentCalc} />
        </View>
      </View>
    </View>
  )
}

function PaymentCalc(){
  let cart_price = 0
  for (const item of cart) {
    cart_price += item.price
  }
  return cart_price
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
