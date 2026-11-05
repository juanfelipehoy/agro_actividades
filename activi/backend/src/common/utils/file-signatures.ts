/**
 * Validación de archivos por firma binaria (magic bytes).
 * El mimetype enviado por el cliente no es confiable: un archivo puede
 * declarar image/png y contener cualquier otra cosa.
 */

export type DetectedFileKind =
  'image' | 'video' | 'pdf' | 'document' | 'unknown';

const startsWith = (buffer: Buffer, bytes: number[], offset = 0): boolean =>
  bytes.every((byte, index) => buffer[offset + index] === byte);

const ascii = (buffer: Buffer, start: number, end: number): string =>
  buffer.subarray(start, end).toString('latin1');

export function detectFileKind(buffer: Buffer): DetectedFileKind {
  if (buffer.length < 12) return 'unknown';

  // Imágenes
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return 'image'; // JPEG
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return 'image'; // PNG
  if (ascii(buffer, 0, 6) === 'GIF87a' || ascii(buffer, 0, 6) === 'GIF89a')
    return 'image'; // GIF
  if (ascii(buffer, 0, 4) === 'RIFF' && ascii(buffer, 8, 12) === 'WEBP')
    return 'image'; // WebP

  // Video: MP4/MOV llevan "ftyp" en el offset 4; WebM usa EBML
  if (ascii(buffer, 4, 8) === 'ftyp') return 'video';
  if (startsWith(buffer, [0x1a, 0x45, 0xdf, 0xa3])) return 'video'; // EBML/WebM
  if (ascii(buffer, 0, 4) === 'RIFF' && ascii(buffer, 8, 12) === 'AVI ')
    return 'video';

  // Documentos
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46])) return 'pdf'; // %PDF
  // OLE2: .doc, .xls, .ppt antiguos
  if (startsWith(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
    return 'document';
  // ZIP: .docx, .xlsx, .pptx
  if (startsWith(buffer, [0x50, 0x4b, 0x03, 0x04])) return 'document';

  return 'unknown';
}

const ALLOWED_KINDS = new Set<DetectedFileKind>([
  'image',
  'video',
  'pdf',
  'document',
]);

export function isAllowedFile(buffer: Buffer): boolean {
  return ALLOWED_KINDS.has(detectFileKind(buffer));
}
