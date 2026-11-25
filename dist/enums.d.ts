/**
 * @module Enums
 */
/**
 * Enumeration of printer commands.
 */
export declare enum Command {
    ApplyEnergy = 190,
    GetDeviceState = 163,
    GetDeviceInfo = 168,
    UpdateDevice = 169,
    SetDpi = 164,
    Lattice = 166,
    Retract = 160,
    Feed = 161,
    Speed = 189,
    Energy = 175,
    Bitmap = 162,
    /**
     * Device status / flow control (printer -> host).
     * Payload 0x10 = RX buffer full (pause), 0x00 = ready (resume).
     * Used by the X6 / X6h family.
     */
    DeviceStatus = 174
}
/**
 * Enumeration of command types.
 */
export declare enum CommandType {
    Transfer = 0,
    Response = 1
}
