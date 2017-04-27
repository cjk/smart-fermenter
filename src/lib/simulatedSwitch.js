/* Simple but useful (Relais- / remote-) switch simulator.
 * Use when developing / debugging / testing on non-ARM platforms or machines where you cannot use libraries operating
 * physical switches directly */

const simulatedSwitch = {
  open(pin, _type, _state) {
    /* NOOP here - used by rpio to prepare GPIO for output */
    console.log(`Mock preparing GPIO on PIN <${pin}>.`);
  },
  close(pin) {
    /* NOOP here - used by rpio to cleanup / reset a GPIO pin */
    console.log(`Mock closing GPIO on PIN <${pin}>.`);
  },
  write(pin, _state) {
    /* NOOP here - used by rpio to write to a GPIO */
    console.log(`Mock writing to GPIO on PIN <${pin}>.`);
  },
  enableTransmit(pin) {
    /* NOOP here - used by rcswitch to prepare GPIO for output */
    console.log(`Mock preparing GPIO on PIN <${pin}>.`);
  },
  switchOn(systemCode, unitCode) {
    /* NOOP here */
    console.log(`Mock switching <${systemCode}#${unitCode}> ON!`);
  },
  switchOff(systemCode, unitCode) {
    /* NOOP here */
    console.log(`Mock switching <${systemCode}#${unitCode}> OFF!`);
  },
};

export default simulatedSwitch;
