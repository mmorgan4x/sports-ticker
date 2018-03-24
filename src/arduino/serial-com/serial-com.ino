
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

void emit(String event, String rArg0 , String rArg1, String rArg2, String rArg3 ) {
  String msg = event + ":";

  msg += (rArg0 == NULL ? "" : (rArg0));
  msg += (rArg1 == NULL ? "" : ("," + rArg1));
  msg += (rArg2 == NULL ? "" : ("," + rArg2));
  msg += (rArg3 == NULL ? "" : ("," + rArg3));

  Serial.print(msg + '\n');
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

void runCommand() {
  if (event == "ping") {
    emit("pong", "", "", "", "");
  }
  if (event == "digitalWrite") {
    digitalWrite(arg0.toInt(), (arg1 == "LOW" ? LOW : HIGH));
    emit("digitalWrite", "", "", "", "");
  }
  if (event == "digitalRead") {
    pinMode(arg0.toInt(), INPUT);
    String rArg0 = String(digitalRead(arg0.toInt()));
    emit("digitalRead", rArg0, "", "", "");
  }
}


