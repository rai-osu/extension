# Rai Download

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](#installation)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--on-FF7139?style=flat-square&logo=firefox&logoColor=white)](#installation)
[![License](https://img.shields.io/github/license/rai-osu/extension?style=flat-square)](LICENSE)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/checksum)

Browser extension for the [rai.moe](https://rai.moe) beatmap mirror. Adds download buttons directly to osu! beatmap pages.

## Installation

| Browser | Install                                                                                       |
| ------- | --------------------------------------------------------------------------------------------- |
| Chrome  | [Chrome Web Store](https://chromewebstore.google.com/detail/kbagkikmefjamjkdhnbbjagkehfhbedf) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/rai-download/)               |

Or load unpacked from [GitHub Releases](https://github.com/rai-osu/extension/releases).

## How It Works

The extension injects buttons into `osu.ppy.sh/beatmapsets/*` pages:

1. Checks `api.rai.moe` for beatmap availability
2. Shows appropriate button state (available/unavailable/loading)
3. Fetches signed download URL on click
4. Triggers browser download

## Permissions

| Permission      | Reason                                |
| --------------- | ------------------------------------- |
| `osu.ppy.sh/*`  | Inject download buttons               |
| `api.rai.moe/*` | Check availability, get download URLs |

## Development

Built with [WXT](https://wxt.dev) and TypeScript.

```bash
pnpm install
pnpm dev          # Chrome dev
pnpm dev:firefox  # Firefox dev
pnpm build        # Production build
pnpm zip          # Create extension package
```

## License

MIT
