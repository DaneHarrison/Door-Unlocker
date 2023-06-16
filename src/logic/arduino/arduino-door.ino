#include <Ethernet.h>
#include <FastLED.h>
#if ARDUINO > 18
#include <SPI.h>
#endif

const int MOTOR_PIN = 2;
const int DIR_PIN = 3;
const int ENA_PIN = 4;
const int LED_PIN = 12;
const int BUZZER_PIN = 13;

const int CMD_LEN = 6;
const int WAIT_TIME = 3600;
const int MAX_DIGITS = 3;
const int MAX_LEDS = 5;
const int RGB_INFO = 3;
CRGB led[MAX_LEDS];

bool lockSystem = false;
unsigned long nounce;

byte MAC[] = {0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02};  
//byte IP[] = {10, 0, 0, 177};    //192.168.100.101
const int PORT = 80;
EthernetServer server = EthernetServer(PORT);
const IPAddress TRANSFORMER_IP(192, 168, 100, 100);


void setup() {
  pinMode(MOTOR_PIN, OUTPUT);
  pinMode(DIR_PIN, OUTPUT);
  pinMode(ENA_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  FastLED.addLeds<NEOPIXEL, LED_PIN>(led, MAX_LEDS);
  
  Ethernet.begin(MAC, IP);
  server.begin();
  nounce = random(5000, 50000000);
}

void loop() {
  EthernetClient client = server.available();
  
  //&& validClient(client)
  if(client && !lockSystem) {
    char command[CMD_LEN];

    readInCmd(client, command);
    if(command == "newSeq") {
      newSeq(client);
    }
    else if(command == "unlock") {
      unlock(client);
    }     
    else {
      lockSystem = true;
    }

    sendResponse(client, command);
    client.flush();  
    client.stop();
  }
}


//Requests
void newSeq(EthernetClient client) {
  int colours[MAX_LEDS][RGB_INFO];
  nounce = millis();

  processColours(client, colours);
  for(int i = 0; i < MAX_LEDS; i++) {
    led[i].setRGB(colours[i][0], colours[i][1], colours[i][2]);
  }    //led[i].red = colours[i][0]; //led[i].green = colours[i][1]; //led[i].blue = colours[i][2]; if this doesnt work
      
  FastLED.show();
  delay(WAIT_TIME);
  FastLED.clear();
}

void unlock(EthernetClient client) {
  unsigned long clientNounce = getClientNounce(client);

  if(nounce == clientNounce) {
    nounce = random(5000, 50000000);
    tone(BUZZER_PIN, 1000, 60000);
    delay(60000);

    //unlock door
    delay(WAIT_TIME);
    //lock door
  }
  else {
    lockSystem = true;
  }
}


//Helper functions
bool validConnection(EthernetClient client) {
  return client.remoteIP() == TRANSFORMER_IP; //!lockSystem
}

void skipTo(EthernetClient client, char delimiter) {
  char input = client.read();

    while(input != delimiter) {
      input = client.read();
    }
}

void readInCmd(EthernetClient client, char command[]) {
  skipTo(client, '=');
  char input = client.read();
  int posi = 0;

  while(input != -1 && posi < CMD_LEN) {
    command[posi] = input;
    input = client.read();
    posi += 1;
  }
}

void processColours(EthernetClient client, int colours[][RGB_INFO]) {
  char digitBuffer[MAX_DIGITS];
  char digit;

  skipTo(client, '[');
  for(int led = 0; led < MAX_LEDS; led++) {
    skipTo(client, '"');
    for(int rgb = 0; rgb < RGB_INFO; rgb++) {
      digit = client.read();
      for(int posi = 0; (digit != '"' || digit != ':'); posi++) { //change this to a while loop plz
        digitBuffer[posi] = digit;
        digit = client.read();
      }
    
      colours[led][rgb] = atoi(digitBuffer);
    }
  }
}

unsigned long getClientNounce(EthernetClient client) {
  char buffer[10];  //4,294,967,295
  int posi = 0;
  char input;

  skipTo(client, '=');
  input = client.read();
  while(input != '"' && posi < 10) {
    buffer[posi];
    posi++;
    input = client.read();
  }

  return strtol(buffer, NULL, 10);
}

void sendResponse(EthernetClient client, char command[]) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:text/html");
  client.println();

  if(command == "newSeq") { 
    client.println(nounce); //This was fucking everything up
  }
}