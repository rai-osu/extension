import { getBeatmapInfo, triggerDownload, type BeatmapInfo } from './api';
import {
  SELECTORS,
  CSS_CLASSES,
  BEATMAPSET_URL_PATTERN,
  RAI_CONTRIBUTE_URL,
} from './constants';

type ButtonState = 'loading' | 'available' | 'unavailable';

function extractSetId(url: string): number | null {
  const match = url.match(BEATMAPSET_URL_PATTERN);
  return match ? parseInt(match[1], 10) : null;
}

function createSvgElement(tag: string, attrs: Record<string, string> = {}): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function createRaiIcon(): SVGElement {
  const svg = createSvgElement('svg', {
    viewBox: '0 0 24 24',
    class: 'rai-icon-svg',
    stroke: 'currentColor',
  });

  const polyline = createSvgElement('polyline', {
    points: '12 16 14 12 10 12 12 8',
    style: 'fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.4;',
  });

  const polygon = createSvgElement('polygon', {
    points: '8.27 3 15.73 3 21 8.27 21 15.73 15.73 21 8.27 21 3 15.73 3 8.27 8.27 3',
    style: 'fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.4;',
  });

  svg.appendChild(polyline);
  svg.appendChild(polygon);
  return svg;
}

function createIcon(iconClass: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = iconClass;
  return span;
}

function createSpinnerIcon(): HTMLSpanElement {
  return createIcon('fas fa-circle-notch rai-spinner fa-fw');
}

function setButtonIcon(container: Element, icon: Element | HTMLSpanElement): void {
  container.textContent = '';
  container.appendChild(icon);
}

function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  return new Promise((resolve) => {
    const check = () => {
      const el = document.querySelector(selector);
      if (el && el.querySelector('a[href*="/download"]')) {
        return el;
      }
      return null;
    };

    const existing = check();
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = check();
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(check());
    }, timeout);
  });
}

function createPageButton(
  setId: number,
  withVideo: boolean | null,
  state: ButtonState
): HTMLAnchorElement {
  const btn = document.createElement('a');
  const classes = ['btn-osu-big', 'btn-osu-big--beatmapset-header', CSS_CLASSES.RAI_BUTTON];

  if (state === 'loading') classes.push(CSS_CLASSES.RAI_LOADING);
  if (state === 'unavailable') classes.push(CSS_CLASSES.RAI_UNAVAILABLE);

  btn.className = classes.join(' ');
  btn.href = state === 'unavailable' ? RAI_CONTRIBUTE_URL : '#';
  btn.target = state === 'unavailable' ? '_blank' : '_self';
  btn.rel = 'noopener';

  const content = document.createElement('span');
  content.className = 'btn-osu-big__content';

  const left = document.createElement('span');
  left.className = 'btn-osu-big__left';

  const textTop = document.createElement('span');
  textTop.className = 'btn-osu-big__text-top';

  const iconContainer = document.createElement('span');
  iconContainer.className = 'btn-osu-big__icon';

  if (state === 'loading') {
    textTop.textContent = 'Checking Rai...';
    iconContainer.appendChild(createSpinnerIcon());
  } else if (state === 'unavailable') {
    textTop.textContent = 'Not on Rai';

    const textBottom = document.createElement('span');
    textBottom.className = 'btn-osu-big__text-bottom';
    textBottom.textContent = 'Request it →';
    left.appendChild(textTop);
    left.appendChild(textBottom);

    iconContainer.appendChild(createIcon('fas fa-plus fa-fw'));
  } else {
    textTop.textContent = 'Download from Rai';

    if (withVideo !== null) {
      const textBottom = document.createElement('span');
      textBottom.className = 'btn-osu-big__text-bottom';
      textBottom.textContent = withVideo ? 'with Video' : 'without Video';
      left.appendChild(textTop);
      left.appendChild(textBottom);
    }

    iconContainer.appendChild(createRaiIcon());
  }

  if (!left.contains(textTop)) left.appendChild(textTop);

  content.appendChild(left);
  content.appendChild(iconContainer);
  btn.appendChild(content);

  if (state === 'available') {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      btn.classList.add(CSS_CLASSES.RAI_LOADING);

      const iconEl = btn.querySelector('.btn-osu-big__icon');
      if (iconEl) setButtonIcon(iconEl, createSpinnerIcon());

      try {
        await triggerDownload(setId, withVideo ?? false);
      } catch (err) {
        console.error('Rai download failed:', err);
      } finally {
        btn.classList.remove(CSS_CLASSES.RAI_LOADING);
        if (iconEl) setButtonIcon(iconEl, createRaiIcon());
      }
    });
  }

  return btn;
}

function createCardButton(setId: number, state: ButtonState): HTMLAnchorElement {
  const btn = document.createElement('a');
  const classes = ['beatmapset-panel__menu-item', CSS_CLASSES.RAI_CARD_ITEM];

  if (state === 'loading') classes.push(CSS_CLASSES.RAI_LOADING);
  if (state === 'unavailable') classes.push(CSS_CLASSES.RAI_UNAVAILABLE);

  btn.className = classes.join(' ');
  btn.href = state === 'unavailable' ? RAI_CONTRIBUTE_URL : '#';
  btn.target = state === 'unavailable' ? '_blank' : '_self';
  btn.rel = 'noopener';

  if (state === 'loading') {
    btn.title = 'Checking Rai...';
    btn.appendChild(createIcon('fas fa-circle-notch rai-spinner'));
  } else if (state === 'unavailable') {
    btn.title = 'Request on Rai';
    btn.appendChild(createIcon('fas fa-plus'));
  } else {
    btn.title = 'Download from Rai';
    btn.appendChild(createRaiIcon());
  }

  if (state === 'available') {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      btn.classList.add(CSS_CLASSES.RAI_LOADING);
      setButtonIcon(btn, createIcon('fas fa-circle-notch rai-spinner'));

      try {
        await triggerDownload(setId, false);
      } catch (err) {
        console.error('Rai download failed:', err);
      } finally {
        btn.classList.remove(CSS_CLASSES.RAI_LOADING);
        setButtonIcon(btn, createRaiIcon());
      }
    });
  }

  return btn;
}

function updatePageButtons(
  container: Element,
  setId: number,
  info: BeatmapInfo,
  pageHasVideo: boolean
): void {
  container.querySelectorAll(`.${CSS_CLASSES.RAI_CONTAINER}`).forEach((el) => el.remove());

  const wrapper = document.createElement('div');
  wrapper.className = CSS_CLASSES.RAI_CONTAINER;
  wrapper.setAttribute('data-set-id', String(setId));
  wrapper.style.display = 'contents';

  if (!info.available) {
    wrapper.appendChild(createPageButton(setId, null, 'unavailable'));
  } else if (pageHasVideo && info.hasVideo) {
    wrapper.appendChild(createPageButton(setId, true, 'available'));
    wrapper.appendChild(createPageButton(setId, false, 'available'));
  } else {
    wrapper.appendChild(createPageButton(setId, null, 'available'));
  }

  const firstDownload = container.querySelector(SELECTORS.PAGE_DOWNLOAD_LINK);
  if (firstDownload) firstDownload.before(wrapper);
}

function updateCardButton(menu: Element, setId: number, info: BeatmapInfo): void {
  const loadingBtn = menu.querySelector(`.${CSS_CLASSES.RAI_CARD_ITEM}.${CSS_CLASSES.RAI_LOADING}`);
  if (loadingBtn) loadingBtn.remove();

  if (!info.available) return;

  const btn = createCardButton(setId, 'available');
  menu.insertBefore(btn, menu.firstElementChild);
}

export function clearPageButtons(): void {
  document.querySelectorAll(`.${CSS_CLASSES.RAI_CONTAINER}`).forEach((el) => el.remove());
}

export function clearCardButtons(): void {
  document.querySelectorAll(`.${CSS_CLASSES.RAI_CARD_ITEM}`).forEach((el) => el.remove());
  document.querySelectorAll('[data-rai-hover]').forEach((el) => el.removeAttribute('data-rai-hover'));
}

export async function injectPageButtons(): Promise<void> {
  const setId = extractSetId(window.location.href);
  if (!setId) return;

  const container = await waitForElement(SELECTORS.PAGE_BUTTONS);
  if (!container) return;

  const existingContainer = container.querySelector(`.${CSS_CLASSES.RAI_CONTAINER}`);
  if (existingContainer) {
    const existingSetId = existingContainer.getAttribute('data-set-id');
    if (existingSetId === String(setId)) return;
    existingContainer.remove();
  }

  const firstOsuDownload = container.querySelector(SELECTORS.PAGE_DOWNLOAD_LINK);
  if (!firstOsuDownload) return;

  const hasVideo = document.querySelector(SELECTORS.PAGE_VIDEO_ICON) !== null;

  const wrapper = document.createElement('div');
  wrapper.className = CSS_CLASSES.RAI_CONTAINER;
  wrapper.setAttribute('data-set-id', String(setId));
  wrapper.style.display = 'contents';
  wrapper.appendChild(createPageButton(setId, null, 'loading'));
  firstOsuDownload.before(wrapper);

  const info = await getBeatmapInfo(setId);
  updatePageButtons(container, setId, info, hasVideo);
}

export function setupCardHoverListeners(): void {
  const cards = document.querySelectorAll(SELECTORS.CARD);

  for (const card of cards) {
    if (card.hasAttribute('data-rai-hover')) continue;
    card.setAttribute('data-rai-hover', 'true');

    card.addEventListener('mouseenter', async () => {
      const menu = card.querySelector(SELECTORS.CARD_MENU);
      if (!menu) return;

      if (menu.querySelector(`.${CSS_CLASSES.RAI_CARD_ITEM}`)) return;

      const link = card.querySelector(SELECTORS.CARD_LINK) as HTMLAnchorElement | null;
      if (!link) return;

      const setId = extractSetId(link.href);
      if (!setId) return;

      const loadingBtn = createCardButton(setId, 'loading');
      menu.insertBefore(loadingBtn, menu.firstElementChild);

      const info = await getBeatmapInfo(setId);
      updateCardButton(menu, setId, info);
    }, { once: true });
  }
}
