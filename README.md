# Cat Printer SDK (X6h fork)

> **This is a fork of [`opuu/cat-printer`](https://github.com/opuu/cat-printer) that adds support for the X6 / X6h "cat printer" family** (e.g. the `x6h-0000` model). The upstream library only tested GB01/02/03, GT01, YT01, MX05/06/08/10 and X5; the X6h speaks a different GATT flow and needs flow control, a blank lead row, a 2-byte energy payload and a drain delay. All of that is handled here.
>
> Upstream remote is configured as `upstream`; this fork's changes live on top of it.

## What's different from upstream

- **Auto-detects X6 / X6h** from the advertised BLE name (`X6h-`, `x6h-`, `X6H-`, `SC05-`), or force with `model: 'x6'`.
- **Flow control** via the `0xAE` device-status characteristic (pauses on buffer-full `0x10`, resumes on ready `0x00`).
- **Blank lead scanline** prepended before bitmap rows (X6h prints artifacts otherwise).
- **2-byte (u16 LE) energy payload** for X6h instead of the 4-byte u32 other models use.
- **Skips the device-state command** on X6h (unsupported).
- **15 ms inter-packet delay** between scanlines and a **5 s settle delay** before disconnect so the printer drains its buffer.
- **`liftUpAndTear()`** method + demo button: feeds ~15 mm (120 scanlines at 203 dpi) at a slower speed so the print clears the tear line.

## Features

- **Bluetooth Connectivity:** Easily connect to your thermal printer using Web Bluetooth.
- **Text Printing:** Customize font family, size, weight, alignment, and more for professional output.
- **Image Printing with Multiple Dithering Methods:** Convert images to black and white using various methods:
    - **Threshold:** Simple brightness cutoff.
    - **Bayer:** Uses an ordered Bayer matrix for a patterned effect.
    - **Floyd-Steinberg:** Implements error diffusion for smoother gradients.
    - **Dot Dithering:** Additional technique for more artistic or technical effects.
- **Printer Control:** Adjust print settings such as speed, energy, and paper feed.
- **State Monitoring:** Check printer conditions like paper status, cover position, temperature, battery level, and more.
- **Queue Support:** Manage and print multiple items in sequence to streamline your printing workflow.

## Installation

Get started in seconds by installing the Cat Printer SDK using your favorite package manager:

### NPM
```bash
npm install @opuu/cat-printer
```

### Yarn
```bash
yarn add @opuu/cat-printer
```

### PNPM
```bash
pnpm add @opuu/cat-printer
```

### Bun
```bash
bun add @opuu/cat-printer
```

## Quick Start

Below is a simple example demonstrating how to connect to a Cat Printer, print text and an image, and then gracefully disconnect.

```typescript
import { CatPrinter } from '@opuu/cat-printer';

// Create a new instance with debug logging enabled
const printer = new CatPrinter({ debug: true });

// Connect to the printer
async function connectPrinter() {
        try {
                await printer.connect();
                console.log('Connected to printer!');
                
                // Print text with custom options
                await printer.printText('Hello World!', { 
                        fontSize: 24, 
                        fontWeight: 'bold',
                        align: 'center',
                        lineSpacing: 8
                });
                
                // Print an image using Floyd-Steinberg dithering
                await printer.printImage('https://example.com/image.jpg', {
                        dither: 'floyd-steinberg'
                });
                
                // Feed the paper to finalize the printing job
                await printer.feed(100);
                
                // Disconnect when the job is done
                await printer.disconnect();
        } catch (error) {
                console.error('Error during printing:', error);
        }
}

// Bind the connect function to a button click event
document.getElementById('connectButton').addEventListener('click', connectPrinter);
```

## API Reference

### Class: CatPrinter

The `CatPrinter` class offers all methods needed to interact with a thermal printer via Bluetooth.

#### Constructor

```typescript
new CatPrinter(options?: PrinterOptions)
```

**PrinterOptions:**

| Option     | Type    | Default | Description                             |
|------------|---------|---------|-----------------------------------------|
| debug      | boolean | false   | Enable debug logging                    |
| speed      | number  | 32      | Default print speed                     |
| energy     | number  | 24000   | Default print energy/density            |
| finishFeed | number  | 100     | Default lines to feed after printing    |
| tearFeed   | number  | 120     | Scanlines to feed for `liftUpAndTear()` (~15 mm at 203 dpi) |
| model      | 'auto' \| 'x6' | 'auto' | Force a printer family; `'x6'` targets the X6 / X6h |
| settleMs   | number  | 5000    | Drain delay (ms) before disconnect on X6 / X6h |
| interPacketDelayMs | number | 15 | Delay (ms) between scanlines on X6 / X6h |

### Methods

#### Connection Management

- **connect(): Promise<PrinterState>**  
    Connects to the printer via Bluetooth.

- **disconnect(): Promise<void>**  
    Disconnects from the printer.

- **isConnected(): boolean**  
    Returns the current connection status.

- **getState(): PrinterState**  
    Retrieves detailed printer state.

#### Printing Operations

- **printText(text: string, options?: TextOptions): Promise<void>**  
    Prints text with customizable formatting.

- **printImage(imageUrl: string, options?: ImageOptions): Promise<void>**  
    Prints an image using a specified dithering method.

- **printMultiple(items: Array<{type: 'text' | 'image', content: string, options?: TextOptions | ImageOptions}>): Promise<void>**  
    Prints multiple items in a queued sequence.

#### Paper Control

- **feed(lines: number): Promise<void>**  
    Advances the paper by the specified number of lines.

- **retract(lines: number): Promise<void>**  
    Retracts available paper by the given number of lines.

#### Printer Settings

- **setSpeed(speed: number): Promise<void>**  
    Adjusts the printing speed.

- **setEnergy(energy: number): Promise<void>**  
    Adjusts the print energy/density.

- **prepare(speed: number, energy: number): Promise<void>**  
    Sets up both speed and energy simultaneously.

- **finish(feed: number): Promise<void>**  
    Completes printing with a final paper feed.

- **liftUpAndTear(): Promise<void>**  
    Feeds paper ~15 mm (configurable via `tearFeed`) at a slower speed so the print clears the tear line. Use this instead of an auto-feed after every print.

### Options Types

#### TextOptions

| Option      | Type                                    | Description                              |
|-------------|-----------------------------------------|------------------------------------------|
| fontFamily  | string                                  | Font family for the text                 |
| fontSize    | number                                  | Font size in pixels                      |
| fontWeight  | string                                  | Font weight (e.g., 'normal', 'bold')       |
| align       | 'start' \| 'center' \| 'end' \| 'justified' | Text alignment                        |
| lineSpacing | number                                  | Line spacing in pixels                   |
| rotate      | number                                  | Rotation angle in degrees                |
| flipH       | boolean                                 | Flip text horizontally                   |
| flipV       | boolean                                 | Flip text vertically                     |
| brightness  | number                                  | Brightness threshold (0-255)             |
| offset      | number                                  | Optional paper feed/retract adjustment   |

#### ImageOptions

| Option     | Type                                                                       | Description                                      |
|------------|----------------------------------------------------------------------------|--------------------------------------------------|
| dither     | 'none' \| 'threshold' \| 'bayer' \| 'floyd-steinberg' \| 'dot'  | Dithering algorithm to convert images |
| rotate     | number                                                                     | Rotation angle in degrees                        |
| flipH      | boolean                                                                    | Flip the image horizontally                      |
| flipV      | boolean                                                                    | Flip the image vertically                        |
| brightness | number                                                                     | Brightness threshold (0-255)                     |
| offset     | number                                                                     | Paper feed/retract adjustment before printing    |

#### PrinterState

| Property   | Type    | Description                                  |
|------------|---------|----------------------------------------------|
| outOfPaper | boolean | True when the printer is out of paper        |
| coverOpen  | boolean | True when the printer's cover is open        |
| overheat   | boolean | True when the printer is overheated          |
| lowPower   | boolean | True when the battery is low                 |
| paused     | boolean | True when the printer is paused              |
| busy       | boolean | True when the printer is busy                |

## Dithering Options

When printing images, the SDK converts images to black and white using various dithering techniques. Each method offers a unique visual style and performance characteristics:

- **threshold:** Applies a simple brightness threshold.
- **bayer:** Uses an ordered Bayer matrix to generate a patterned effect.
- **floyd-steinberg:** Uses error diffusion for smooth gradient transitions.
- **dot:** Additional technique offering distinct stylistic results; ideal for creative outputs.

## Dithering Previews

Below are previews showcasing the visual effects of different dithering methods. (Note: Replace the image URLs with actual examples as needed.)

| Dithering Method      | Preview                                         |
|-----------------------|-------------------------------------------------|
| **None**             | ![No Dithering](./images/billu.jpg)       |
| **Threshold**         | ![Threshold Dithering](./images/billu-threshold.png)     |
| **Bayer**             | ![Bayer Dithering](./images/billu-bayer.png)           |
| **Floyd-Steinberg**   | ![Floyd-Steinberg Dithering](./images/billu-floyd.png) |
| **Dot**               | ![Dot Dithering](./images/billu-dot.png)               |

## Browser Compatibility

The Cat Printer SDK leverages the Web Bluetooth API, which is currently supported in:

- Chrome
- Edge
- Opera

Please note that Safari and Firefox do not offer native support for the Web Bluetooth API, all chromium-based browsers should work fine.

## Contributing

We welcome contributions! If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## Supported Printers

- [x] GB01
- [x] GB02
- [x] GB03
- [x] GT01
- [x] YT01
- [x] MX05
- [x] MX06
- [x] MX08
- [x] MX10
- [x] X5
- [x] X6 / X6h (auto-detected from `X6h-` / `x6h-` / `X6H-` / `SC05-` names, or force with `model: 'x6'`)

## Inspired By

- [NaitLee/Cat-Printer](https://github.com/NaitLee/Cat-Printer/)
- [NaitLee/kitty-printer](https://github.com/NaitLee/kitty-printer)

## License

Distributed under the AGPL-3.0 license. See the LICENSE file for details.

## Credits

- Upstream: [`opuu/cat-printer`](https://github.com/opuu/cat-printer) by Obaydur Rahman.
- X6 / X6h protocol reference: [parzivail's BLE thermal printer notes](https://parzivail.github.io/ble-thermal-printer/), [nazarovmi/tinyprint-x6h](https://github.com/nazarovmi/tinyprint-x6h), [cicloid/printable](https://github.com/cicloid/printable).
