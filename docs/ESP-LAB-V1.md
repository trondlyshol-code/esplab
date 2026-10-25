# ESP-Lab v1

## Formål

ESP-Lab skal vere ein webbasert undervisningssimulator for vidaregåande elektro/elektronikk. Elevane skal kunne opne løysinga i nettlesaren frå skulen sitt nettverk utan lokal installasjon.

Første versjon byggjer vidare på Velxio, men skal vere kraftig forenkla og målretta mot undervisning med Arduino Uno og ESP32.

## V1 – støtta mikrokontrollerar

1. ESP32 DevKit V1
2. Arduino Uno

Andre kort skal skjulast frå elevgrensesnittet i V1, men kodebasen skal ikkje øydeleggast slik at dei ikkje kan aktiverast igjen seinare.

## V1 – komponentar

Første komponentsett:

- Breadboard
- LED
- RGB LED
- Motstand
- Trykknapp / brytar
- Potensiometer
- Aktiv buzzer
- Passiv buzzer
- Servo SG90

Komponentane er valde fordi dei dekkjer dei første grunnøvingane i undervisningsmaterialet: digital utgang, digital inngang, analog inngang, PWM, enkel lyd og servostyring.

## V1 – kode og simulering

Elevane skal kunne:

- skrive Arduino C++ i kodeeditoren
- kompilere kode
- starte simulering
- stoppe simulering
- sjå GPIO-endringar visuelt
- bruke Serial Monitor
- sende tekst frå Serial Monitor til programmet når dette er støtta av emulatoren
- lagre prosjekt
- opne prosjekt igjen

### Minimum API som må fungere

- `pinMode()`
- `digitalWrite()`
- `digitalRead()`
- `analogRead()`
- PWM / `analogWrite()` eller ESP32-ekvivalent
- `delay()`
- `millis()`
- `Serial.begin()`
- `Serial.print()`
- `Serial.println()`
- Servo-bibliotek for relevant kort

## Brukargrensesnitt

V1 skal vere enklare enn original Velxio.

### Startskjerm

Elev vel eitt av to kort:

- Arduino Uno
- ESP32 DevKit V1

### Arbeidsflate

Arbeidsflata skal ha:

- prosjektfiler til venstre
- kodeeditor
- simulator/canvas
- komponentveljar
- Start / Stopp
- compiler output
- Serial Monitor

### Språk

Første eigne ESP-Lab-tekstar skal vere på norsk/nynorsk der det er naturleg. Teknisk terminologi som GPIO, Serial Monitor, PWM, I2C og SPI kan behaldast.

## Avgrensing i V1

Dette skal ikkje prioriterast i første leveranse:

- WiFi
- Bluetooth/BLE
- NTP
- MQTT
- fleire virtuelle ESP32-kort samtidig
- RFID
- OLED
- DHT11
- ultralydsensor
- steppermotor
- DC-motor
- 7-segment
- lærarinnlogging
- elevkontoar
- automatisk vurdering

Desse blir bygde inn i seinare fasar.

## Vidare roadmap

### V2 – sensorar og display

- DHT11
- LDR / photocell
- joystick
- PIR
- tilt switch
- HC-SR04
- OLED SSD1306
- termistor

### V3 – bussar og meir avansert elektronikk

- I2C
- SPI
- RC522
- MPU-6500
- 74HC595
- 1-sifra 7-segment
- 4-sifra 7-segment
- 4x4 keypad

### V4 – motor og styring

- DC-motor
- L293D
- relé
- 28BYJ-48 steppermotor
- ULN2003

### V5 – nettverk og IoT

- WiFi STA
- WiFi AP
- AP + STA
- webserver på ESP32
- WiFi-konfigurasjonsportal
- NTP
- TCP mellom to ESP32
- BLE mellom nettlesar og ESP32
- BLE mellom to ESP32

## Teknisk arkitektur

### Klient

- webbasert
- køyrer i moderne Chromium-basert nettlesar
- Arduino Uno kan emulerast i nettlesaren
- ESP32-emulering køyrer via backend/QEMU

### Server

- Docker-basert
- køyrer på lokal skuleserver
- ingen installasjon nødvendig på elev-PC
- prosjektdata skal kunne lagrast sentralt

### Lisens

ESP-Lab er basert på Velxio og må halde fram med å oppfylle vilkåra i AGPLv3. Opphav og lisensinformasjon skal ikkje fjernast.

## Første tekniske milepæl

V1 er godkjend når følgjande scenario fungerer:

1. Elev opnar ESP-Lab i nettlesar.
2. Elev vel ESP32 DevKit V1 eller Arduino Uno.
3. Elev legg inn LED og motstand.
4. Elev koplar LED til ein GPIO.
5. Elev skriv eit enkelt Blink-program.
6. Elev trykker Start.
7. LED blinkar i simulatoren.
8. `Serial.println()` blir vist i Serial Monitor.
9. Prosjektet kan lagrast og opnast igjen.

## Prinsipp for vidare utvikling

- Behald Velxio sin fungerande emulatorarkitektur.
- Fjern minst mogleg frå backend i starten.
- Skjul heller funksjonar i elevgrensesnittet enn å slette dei frå kodebasen.
- Bygg komponentbiblioteket stegvis etter dei fysiske komponentane elevane faktisk brukar.
- Test kvar komponent både med ESP32 og Arduino Uno der det gir fagleg meining.
