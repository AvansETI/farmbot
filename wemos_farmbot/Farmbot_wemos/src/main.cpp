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

//Defenitions for the DHT sensor
#define DHTPIN D4
#define DHTTYPE DHT11

//Define pin of the reset button.
int resetPin = D6;

int reset;

//Credentials of the accespoint that is being used to configure wifi.
char *dev_id = "th_001";
char *pwd = "FarmbotAppels";

//MQTT adres and credentials
char *mqttAdress = "sendlab.nl";
char *mqttUserName = "farmbot_sensor";
char *mqttPassword = "F@rmB0t!@sensor";

//MQTT topics to trigger and send data
char *farmbot_id = "device_10816";
char *receiveTopic = "sensor/device_10816/controls";
char *sendTopic = "sensor/device_10816/measurement";


WiFiClient espClient;
PubSubClient client(espClient);

WiFiManager wm;

//prototype of reset wifi
void resetWifi();

//DHT definision
DHT dht(DHTPIN, DHTTYPE);

bool shouldSaveConfig = false;

//callback notifying to save config
void saveConfigCallback()
{
  Serial.println("Should save config");
  shouldSaveConfig = true;
}

//Callback function to execute when trigger message is reveived.
void callback(char *topic, byte *payload, unsigned int length)
{
  //Read value of the dht sensor
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

//Make json to send back over MQTT
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

  //start and configure network
  wm.setSaveConfigCallback(saveConfigCallback);
  wm.autoConnect(dev_id, pwd);

  pinMode(resetPin, INPUT);
  
   if (WiFi.status() == WL_CONNECTED)
  {

    //set and configure mqtt broker.
    client.setServer(mqttAdress, 11883);
   client.setCallback(callback);
   
  if (client.connect(mqttAdress, mqttUserName, mqttPassword)) {
    Serial.println("Connected");
    client.subscribe(receiveTopic);
  }else{
    Serial.println("Not connected");
  }
  } 

  //start dht sensor
  dht.begin();
}

//main loop of program
void loop()
{

  //read temperature
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  //error log if dht is not working
  if (isnan(h) || isnan(t))
  {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  //print to test if dht is working
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.print(" *C ");
  Serial.println();
  
  //read to value of button, that is connected on the reset pin.
  //If pressed, network can be reconfigured.
  reset = digitalRead(resetPin);
    Serial.println("Reset: ");
    Serial.print(reset);
   
    if (reset == 1)
    {
      resetWifi();
    }

  client.loop();
  delay(2000);
}


//Method to reconfigure network settings
void resetWifi()
{
  wm.startConfigPortal(dev_id, pwd);
}
