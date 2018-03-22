
void setup() {
  Serial.begin(115200);
}

String serialReadBuffer = "";

void loop() {
  if (Serial.available() > 0) {
    char character = Serial.read();

    if (character == '\n') {
      runCommand(serialReadBuffer);
      serialReadBuffer = "";
    }
    else {
      serialReadBuffer += character;
    }
  }
}

void runCommand(String msg) {

  String* args = deserialize(msg);
  String event = args[0];
  String arg0 = args[1];
  String arg1 = args[2];
  String arg2 = args[3];

  String retEvent = "";
  String retArgs[10] = {};

  if (event == "ping") {
    retEvent = "pong";
  }
  if (event == "digitalWrite") {
    digitalWrite(arg0.toInt(), arg1 == "LOW" ? LOW : HIGH);
    retEvent = "digitalWrite";
    retArgs[0] = arg0;
    retArgs[1] = arg1;
  }

  String retMsg = serialize(retEvent, retArgs);
  write(retMsg);
  delete[] args;
}



void write(String msg) {
  Serial.print(msg + '\n');
}

void write(String args[]) {
  String msg = "";
  for (int i = 0; i < getArraySize(args); i++) {
    msg += (i == 0 ? "" : "...") + args[i];
  }
  Serial.print(msg + '\n');
}

String serialize(String event, String args[]) {
  String msg = event + ":";
  for (int i = 0; i < getArraySize(args); i++) {
    msg += (i == 0 ? "" : ",") + args[i];
  }
  return msg;
}

String* deserialize(String msg) {
  String* args = new String[10];
  int insertIndex = 0;

  //event
  args[insertIndex] = msg.substring(0, msg.indexOf(':'));
  insertIndex++;

  String argsStr = msg.substring(msg.indexOf(":") + 1, msg.length());
  String temp = "";

  //args
  for (int i = 0; i < argsStr.length(); i++) {
    if (argsStr[i] == ',') {
      args[insertIndex] = temp;
      insertIndex++;
      temp = "";
    }
    else {
      temp += argsStr[i];
    }
  }
  if (temp != NULL) {
    args[insertIndex] = temp;
  }

  return args;
}

int getArraySize(String arr[]) {
  int size = 0;
  while (size < 10 && arr[size] != NULL) {
    size++;
  }
  return  size;
}


