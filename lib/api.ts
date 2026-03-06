import { RAI_API_BASE } from './constants';

export interface BeatmapInfo {
  available: boolean;
  hasVideo: boolean;
}

interface DownloadResponse {
  url: string;
  filename: string;
}

const infoCache = new Map<number, BeatmapInfo>();

export async function getBeatmapInfo(setId: number): Promise<BeatmapInfo> {
  const cached = infoCache.get(setId);
  if (cached) return cached;

  try {
    const res = await fetch(`${RAI_API_BASE}/beatmaps/${setId}`);
    if (!res.ok) {
      const info = { available: false, hasVideo: false };
      infoCache.set(setId, info);
      return info;
    }

    const data = await res.json();
    const info = { available: true, hasVideo: data.hasVideo ?? false };
    infoCache.set(setId, info);
    return info;
  } catch {
    const info = { available: false, hasVideo: false };
    infoCache.set(setId, info);
    return info;
  }
}

export async function triggerDownload(setId: number, withVideo: boolean): Promise<void> {
  const params = withVideo ? '' : '?video=false';
  const res = await fetch(`${RAI_API_BASE}/beatmaps/${setId}/download${params}`);

  if (!res.ok) throw new Error('Failed to get download URL');

  const data: DownloadResponse = await res.json();
  const downloadUrl = data.url.startsWith('http') ? data.url : `${RAI_API_BASE}${data.url}`;

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = data.filename || '';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
