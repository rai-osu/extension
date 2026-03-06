import { injectStyles } from '@/lib/styles';
import { injectPageButtons, setupCardHoverListeners, clearPageButtons, clearCardButtons } from '@/lib/dom';
import { SELECTORS } from '@/lib/constants';

let lastUrl = location.href;

function handleNavigation() {
  clearPageButtons();
  clearCardButtons();
  injectPageButtons();
  setupCardHoverListeners();
}

export default defineContentScript({
  matches: ['*://osu.ppy.sh/beatmapsets*'],
  runAt: 'document_idle',

  main(ctx) {
    injectStyles();
    injectPageButtons();
    setupCardHoverListeners();

    ctx.addEventListener(window, 'wxt:locationchange', handleNavigation);

    const urlChecker = setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        handleNavigation();
      }
    }, 500);

    ctx.onInvalidated(() => clearInterval(urlChecker));

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;

          if (node.matches?.(SELECTORS.CARD) || node.querySelector?.(SELECTORS.CARD)) {
            setupCardHoverListeners();
            return;
          }

          if (node.matches?.(SELECTORS.PAGE_BUTTONS) || node.querySelector?.(SELECTORS.PAGE_BUTTONS)) {
            injectPageButtons();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    ctx.onInvalidated(() => observer.disconnect());
  },
});
