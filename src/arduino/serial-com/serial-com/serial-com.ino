void setup() {
  Serial.begin(9600);
}

String buffer = "";
void loop() {

  if (Serial.available() > 0) {
    char recieved = Serial.read();

    if (recieved == '\r') { }
    else if (recieved == '\n') {
      if (buffer == "tick:") {
        Serial.println(String("tick:") + millis());
      }
      buffer = "";
    }
    else {
      buffer += recieved;
    }
  }
}
