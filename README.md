# smart-fermenter
This project is about a self-made fermenter-closet and covers the software-part of controlling it.
It's written for NodeJS and could run on a Raspberry-PI or similar mini-computer to keep a certain range of temperature and humidity.

The current temperature + humidity is measured using sensors and if necessary a small heater and/or humidifier is turned on/off to keep the environment in the closet ideal for fermentation.

## What?
Eating [fermented food](https://en.wikipedia.org/wiki/List_of_fermented_foods) is [healthy](https://chriskresser.com/heal-your-gut-heal-your-brain/) and delicious. Best if you make it yourself, like in jars in a cabinet.
For best results, you need to maintain certain temperature and humidity levels. This software helps you maintaining that.

## How?
In my setup, I have a temp./humidity sensor connected to a Raspberry Pi 2 running Arch-ARM and NodeJS and this small server/controller.
It checks current temp./hum. levels and switches on/off a heating-device / humidifier when necessary.

## TODO
- Switch to more efficient + maintained logging-library
  Either this fork: https://github.com/rudemex/signale-logger or Pino
