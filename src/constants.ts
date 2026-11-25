/**
 * @module Constants
 */

/**
 * Advertisement service UUID for Cat Printers.
 */
export const CAT_ADV_SRV = 0xaf30;

/**
 * Print service UUID for Cat Printers.
 */
export const CAT_PRINT_SRV = 0xae30;

/**
 * TX characteristic UUID for print data.
 */
export const CAT_PRINT_TX_CHAR = 0xae01;

/**
 * RX characteristic UUID for printer responses.
 */
export const CAT_PRINT_RX_CHAR = 0xae02;

/**
 * Default canvas width for text rendering.
 */
export const DEF_CANVAS_WIDTH = 384;

/**
 * Default print speed.
 */
export const DEF_SPEED = 32;

/**
 * Default print energy.
 */
export const DEF_ENERGY = 24000;

/**
 * Default finish feed lines.
 */
export const DEF_FINISH_FEED = 100;

/**
 * Default feed lines for the "lift up and tear" action (~15 mm at 203 dpi).
 */
export const DEF_TEAR_FEED = 120;

/**
 * Default settle time (ms) to keep the link open after the final feed on
 * X6 / X6h printers so buffered output can drain.
 */
export const DEF_SETTLE_MS = 5000;

/**
 * Default delay (ms) between scanline writes on X6 / X6h printers.
 */
export const DEF_INTER_PACKET_DELAY_MS = 15;
