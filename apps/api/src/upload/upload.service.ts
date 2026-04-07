import { Injectable, Logger } from '@nestjs/common';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Bucket } from '@google-cloud/storage';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private _bucket: Bucket | null = null;

  private getBucket(): Bucket {
    if (!this._bucket) {
      this._bucket = getStorage().bucket();
    }
    return this._bucket;
  }

  async generateSignedUrl(filename: string, contentType: string) {
    const ext = filename.split('.').pop();
    const filePath = `gallery/${uuidv4()}.${ext}`;
    const file = this.getBucket().file(filePath);

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.getBucket().name}/o/${encodeURIComponent(filePath)}?alt=media`;

    return { signedUrl, publicUrl, filePath };
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!filePath) return;

    try {
      await this.getBucket().file(filePath).delete();
    } catch (error) {
      this.logger.warn(`Failed to delete file ${filePath}`, error);
    }
  }
}
