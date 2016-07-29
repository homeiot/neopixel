# NeoPixel
> NeoPixel API Server

## Installation

### Hardware Preparation
- Raspberry Pi 2
- Wifi Dongle
- Adafruit NeoPixel Digital RGB LED Strip [Link](https://www.adafruit.com/product/1138)

#### Connect Neopixel to Rasberry Pi 2
![GPIO](http://www.elektronik-kompendium.de/sites/raspberry-pi/fotos/raspberry-pi-15.jpg)
- Ground of Neopixel : Number 6 or 9 or 20 or 25
- Data of Neopixel : Number 12(GPIO 18)

### Install Linux to pi
- Download : https://www.raspberrypi.org/downloads/raspbian/
- How to install : https://www.raspberrypi.org/documentation/installation/installing-images/mac.md

### Default Setting
```sh
sudo raspi-config
```
- Locale : en_GB.UTF-8 UTF-8, en_US.UTF-8 UTF-8 -> en_US.UTF-8
- Timezone : UTC (GMT) 00

### Auto Login

#### Case 1
```sh
sudo vi /etc/inittab
```
- as-is : 1:2345:respawn:/sbin/getty --noclear 38400 tty1
- to-be : 1:2345:respawn:/sbin/getty --autologin pi --noclear 38400 tty1

#### Case 2
```sh
sudo rasp-config
```
- Select 3. Boot Options.
- Select B2 Console Autologin

### Wifi Setting

```sh
sudo vi /etc/network/interface
```

```sh
auto wlan0
allow-hotplug wlan0
iface wlan0 inet dhcp
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

#### For WPA2 WPA
```sh
sudo vi /etc/wpa_supplicant/wpa_supplicant.conf
```

```sh
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  ssid="SSID"
  scan_ssid=1
  proto=WPA2 WPA
  key_mgmt=WPA-PSK
  psk="PASSWD"
}
```

#### For WPA-EAP
```sh
sudo vi /etc/wpa_supplicant/wpa_supplicant.conf
```

```sh
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  ssid="SSID"
  key_mgmt=WPA-EAP
  eap=PEAP
  scan_ssid=1
  identity="ID"
  password="PASSWD"
}
```

### Update Linux
```sh
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y git-core
```

### Install NeoPixel

```sh
$ git clone https://github.com/homeiot/neopixel.git
```

#### Install NVM
```sh
cd neopixel
./install_nvm.sh
source ~/.bashrc
nvm install 6
nvm alias  default node
```

#### Install Modules
```sh
./install_modules.sh
```

## License

MIT © [Denny Lim](http://iamdenny.com)


