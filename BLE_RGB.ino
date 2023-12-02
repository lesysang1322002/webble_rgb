#include <Adafruit_NeoPixel.h>
#include <ArduinoBLE.h>
BLEService RobotService("19B10000-E8F2-537E-4F6C-D104768A1214"); // Bluetooth® Low Energy LED Service
 
// Bluetooth® Low Energy LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic Start("19B10001-E8F2-537E-4F6C-D104768A1215", BLERead | BLEWrite|BLENotify);
BLEByteCharacteristic Value1("19B10001-E8F2-537E-4F6C-D104768A1216", BLERead | BLEWrite|BLENotify);
BLEByteCharacteristic Value2("19B10001-E8F2-537E-4F6C-D104768A1217", BLERead | BLEWrite|BLENotify);
BLEByteCharacteristic Value3("19B10001-E8F2-537E-4F6C-D104768A1218", BLERead | BLEWrite|BLENotify);
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define PIN        22 // On Trinket or Gemma, suggest changing this to 1

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 8 // Popular NeoPixel ring size

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

#define DELAYVAL 500 // Time (in milliseconds) to pause between pixels
int va1=0,va2=0,va3=0;
void setup() {
#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  pixels.begin();
Serial.begin(115200);
  delay(200);
 
  if (!BLE.begin()) {
    Serial.println("starting Robot");
    while (1);
  }
 
  // set advertised local name and service UUID:
  BLE.setLocalName("Robot");
  BLE.setAdvertisedService(RobotService);
 
  // add the characteristic to the service
  RobotService.addCharacteristic  (Start);
  RobotService.addCharacteristic  (Value1);
  RobotService.addCharacteristic  (Value2);
  RobotService.addCharacteristic  (Value3);
  BLE.addService(RobotService);
  Start.writeValue(0);
  Value1.writeValue(0);
  Value2.writeValue(0);
  Value3.writeValue(0);
  BLE.advertise();
  Serial.println("BLE Robot Peripheral");
}

void loop() {
  // listen for Bluetooth® Low Energy peripherals to connect:
  BLEDevice central = BLE.central();

  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
  while (central.connected()) {
    // while the central is still connected to peripheral
   while (central.connected()) {
        if(Start.value()) {
          start();
           pixels.clear(); 
    for(int i=0; i<NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(Value1.value(),Value2.value(),Value3.value()));
      pixels.show();   
      delay(DELAYVAL);
  }
          }
        else{
           Stop();
          }
        Serial.print("Giá trị Value1: ");
        Serial.println(Value1.value());
        Serial.print("Giá trị Value2: ");
        Serial.println(Value2.value());
        Serial.print("Giá trị Value3: ");
        Serial.println(Value3.value());
      }
  }
    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }
}
void start(){
  Serial.println("Start");
}
void Stop(){
  Serial.println("Stop");
}
