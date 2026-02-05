export type ScanResult = {
  scannedPhotoId: number;
  displayOrder: number;
  fileName: string;
  objectPath: string;
  signedUrl: string;
  expiresAt: number;
  createdAt: string;
};

export type ScanResultList = {
  scanResultList: ScanResult[];
};
