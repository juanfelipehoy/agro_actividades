import { detectFileKind, isAllowedFile } from './file-signatures';

const buffer = (...bytes: number[]) => Buffer.from(bytes);

describe('file-signatures', () => {
  describe('detectFileKind', () => {
    it('detecta imágenes JPEG, PNG y GIF', () => {
      expect(
        detectFileKind(buffer(0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0)),
      ).toBe('image');
      expect(
        detectFileKind(
          buffer(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0),
        ),
      ).toBe('image');
      expect(
        detectFileKind(
          Buffer.concat([Buffer.from('GIF89a'), Buffer.alloc(10)]),
        ),
      ).toBe('image');
    });

    it('detecta videos MP4, WebM y AVI', () => {
      const mp4 = Buffer.concat([
        Buffer.from([0, 0, 0, 0x18]),
        Buffer.from('ftypisom'),
        Buffer.alloc(10),
      ]);
      expect(detectFileKind(mp4)).toBe('video');

      expect(
        detectFileKind(buffer(0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0, 0, 0, 0, 0)),
      ).toBe('video');

      const avi = Buffer.concat([
        Buffer.from('RIFF'),
        Buffer.from([0, 0, 0, 0]),
        Buffer.from('AVI '),
        Buffer.alloc(8),
      ]);
      expect(detectFileKind(avi)).toBe('video');
    });

    it('detecta PDF y documentos Office', () => {
      expect(
        detectFileKind(
          Buffer.concat([Buffer.from('%PDF-1.7'), Buffer.alloc(8)]),
        ),
      ).toBe('pdf');
      expect(
        detectFileKind(buffer(0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0, 0, 0, 0, 0)),
      ).toBe('document');
      expect(
        detectFileKind(
          buffer(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0, 0, 0),
        ),
      ).toBe('document');
    });

    it('rechaza contenido desconocido o buffers muy pequeños', () => {
      expect(isAllowedFile(Buffer.from('esto no es un archivo real'))).toBe(
        false,
      );
      expect(isAllowedFile(buffer(0x00, 0x01, 0x02))).toBe(false);
    });
  });
});
