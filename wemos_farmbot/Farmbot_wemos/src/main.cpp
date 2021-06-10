#include <FS.h>

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

WiFiServer server(80);

#define DHTPIN D4
#define DHTTYPE DHT11

int resetPin = D6;

int reset;

char *dev_id = "th_001";
char *pwd = "FarmbotAppels";

char mqtt_server[40];


WiFiManager wm;
void resetWifi();

bool reseted = false;

DHT dht(DHTPIN, DHTTYPE);

bool shouldSaveConfig = false;

//callback notifying us of the need to save config
void saveConfigCallback () {
  Serial.println("Should save config");
  shouldSaveConfig = true;
}

void setup() {
  Serial.begin(9600);
  delay(500);
  

  Serial.println();
   Serial.print("MAC: ");
   Serial.println(WiFi.macAddress());



  Serial.println("mounting FS...");

  if (SPIFFS.begin()) {
    Serial.println("mounted file system");
    if (SPIFFS.exists("/config.json")) {
      //file exists, reading and loading
      Serial.println("reading config file");
      File configFile = SPIFFS.open("/config.json", "r");
      if (configFile) {
        Serial.println("opened config file");
        size_t size = configFile.size();
        // Allocate a buffer to store contents of the file.
        std::unique_ptr<char[]> buf(new char[size]);

        configFile.readBytes(buf.get(), size);
        DynamicJsonBuffer jsonBuffer;
        JsonObject& json = jsonBuffer.parseObject(buf.get());
        json.printTo(Serial);
        if (json.success()) {
          Serial.println("\nparsed json");
          strcpy(mqtt_server, json["mqtt_server"]);
        } else {
          Serial.println("failed to load json config");
        }
      }
    }
  } else {
    Serial.println("failed to mount FS");
  }

    WiFiManagerParameter custom_mqtt_server("server", "mqtt server", mqtt_server, 40);
    wm.addParameter(&custom_mqtt_server);
   wm.setSaveConfigCallback(saveConfigCallback);
    

  //strcpy(mqtt_server, json["mqtt_server"]);
  wm.autoConnect(dev_id, pwd);

  strcpy(mqtt_server, custom_mqtt_server.getValue());

  if (SPIFFS.begin()) {
    Serial.println("mounted file system");
    if (SPIFFS.exists("/config.json")) {
      //file exists, reading and loading
      Serial.println("reading config file");
      File configFile = SPIFFS.open("/config.json", "r");
      if (configFile) {
        Serial.println("opened config file");
        size_t size = configFile.size();
        // Allocate a buffer to store contents of the file.
        std::unique_ptr<char[]> buf(new char[size]);

        configFile.readBytes(buf.get(), size);
        DynamicJsonBuffer jsonBuffer;
        JsonObject& json = jsonBuffer.parseObject(buf.get());
        json.printTo(Serial);
        if (json.success()) {
          json["mqtt_server"] = mqtt_server;
        } else {
          Serial.println("failed to load json config");
        }
      }
    }
  } else {
    Serial.println("failed to mount FS");
  }
  
  pinMode(resetPin, INPUT);

  dht.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED)
  {
    reseted = false;
    
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

   Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.print(" *C ");
Serial.println();

    reset = digitalRead(resetPin);
    Serial.println("Reset: ");
    Serial.print(reset);
    if(reset == 1){
      resetWifi();
    }
  }else{
    if(!reseted){
      resetWifi();
    }
  }

  delay(2000);

}



void resetWifi(){
  reseted = true;
  //WiFi.disconnect(true);
  //delay(500);
  //wm.resetSettings();
  //delay(500);
 // wm.setBreakAfterConfig(true);
  //delay(500);
  wm.startConfigPortal(dev_id, pwd);

}
