import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  manifest: {
    name: 'Rai Download',
    description: 'Download osu! beatmaps from the rai.moe mirror',
    version: '1.0.0', // x-release-please-version
    permissions: [],
    host_permissions: [
      'https://osu.ppy.sh/*',
      'https://api.rai.moe/*',
    ],
    icons: {
      16: '/icon-16.png',
      32: '/icon-32.png',
      48: '/icon-48.png',
      128: '/icon-128.png',
    },
    browser_specific_settings: {
      gecko: {
        id: 'rai-download@rai.moe',
        strict_min_version: '140.0',
        data_collection_permissions: {
          required: ['none'],
        },
      } as {
        id: string;
        strict_min_version: string;
        data_collection_permissions: { required: string[] };
      },
      gecko_android: {
        strict_min_version: '142.0',
      },
    },
  },
  alias: {
    '@': resolve(__dirname, '.'),
  },
});
