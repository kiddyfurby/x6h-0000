/**
 * @module Constants
 */
/**
 * Advertisement service UUID for Cat Printers.
 */
export declare const CAT_ADV_SRV = 44848;
/**
 * Print service UUID for Cat Printers.
 */
export declare const CAT_PRINT_SRV = 44592;
/**
 * TX characteristic UUID for print data.
 */
export declare const CAT_PRINT_TX_CHAR = 44545;
/**
 * RX characteristic UUID for printer responses.
 */
export declare const CAT_PRINT_RX_CHAR = 44546;
/**
 * Default canvas width for text rendering.
 */
export declare const DEF_CANVAS_WIDTH = 384;
/**
 * Default print speed.
 */
export declare const DEF_SPEED = 32;
/**
 * Default print energy.
 */
export declare const DEF_ENERGY = 24000;
/**
 * Default finish feed lines.
 */
export declare const DEF_FINISH_FEED = 100;
/**
 * Default feed lines for the "lift up and tear" action (~15 mm at 203 dpi).
 */
export declare const DEF_TEAR_FEED = 120;
/**
 * Default settle time (ms) to keep the link open after the final feed on
 * X6 / X6h printers so buffered output can drain.
 */
export declare const DEF_SETTLE_MS = 5000;
/**
 * Default delay (ms) between scanline writes on X6 / X6h printers.
 */
export declare const DEF_INTER_PACKET_DELAY_MS = 15;
