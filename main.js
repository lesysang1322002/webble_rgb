var bluetoothDevice;
var CharacStart;
var CharacValue1;
var CharacValue2;
var CharacValue3;
var statusLED;

function onConnectBLEdevice() {
  return (bluetoothDevice ? Promise.resolve() : requestDevice())
  .then(connectDeviceAndCacheCharacteristics)
  .catch(error => {
    console.log('onConnectBLEdevice Argh! ' + error);
    console.log(error);
  });
}

function requestDevice() {
  console.log('Requesting any Bluetooth Device with 19b10000-e8f2-537e-4f6c-d104768a1214 service...');
  return navigator.bluetooth.requestDevice({
      filters: [{name: 'Robot'}],//<- Prefer filters to save energy & show relevant devices.
     // acceptAllDevices: true,
      optionalServices: ['19b10000-e8f2-537e-4f6c-d104768a1214']})
  .then(device => {
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
  });
}


function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && bluetoothDeviceCharacteristic) {
    return Promise.resolve();
  }

  console.log('Connecting to GATT Server...');
  return bluetoothDevice.gatt.connect()
  .then(server => {
    console.log('Getting LED Service...');
    return server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');
  })
  .then(service => {
    console.log('Getting red LED Characteristic...');
   // Get all characteristics.
    return service.getCharacteristics();
  })
  .then(characteristics => {
    console.log('> Characteristics: ' +
      characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19)));
      console.log(characteristics)
      console.log(characteristics[0])
  //for (var i = 0; i < characteristics.length; i++) {
      CharacStart = characteristics[0];
      CharacValue1 = characteristics[1];
      CharacValue2 = characteristics[2];
      CharacValue3 = characteristics[3];
     //}
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

/* This function will be called when `readValue` resolves and
 * characteristic value changes since `characteristicvaluechanged` event
 * listener has been added. */

function onDisconnected() {
    return bluetoothDevice.gatt.disconnect()
}
function start(){
    aux=new Int8Array(1);
    aux[0]=1;
    return (CharacStart.writeValue(aux))
  .then(_ => {
    console.log('onTurnOnRedLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}
function stop(){
    aux=new Int8Array(1);
    aux[0]=0;
    return (CharacStart.writeValue(aux))
  .then(_ => {
    console.log('onTurnOnRedLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}
function servo1(newValue) {
    console.log('Giá trị mới của Value1: ' + newValue);
     CharacValue1.writeValue(new Int8Array([newValue]));
     const Value1 = document.getElementById('Value1');
    Value1.textContent = newValue;
  }
function servo2(newValue) {
    console.log('Giá trị mới của Value2: ' + newValue);
    CharacValue2.writeValue(new Int8Array([newValue]));
    const Value2 = document.getElementById('Value2');
    Value2.textContent = newValue;
  }
function servo3(newValue) {
    console.log('Giá trị mới của Value3: ' + newValue);
     CharacValue3.writeValue(new Int8Array([newValue]));
     const Value3 = document.getElementById('Value3');
    Value3.textContent = newValue;
  }
let isScanning = true;
  function toggleFunction() {
      const button = document.getElementById("toggleButton");

      if (isScanning) {
          button.innerText = "DIS";
          onConnectBLEdevice()
          isScanning = false;
      } else {
          button.innerText = "SCAN";
          onDisconnected()
          isScanning = true;
      }
  }
  let Scanning = true;
  function togFunction() {
      const button = document.getElementById("togButton");

      if (Scanning) {
        togButton.innerText = "STOP";
          start();
          Scanning = false;
      } else {
        togButton.innerText = "START";
          stop()
          Scanning = true;
      }
  }
  