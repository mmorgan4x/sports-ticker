
void setup() {
  Serial.begin(115200);
}

String serialReadBuffer = "";
String event = "";
String arg0 = "";
String arg1 = "";
String arg2 = "";
String arg3 = "";

void loop() {
  if (Serial.available() > 0) {
    char character = Serial.read();

    if (character == '\n') {
      setParams(serialReadBuffer);
      runCommand();
      serialReadBuffer = "";
    }
    else {
      serialReadBuffer += character;
    }
  }
}

void emit(String event, String val) {
  Serial.print(event + ":" + val + '\n');
}

void setParams(String msg) {
  String args[4];
  String argsStr = msg.substring(msg.indexOf(":") + 1, msg.length());

  int argIndex = 0;
  for (int i = 0; i < argsStr.length(); i++) {
    if (argsStr[i] == ',') {
      argIndex++;
    }
    else {
      args[argIndex] += argsStr[i];
    }
  }

  event = msg.substring(0, msg.indexOf(':'));
  arg0 = args[0];
  arg1 = args[1];
  arg2 = args[2];
  arg3 = args[3];
}

int getPin(String pin) {
  //TODO A1,A2,,,
  return pin.toInt();
}

void runCommand() {
  if (event == "ping") {
    emit("pong", "");
  }
  if (event == "pinMode") {
    pinMode(getPin(arg0), (arg1 == "INPUT" ? INPUT : (arg1 == "OUTPUT" ? OUTPUT : INPUT_PULLUP)));
    emit("pinMode", "");
  }
  if (event == "digitalWrite") {
    digitalWrite(getPin(arg0), true);
    emit("digitalWrite", "");
  }
  if (event == "digitalRead") {
    String val = String(digitalRead(getPin(arg0)));
    emit("digitalRead", val);
  }
  if (event == "analogWrite") {
    analogWrite(getPin(arg0), arg1.toInt());
    emit("analogWrite", "");
  }
  if (event == "analogRead") {
    String val = String(analogRead(getPin(arg0)));
    emit("analogRead", val);
  }
  if (event == "millis") {
    String val = String(millis());
    emit("millis", val);
  }
  if (event == "micros") {
    String val = String(micros());
    emit("micros", val);
  }
}


