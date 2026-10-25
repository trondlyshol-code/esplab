# Test ESP-Lab V1 locally with Docker

These commands keep the original Velxio test container untouched and run ESP-Lab on a separate port.

## 1. Clone the fork

```powershell
git clone https://github.com/trondlyshol-code/esplab.git
cd esplab
git checkout esp-lab-v1
```

If the repository is already cloned:

```powershell
git fetch
git checkout esp-lab-v1
git pull
```

## 2. Build the ESP-Lab development image

```powershell
docker build -f Dockerfile.esplab-test -t esplab:v1 .
```

The development Dockerfile builds the ESP-Lab frontend and overlays it on the official self-hosted Velxio runtime. This lets us test classroom UI changes without rebuilding the QEMU/ESP-IDF runtime each time.

## 3. Run it beside the original container

```powershell
docker run -d `
  --name esplab-v1-test `
  -p 3081:80 `
  -v esplab-v1-data:/app/data `
  -v esplab-v1-arduino-libs:/root/.arduino15 `
  -v esplab-v1-arduino-user-libs:/root/Arduino `
  -v esplab-v1-ccache:/var/cache/ccache `
  -v esplab-v1-build:/var/lib/velxio-build `
  esplab:v1
```

Open:

```text
http://localhost:3081
```

The original Velxio container can remain on:

```text
http://localhost:3080
```

## 4. Check logs

```powershell
docker logs -f esplab-v1-test
```

Press `Ctrl+C` to stop following the log. This does not stop the container.

## 5. Rebuild after changes

```powershell
docker rm -f esplab-v1-test
docker build -f Dockerfile.esplab-test -t esplab:v1 .
docker run -d `
  --name esplab-v1-test `
  -p 3081:80 `
  -v esplab-v1-data:/app/data `
  -v esplab-v1-arduino-libs:/root/.arduino15 `
  -v esplab-v1-arduino-user-libs:/root/Arduino `
  -v esplab-v1-ccache:/var/cache/ccache `
  -v esplab-v1-build:/var/lib/velxio-build `
  esplab:v1
```

## First V1 test checklist

- New Project shows Blank, Arduino Uno and ESP32 DevKit V1 only.
- Language options include English, Norwegian, Polish and Ukrainian.
- Add Component still contains the original component catalogue.
- Elegoo Kit appears as a dedicated filter.
- Arduino Uno Blink compiles and runs.
- ESP32 Blink compiles and runs.
- Serial Monitor shows `Serial.println()` output.
