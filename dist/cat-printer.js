var P = Object.defineProperty;
var F = (a, t, e) => t in a ? P(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var y = (a, t, e) => F(a, typeof t != "symbol" ? t + "" : t, e);
const C = 44848, M = 44592, N = 44545, X = 44546, V = 384, B = 32, H = 24e3, U = 100, k = 120, O = 5e3, G = 15;
var m = /* @__PURE__ */ ((a) => (a[a.ApplyEnergy = 190] = "ApplyEnergy", a[a.GetDeviceState = 163] = "GetDeviceState", a[a.GetDeviceInfo = 168] = "GetDeviceInfo", a[a.UpdateDevice = 169] = "UpdateDevice", a[a.SetDpi = 164] = "SetDpi", a[a.Lattice = 166] = "Lattice", a[a.Retract = 160] = "Retract", a[a.Feed = 161] = "Feed", a[a.Speed = 189] = "Speed", a[a.Energy = 175] = "Energy", a[a.Bitmap = 162] = "Bitmap", a[a.DeviceStatus = 174] = "DeviceStatus", a))(m || {}), _ = /* @__PURE__ */ ((a) => (a[a.Transfer = 0] = "Transfer", a[a.Response = 1] = "Response", a))(_ || {});
function I(a) {
  let t = 0;
  for (const e of a) {
    t ^= e;
    for (let i = 0; i < 8; i++)
      t & 128 ? t = t << 1 ^ 7 : t <<= 1;
    t &= 255;
  }
  return t;
}
function D(a, t = 128) {
  const e = new Uint8Array(Math.ceil(a.length / 8));
  for (let i = 0; i < a.length; i++) {
    const s = Math.floor(i / 8), o = i % 8, r = a[i], h = r & 255, n = r >> 8 & 255, c = r >> 16 & 255;
    (h + n + c) / 3 < t && (e[s] |= 1 << o);
  }
  return e;
}
class b {
  /**
   * Applies threshold dithering to the image data.
   * @param imageData The ImageData object.
   * @param options Image options, specifically the brightness threshold.
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, s = e.brightness !== void 0 ? e.brightness : 128;
    for (let o = 0; o < i.length; o += 4) {
      const h = (i[o] + i[o + 1] + i[o + 2]) / 3 < s ? 0 : 255;
      i[o] = i[o + 1] = i[o + 2] = h;
    }
    return t;
  }
}
class A {
  constructor() {
    y(this, "thresholdMap", [
      [0, 2],
      [3, 1]
    ]);
  }
  /**
   * Applies Bayer dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, s = t.width, o = t.height;
    for (let r = 0; r < o; r++)
      for (let h = 0; h < s; h++) {
        const n = (r * s + h) * 4, c = i[n], l = i[n + 1], g = i[n + 2], u = (c + l + g) / 3, E = (this.thresholdMap[r % 2][h % 2] + 1) * (255 / 5), f = u < E ? 0 : 255;
        i[n] = i[n + 1] = i[n + 2] = f;
      }
    return t;
  }
}
class x {
  /**
   * Applies Floyd-Steinberg dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, s = t.width, o = t.height;
    for (let r = 0; r < o; r++)
      for (let h = 0; h < s; h++) {
        const n = (r * s + h) * 4, c = i[n], l = i[n + 1], g = i[n + 2], E = (c + l + g) / 3 < 128 ? 0 : 255, f = E, w = E, v = E;
        i[n] = f, i[n + 1] = w, i[n + 2] = v;
        const S = c - f, d = l - w, p = g - v;
        this.distributeError(
          i,
          s,
          h + 1,
          r,
          S * 7 / 16,
          d * 7 / 16,
          p * 7 / 16
        ), this.distributeError(
          i,
          s,
          h - 1,
          r + 1,
          S * 3 / 16,
          d * 3 / 16,
          p * 3 / 16
        ), this.distributeError(
          i,
          s,
          h,
          r + 1,
          S * 5 / 16,
          d * 5 / 16,
          p * 5 / 16
        ), this.distributeError(
          i,
          s,
          h + 1,
          r + 1,
          S * 1 / 16,
          d * 1 / 16,
          p * 1 / 16
        );
      }
    return t;
  }
  distributeError(t, e, i, s, o, r, h) {
    if (i >= 0 && i < e && s >= 0 && s < t.length / (e * 4)) {
      const n = (s * e + i) * 4;
      t[n] = Math.max(0, Math.min(255, t[n] + o)), t[n + 1] = Math.max(0, Math.min(255, t[n + 1] + r)), t[n + 2] = Math.max(0, Math.min(255, t[n + 2] + h));
    }
  }
}
class T {
  dither(t, e) {
    const i = t.data, s = t.width, o = t.height, r = 4, h = new Uint8ClampedArray(i.length);
    for (let n = 3; n < i.length; n += 4)
      h[n] = i[n];
    for (let n = 0; n < o; n++)
      for (let c = 0; c < s; c++) {
        const l = (n * s + c) * 4, g = (i[l] + i[l + 1] + i[l + 2]) / 3, u = Math.floor((255 - g) / 50), E = Math.floor(c / r) * r, f = Math.floor(n / r) * r, w = c - E, v = n - f, d = Math.sqrt(
          (w - r / 2) ** 2 + (v - r / 2) ** 2
        ) < u ? 0 : 255;
        h[l] = h[l + 1] = h[l + 2] = d;
      }
    return new ImageData(h, s, o);
  }
}
const W = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BayerDithering: A,
  DotDithering: T,
  FloydSteinbergDithering: x,
  ThresholdDithering: b
}, Symbol.toStringTag, { value: "Module" }));
class L {
  /**
   * Creates an instance of the CatPrinter.
   * @param options Optional settings for the SDK.
   */
  constructor(t = {}) {
    y(this, "device", null);
    y(this, "server", null);
    y(this, "txCharacteristic", null);
    y(this, "rxCharacteristic", null);
    y(this, "printerState", {
      outOfPaper: !1,
      coverOpen: !1,
      overheat: !1,
      lowPower: !1,
      paused: !1,
      busy: !1
    });
    y(this, "options");
    y(this, "modelName", "");
    /**
     * True when the connected device belongs to the X6 / X6h family, which
     * needs flow control, a blank lead row, a 2-byte energy payload and a
     * drain delay before disconnect.
     */
    y(this, "isX6h", !1);
    /**
     * Flow-control gate for X6 / X6h. When the printer reports a full RX
     * buffer, scanline writes wait until a "ready" notification arrives.
     */
    y(this, "flowPaused", !1);
    y(this, "flowWaiters", []);
    this.options = {
      debug: !1,
      speed: 32,
      energy: 24e3,
      finishFeed: 100,
      tearFeed: 120,
      model: "auto",
      settleMs: 5e3,
      interPacketDelayMs: 15,
      ...t
    };
  }
  /**
   * Connect to a Cat Printer device.
   * @returns A Promise that resolves with the initial printer state when connected.
   * @throws Error if Bluetooth is not available or connection fails.
   */
  async connect() {
    if (!navigator.bluetooth)
      throw new Error("Bluetooth API is not available in this browser");
    try {
      if (this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [44848] }],
        optionalServices: [44592]
      }), this.modelName = this.device.name || "", this.log(`Connected to printer model: ${this.modelName}`), this.options.model === "x6" ? this.isX6h = !0 : this.options.model === "auto" && (this.isX6h = /^(X6h-|x6h-|X6H-|SC05-)/.test(this.modelName)), this.log(`Detected X6/X6h family: ${this.isX6h}`), !this.device.gatt)
        throw new Error("Bluetooth GATT not available");
      this.server = await this.device.gatt.connect();
      const t = await this.server.getPrimaryService(44592);
      return this.txCharacteristic = await t.getCharacteristic(44545), this.rxCharacteristic = await t.getCharacteristic(44546), await this.rxCharacteristic.startNotifications(), this.rxCharacteristic.addEventListener(
        "characteristicvaluechanged",
        this.handleNotification.bind(this)
      ), this.isX6h || await this.getDeviceState(), await this.prepare(this.options.speed, this.options.energy), this.printerState;
    } catch (t) {
      throw console.error("Connection error:", t), t;
    }
  }
  /**
   * Disconnect from the printer.
   * @returns A Promise that resolves when disconnected.
   */
  async disconnect() {
    if (this.isX6h && this.options.settleMs && this.options.settleMs > 0 && (this.log(`Settling for ${this.options.settleMs}ms before disconnect`), await new Promise((t) => setTimeout(t, this.options.settleMs))), this.rxCharacteristic)
      try {
        await this.rxCharacteristic.stopNotifications();
      } catch (t) {
        this.log("Error stopping notifications:", t);
      }
    this.server && this.server.connected && this.server.disconnect(), this.device = null, this.server = null, this.txCharacteristic = null, this.rxCharacteristic = null, this.log("Disconnected from printer");
  }
  /**
   * Get the current printer state.
   * @returns The current printer state object.
   */
  getState() {
    return { ...this.printerState };
  }
  /**
   * Check if the printer is currently connected.
   * @returns True if connected, false otherwise.
   */
  isConnected() {
    var t;
    return ((t = this.server) == null ? void 0 : t.connected) === !0 && this.txCharacteristic !== null;
  }
  /**
   * Print text content.
   * @param text The text to print.
   * @param options Optional text formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected.
   */
  async printText(t, e = {}) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const s = { ...{
      fontFamily: "sans-serif",
      fontSize: 16,
      align: "start",
      lineSpacing: 8,
      rotate: 0,
      flipH: !1,
      flipV: !1,
      brightness: 128,
      offset: 0
    }, ...e }, o = await this.textToBitmap(t, s);
    s.offset && s.offset !== 0 && (await this.setSpeed(8), s.offset > 0 ? await this.feed(s.offset) : await this.retract(-s.offset), await this.setSpeed(this.options.speed)), await this.printBitmap(o);
  }
  /**
   * Print an image from a URL.
   * @param imageUrl The URL of the image to print.
   * @param options Optional image formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected or the image fails to load.
   */
  async printImage(t, e = {}) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const s = { ...{
      dither: "bayer",
      // Default to Bayer dithering as suggested
      rotate: 0,
      flipH: !1,
      flipV: !1,
      brightness: 128,
      offset: 0
    }, ...e }, o = await this.imageToBitmap(t, s);
    s.offset && s.offset !== 0 && (await this.setSpeed(8), s.offset > 0 ? await this.feed(s.offset) : await this.retract(-s.offset), await this.setSpeed(this.options.speed)), await this.printBitmap(o);
  }
  /**
   * Print multiple items (text or images) in sequence.
   * @param items An array of items to print, each with a type ('text' or 'image'), content, and optional options.
   * @returns A Promise that resolves when all items are printed.
   * @throws Error if the printer is not connected.
   */
  async printMultiple(t) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    await this.prepare(this.options.speed, this.options.energy);
    for (const e of t)
      e.type === "text" ? await this.printText(e.content, e.options) : e.type === "image" && await this.printImage(e.content, e.options);
    await this.finish(this.options.finishFeed);
  }
  /**
   * Feed paper forward by a specified number of lines.
   * @param lines The number of lines to feed.
   * @returns A Promise that resolves when the feed command is sent.
   */
  async feed(t) {
    if (t <= 0) return;
    const e = this.makeCommand(
      m.Feed,
      new Uint8Array([t & 255, t >> 8 & 255])
    );
    await this.write(e);
  }
  /**
   * Retract paper (reverse feed) by a specified number of lines.
   * @param lines The number of lines to retract.
   * @returns A Promise that resolves when the retract command is sent.
   */
  async retract(t) {
    if (t <= 0) return;
    const e = this.makeCommand(
      m.Retract,
      new Uint8Array([t & 255, t >> 8 & 255])
    );
    await this.write(e);
  }
  /**
   * Set the print speed.
   * @param speed The print speed value.
   * @returns A Promise that resolves when the speed command is sent.
   */
  async setSpeed(t) {
    const e = this.makeCommand(m.Speed, new Uint8Array([t]));
    await this.write(e);
  }
  /**
   * Set the print energy/density.
   * @param energy The energy value.
   * @returns A Promise that resolves when the energy command is sent.
   */
  async setEnergy(t) {
    const e = this.isX6h ? new Uint8Array([t & 255, t >> 8 & 255]) : new Uint8Array([
      t & 255,
      t >> 8 & 255,
      t >> 16 & 255,
      t >> 24 & 255
    ]), i = this.makeCommand(m.Energy, e);
    await this.write(i);
  }
  /**
   * Apply the current energy settings to the printer.
   * @returns A Promise that resolves when the apply energy command is sent.
   */
  async applyEnergy() {
    const t = this.makeCommand(m.ApplyEnergy, new Uint8Array([1]));
    await this.write(t);
  }
  /**
   * Get the current device state from the printer.
   * @returns A Promise that resolves with the current printer state.
   */
  async getDeviceState() {
    const t = this.makeCommand(
      m.GetDeviceState,
      new Uint8Array([1])
    );
    return await this.write(t), this.printerState;
  }
  /**
   * Prepare the printer for printing by setting speed and energy.
   * @param speed The print speed.
   * @param energy The print energy/density.
   * @returns A Promise that resolves when the prepare commands are sent.
   */
  async prepare(t, e) {
    await this.setSpeed(t), await this.setEnergy(e), await this.applyEnergy();
  }
  /**
   * Finish printing with an optional paper feed.
   * @param feed The number of lines to feed at the end of printing. Default is 0.
   * @returns A Promise that resolves when the finish commands are sent.
   */
  async finish(t = 0) {
    t > 0 && (await this.setSpeed(8), await this.feed(t));
  }
  /**
   * Lift the paper up to the tear line so it can be torn off.
   * Feeds `tearFeed` scanlines (~15 mm at 203 dpi) at a slower speed.
   * @returns A Promise that resolves when the tear feed is sent.
   */
  async liftUpAndTear() {
    const t = this.options.tearFeed ?? 120;
    await this.setSpeed(8), await this.feed(t);
  }
  /**
   * Draw a single line of bitmap data to the printer.
   * @param line The bitmap line data as a Uint8Array.
   * @returns A Promise that resolves when the draw command is sent.
   * @throws Error if the printer is not connected.
   */
  async draw(t) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const e = this.makeCommand(m.Bitmap, t);
    await this.write(e);
  }
  /**
   * Print a full bitmap.
   * @param bitmap An object containing the width, height, and bitmap data.
   * @returns A Promise that resolves when the entire bitmap is printed.
   */
  async printBitmap(t) {
    const { width: e, height: i, data: s } = t, o = Math.ceil(e / 8);
    this.isX6h && (await this.waitForFlow(), await this.draw(new Uint8Array(o)), await this.interPacketDelay());
    for (let r = 0; r < i; r++) {
      const h = r * o, n = h + o, c = s.slice(h, n);
      c.every((l) => l === 0) || (await this.waitForFlow(), await this.draw(c), await this.interPacketDelay());
    }
  }
  // Private methods
  /**
   * Create a command packet to send to the printer.
   * @param command The command to send.
   * @param payload The data payload for the command.
   * @param type The type of command (Transfer or Response). Default is Transfer.
   * @returns The complete command packet as a Uint8Array.
   */
  makeCommand(t, e, i = _.Transfer) {
    return new Uint8Array([
      81,
      120,
      t,
      i,
      e.length & 255,
      e.length >> 8,
      ...e,
      I(e),
      255
    ]);
  }
  /**
   * Send data to the printer via the TX characteristic.
   * @param data The data to send as a Uint8Array.
   * @returns A Promise that resolves when the data is written.
   * @throws Error if the printer is not properly connected.
   */
  async write(t) {
    if (!this.txCharacteristic)
      throw new Error("Printer not properly connected");
    this.log(
      "Sending data:",
      Array.from(t).map((e) => e.toString(16).padStart(2, "0")).join(" ")
    );
    try {
      await this.txCharacteristic.writeValueWithoutResponse(t);
    } catch (e) {
      throw this.log("Error writing to printer:", e), e;
    }
  }
  /**
   * Handle incoming notifications from the printer via the RX characteristic.
   * @param event The characteristicvaluechanged event.
   */
  handleNotification(t) {
    const e = t.target;
    if (!e.value) return;
    const i = new Uint8Array(e.value.buffer);
    if (this.log(
      "Received notification:",
      Array.from(i).map((s) => s.toString(16).padStart(2, "0")).join(" ")
    ), this.isX6h && i.length >= 7 && i[2] === m.DeviceStatus) {
      const s = i[6];
      if (s === 16)
        this.flowPaused = !0, this.log("Printer buffer full — pausing");
      else if (s === 0) {
        this.log("Printer ready — resuming"), this.flowPaused = !1;
        const o = this.flowWaiters;
        this.flowWaiters = [], o.forEach((r) => r());
      }
      return;
    }
    if (i.length >= 7 && i[2] === m.GetDeviceState) {
      const s = i[6];
      this.printerState = {
        outOfPaper: !!(s & 1),
        coverOpen: !!(s & 2),
        overheat: !!(s & 4),
        lowPower: !!(s & 8),
        paused: !!(s & 16),
        busy: !!(s & 128)
      }, this.log("Printer state updated:", this.printerState);
    }
  }
  /**
   * Convert text to a bitmap for printing.
   * @param text The text to convert.
   * @param options Text formatting options.
   * @returns A Promise that resolves with the bitmap data.
   */
  async textToBitmap(t, e) {
    const i = document.createElement("canvas"), s = i.getContext("2d");
    i.width = 384, i.height = 500, s.fillStyle = "white", s.fillRect(0, 0, i.width, i.height), s.fillStyle = "black";
    const o = e.fontWeight ? `${e.fontWeight} ` : "";
    s.font = `${o}${e.fontSize}px ${e.fontFamily}`, s.textAlign = e.align === "start" ? "left" : e.align === "end" ? "right" : e.align;
    const r = t.split(`
`), h = e.fontSize + (e.lineSpacing || 8);
    let n = e.fontSize;
    for (const f of r) {
      const w = e.align === "start" ? 0 : e.align === "end" ? i.width : i.width / 2;
      s.fillText(f, w, n), n += h;
    }
    const c = document.createElement("canvas");
    c.width = i.width, c.height = n;
    const l = c.getContext("2d");
    if (l.drawImage(i, 0, 0), e.rotate !== 0 || e.flipH || e.flipV) {
      const f = document.createElement("canvas");
      f.width = c.width, f.height = c.height;
      const w = f.getContext("2d");
      w.save(), w.translate(
        f.width / 2,
        f.height / 2
      ), e.rotate && e.rotate !== 0 && w.rotate(e.rotate * Math.PI / 180), e.flipH && w.scale(-1, 1), e.flipV && w.scale(1, -1), w.drawImage(
        c,
        -c.width / 2,
        -c.height / 2
      ), w.restore(), c.width = f.width, c.height = f.height, l.drawImage(f, 0, 0);
    }
    const g = l.getImageData(
      0,
      0,
      c.width,
      c.height
    ), u = new Uint32Array(g.data.buffer), E = D(u);
    return {
      width: c.width,
      height: c.height,
      data: E
    };
  }
  async imageToBitmap(t, e) {
    const i = new Image();
    i.crossOrigin = "anonymous";
    const o = await new Promise(
      (d, p) => {
        i.onload = () => d(i), i.onerror = () => p(new Error(`Failed to load image: ${t}`)), i.src = t;
      }
    ), r = document.createElement("canvas"), h = r.getContext("2d"), n = 384, c = o.width / o.height, l = Math.floor(n / c);
    if (r.width = n, r.height = l, h.fillStyle = "white", h.fillRect(0, 0, r.width, r.height), h.drawImage(o, 0, 0, n, l), e.rotate !== 0 || e.flipH || e.flipV) {
      const d = document.createElement("canvas");
      d.width = r.width, d.height = r.height;
      const p = d.getContext("2d");
      p.save(), p.translate(
        d.width / 2,
        d.height / 2
      ), e.rotate && e.rotate !== 0 && p.rotate(e.rotate * Math.PI / 180), e.flipH && p.scale(-1, 1), e.flipV && p.scale(1, -1), p.drawImage(r, -r.width / 2, -r.height / 2), p.restore(), r.width = d.width, r.height = d.height, h.drawImage(d, 0, 0);
    }
    const g = h.getImageData(0, 0, r.width, r.height);
    let u = g;
    e.dither && e.dither !== "none" && (e.dither === "threshold" ? u = new b().dither(g, e) : e.dither === "bayer" ? u = new A().dither(g, e) : e.dither === "floyd-steinberg" ? u = new x().dither(g, e) : e.dither === "dot" && (u = new T().dither(g, e)), h.putImageData(u, 0, 0));
    const E = h.getImageData(0, 0, r.width, r.height), f = new Uint32Array(E.data.buffer);
    let w = 128;
    (e.dither === "threshold" || e.dither === "none") && (w = e.brightness !== void 0 ? e.brightness : 128);
    const v = D(f, w), S = r.toDataURL("image/png");
    return {
      width: r.width,
      height: r.height,
      data: v,
      dataurl: S
    };
  }
  /**
   * Wait until the printer signals it is ready (X6 / X6h flow control).
   * Resolves immediately when the printer is not paused or not an X6.
   */
  async waitForFlow() {
    !this.isX6h || !this.flowPaused || await new Promise((t) => {
      this.flowWaiters.push(t);
    });
  }
  /**
   * Sleep between scanline writes on X6 / X6h printers.
   */
  async interPacketDelay() {
    const t = this.options.interPacketDelayMs ?? 0;
    t <= 0 || await new Promise((e) => setTimeout(e, t));
  }
  /**
   * Log debug information to the console if debugging is enabled.
   * @param args Arguments to log.
   */
  log(...t) {
    this.options.debug && console.log("[CatPrinter]", ...t);
  }
}
export {
  C as CAT_ADV_SRV,
  X as CAT_PRINT_RX_CHAR,
  M as CAT_PRINT_SRV,
  N as CAT_PRINT_TX_CHAR,
  L as CatPrinter,
  m as Command,
  _ as CommandType,
  V as DEF_CANVAS_WIDTH,
  H as DEF_ENERGY,
  U as DEF_FINISH_FEED,
  G as DEF_INTER_PACKET_DELAY_MS,
  O as DEF_SETTLE_MS,
  B as DEF_SPEED,
  k as DEF_TEAR_FEED,
  W as Dithering,
  I as crc8,
  D as rgbaToBits
};
