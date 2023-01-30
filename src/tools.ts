export function readVint(
  arrayBuffer: ArrayBuffer,
  start: number = 0
): { length: number; value: number } | undefined {
  const buffer = new Uint8Array(arrayBuffer)

  const length = 8 - Math.floor(Math.log2(buffer[start]))
  if (length > 8) {
    if (length === Infinity) throw new Error(`Unrepresentable length: ${length}`)
    const number = readHexString(buffer, start, start + length)
    throw new Error(`Unrepresentable length: ${length} ${number}`)
  }

  if (isNaN(length)) return
  if (start + length > buffer.length) return

  // Max representable integer in JS
  if (
    length === 8 &&
    buffer[start + 1] >= 0x20 &&
    buffer.subarray(start + 2, start + 8).some((i) => i > 0x00)
  ) {
    return {
      length: 8,
      value: -1,
    }
  }

  let value = buffer[start] & ((1 << (8 - length)) - 1)
  for (let i = 1; i < length; i += 1) {
    value *= 2 ** 8
    value += buffer[start + i]
  }

  if (value === 2 ** (length * 7) - 1) {
    value = -1
  }

  return {
    length,
    value,
  }
}

export function writeVint(value: number, desiredLength?: number): ArrayBuffer {
  if (value < 0 || value > 2 ** 53) {
    throw new Error(`Unrepresentable value: ${value}`)
  }

  let length = desiredLength
  if (!length) {
    for (length = 1; length <= 8; length += 1) {
      if (value < 2 ** (7 * length) - 1) {
        break
      }
    }
  }

  const buffer = new Uint8Array(length)
  let val = value
  for (let i = 1; i <= length; i += 1) {
    const b = val & 0xff
    buffer[length - i] = b
    val -= b
    val /= 2 ** 8
  }
  buffer[0] |= 1 << (8 - length)

  return buffer.buffer
}

export function padStart(val: string): string {
  if (val.length == 0) {
    return '00'
  }
  if (val.length == 1) {
    return '0' + val
  }
  return val
}

export function readHexString(buf: ArrayBuffer, start: number = 0, end: number = buf.byteLength): string {
  return Array.from(new Uint8Array(buf).subarray(start, end))
    .map((q) => Number(q).toString(16))
    .reduce((acc, current) => `${acc}${padStart(current)}`, '')
}

export function hexStringToBuf(str: string) {
  return new Uint8Array(str.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)))
}

export function readUtf8(buffer: ArrayBuffer): string | undefined {
  try {
    const decoder = new TextDecoder('utf-8')
    return decoder.decode(buffer)
  } catch (err) {}
}

export function readUnsigned(buf: ArrayBuffer): number | string {
  const view = new DataView(buf, 0, buf.byteLength)
  if (buf.byteLength === 1) view.getUint8(0)
  if (buf.byteLength === 2) view.getUint16(0)
  if (buf.byteLength === 4) view.getUint32(0)
  if (buf.byteLength <= 6) {
    return new Uint8Array(buf).reduce((acc, current) => acc * 256 + current, 0)
  }

  const hex = readHexString(buf, 0, buf.byteLength)
  const num = parseInt(hex, 16)
  if (num <= Math.pow(256, 6)) return num
  return hex
}

export function writeUnsigned(num: number | string): ArrayBuffer {
  if (typeof num === 'string') {
    return new Uint8Array(num.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)))
  }

  const view = new DataView(new ArrayBuffer(8))
  view.setBigUint64(0, BigInt(num))
  let firstValueIndex = 0
  while (firstValueIndex < 7 && view.getUint8(firstValueIndex) === 0) {
    firstValueIndex++
  }
  return view.buffer.slice(firstValueIndex)
}

export function readSigned(buf: ArrayBuffer): number {
  const b = new DataView(buf, 0, buf.byteLength)
  switch (buf.byteLength) {
    case 1:
      return b.getInt8(0)
    case 2:
      return b.getInt16(0)
    case 4:
      return b.getInt32(0)
    default:
      return NaN
  }
}

export function writeSigned(num: number): ArrayBuffer {
  return new Int32Array([num]).buffer
}

export function readFloat(buf: ArrayBuffer): number {
  const b = new DataView(buf, 0, buf.byteLength)
  switch (buf.byteLength) {
    case 4:
      return b.getFloat32(0)
    case 8:
      return b.getFloat64(0)
    default:
      return NaN
  }
}

export function writeFloat(num: number): ArrayBuffer {
  return new Float32Array([num]).buffer
}

export function concatArrayBuffers(...bufs: ArrayBuffer[]) {
  const tmp = new Uint8Array(bufs.reduce((byteLength, buf) => byteLength + buf.byteLength, 0))
  let byteOffset = 0
  for (const buf of bufs) {
    tmp.set(new Uint8Array(buf), byteOffset)
    byteOffset += buf.byteLength
  }
  return tmp.buffer
}
