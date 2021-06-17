#include <FS.h>

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>


#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#include <ArduinoJson.h>
#include <SPI.h>
#include <PubSubClient.h>

#include <string.h>


WiFiServer server(80);

#define DHTPIN D4
#define DHTTYPE DHT11

int resetPin = D6;

int reset;

char *dev_id = "th_001";
char *pwd = "FarmbotAppels";

char mqtt_server[40];

char *mqttAdress = "85.215.87.215";
char *mqttUserName = "farmbot";
char *mqttPassword = "Farmb0t_1!";

char *farmbot_id = "Device_10816";
char *receiveTopic = "sensor/Device_10816/controls";
char *sendTopic = "sensor/Device_10816/measurement";

IPAddress mqttserver(85, 215, 87, 215);


WiFiClient espClient;
PubSubClient client(espClient);

WiFiManager wm;
void resetWifi();

bool reseted = false;

DHT dht(DHTPIN, DHTTYPE);

bool shouldSaveConfig = false;

//callback notifying us of the need to save config
void saveConfigCallback()
{
  Serial.println("Should save config");
  shouldSaveConfig = true;
}

void callback(char *topic, byte *payload, unsigned int length)
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t))
  {
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

  DynamicJsonDocument doc(1024);
  String output;
  


  doc["humidity"] = h;
  doc["temperature"] = t;

  serializeJson(doc, output);

  client.publish(sendTopic, output.c_str());
}

void setup()
{
  Serial.begin(9600);
  delay(500);

  Serial.println();
  Serial.print("MAC: ");
  Serial.println(WiFi.macAddress());

  Serial.println("mounting FS...");

  
  
  wm.setSaveConfigCallback(saveConfigCallback);

  //strcpy(mqtt_server, json["mqtt_server"]);
  wm.autoConnect(dev_id, pwd);

  pinMode(resetPin, INPUT);
  
   if (WiFi.status() == WL_CONNECTED)
  {
    client.setServer(mqttAdress, 1883);
   client.setCallback(callback);
   
  if (client.connect(mqttAdress, mqttUserName, mqttPassword)) {
    Serial.println("Connected");
    client.subscribe(receiveTopic);
  }else{
    Serial.println("Not connected");
  }
  } 
   

 
  

  dht.begin();
}

void loop()
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t))
  {
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
  
  /*if (WiFi.status() == WL_CONNECTED)
  {
    reseted = false;

    reset = digitalRead(resetPin);
    Serial.println("Reset: ");
    Serial.print(reset);
    
    if (reset == 1)
    {
      resetWifi();
    }
  }
  else
  {
    if (!reseted)
    {
      resetWifi();
    }
  }*/
  client.loop();
  delay(2000);
}



void resetWifi()
{
  reseted = true;
  //WiFi.disconnect(true);
  //delay(500);
  //wm.resetSettings();
  //delay(500);
  // wm.setBreakAfterConfig(true);
  //delay(500);
  wm.startConfigPortal(dev_id, pwd);
}
