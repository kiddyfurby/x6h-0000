/**
 * @module Enums
 */

/**
 * Enumeration of printer commands.
 */
export enum Command {
  ApplyEnergy = 0xbe,
  GetDeviceState = 0xa3,
  GetDeviceInfo = 0xa8,
  UpdateDevice = 0xa9,
  SetDpi = 0xa4,
  Lattice = 0xa6,
  Retract = 0xa0,
  Feed = 0xa1,
  Speed = 0xbd,
  Energy = 0xaf,
  Bitmap = 0xa2,
  /**
   * Device status / flow control (printer -> host).
   * Payload 0x10 = RX buffer full (pause), 0x00 = ready (resume).
   * Used by the X6 / X6h family.
   */
  DeviceStatus = 0xae,
}

/**
 * Enumeration of command types.
 */
export enum CommandType {
  Transfer = 0,
  Response = 1,
}
