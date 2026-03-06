export const RAI_API_BASE = 'https://api.rai.moe';
export const RAI_CONTRIBUTE_URL = 'https://rai.moe/contribute';

export const SELECTORS = {
  PAGE_BUTTONS: '.beatmapset-header__buttons',
  PAGE_DOWNLOAD_LINK: 'a[href*="/download"]',
  PAGE_VIDEO_ICON: '.beatmapset-status[title*="video"]',
  CARD: '.beatmapset-panel',
  CARD_MENU: '.beatmapset-panel__menu',
  CARD_LINK: 'a[href*="/beatmapsets/"]',
  CARD_VIDEO_ICON: '.beatmapset-panel__play-icon[title*="video"]',
} as const;

export const CSS_CLASSES = {
  RAI_BUTTON: 'btn-osu-big--rai-download',
  RAI_CARD_ITEM: 'beatmapset-panel__menu-item--rai',
  STYLES_ID: 'rai-download-styles',
  RAI_LOADING: 'rai-loading',
  RAI_UNAVAILABLE: 'rai-unavailable',
  RAI_CONTAINER: 'rai-button-container',
} as const;

export const BEATMAPSET_URL_PATTERN = /\/beatmapsets\/(\d+)/;
