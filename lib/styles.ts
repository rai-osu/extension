import { CSS_CLASSES } from './constants';

const STYLES = `
.${CSS_CLASSES.RAI_BUTTON} {
  background: #DB2777 !important;
  border-color: #DB2777 !important;
  transition: all 0.15s ease !important;
  position: relative;
  overflow: hidden;
}

.${CSS_CLASSES.RAI_BUTTON}:hover {
  background: #F472B6 !important;
  border-color: #F472B6 !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -5px rgba(244, 114, 182, 0.4) !important;
}

.${CSS_CLASSES.RAI_BUTTON}:active {
  transform: scale(0.98) !important;
}

.${CSS_CLASSES.RAI_BUTTON} .btn-osu-big__text-top {
  font-weight: 700 !important;
}

.${CSS_CLASSES.RAI_BUTTON} .btn-osu-big__text-bottom {
  opacity: 0.9;
}

.rai-icon-svg {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  fill: none;
  stroke: currentColor;
}

.${CSS_CLASSES.RAI_BUTTON}.${CSS_CLASSES.RAI_LOADING} {
  pointer-events: none;
  opacity: 0.8;
}

.${CSS_CLASSES.RAI_BUTTON}.${CSS_CLASSES.RAI_LOADING}::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: rai-shimmer 1.5s infinite;
}

@keyframes rai-shimmer {
  100% { left: 100%; }
}

.${CSS_CLASSES.RAI_BUTTON}.${CSS_CLASSES.RAI_UNAVAILABLE} {
  background: #1F2937 !important;
  border-color: #1F2937 !important;
  cursor: default;
}

.${CSS_CLASSES.RAI_BUTTON}.${CSS_CLASSES.RAI_UNAVAILABLE}:hover {
  background: #374151 !important;
  border-color: #374151 !important;
  transform: none;
  box-shadow: none !important;
}

.${CSS_CLASSES.RAI_BUTTON}.${CSS_CLASSES.RAI_UNAVAILABLE} .btn-osu-big__text-bottom {
  color: #F472B6 !important;
  font-weight: 500;
}

.${CSS_CLASSES.RAI_CARD_ITEM} {
  color: #F472B6 !important;
  transition: all 0.15s ease !important;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.${CSS_CLASSES.RAI_CARD_ITEM} .rai-icon-svg {
  width: 18px;
  height: 18px;
  filter: none;
}

.${CSS_CLASSES.RAI_CARD_ITEM}:hover {
  color: #F9A8D4 !important;
  transform: scale(1.1);
}

.${CSS_CLASSES.RAI_CARD_ITEM}.${CSS_CLASSES.RAI_LOADING} {
  pointer-events: none;
  animation: rai-pulse 1s infinite;
}

@keyframes rai-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.${CSS_CLASSES.RAI_CARD_ITEM}.${CSS_CLASSES.RAI_UNAVAILABLE} {
  color: #6B7280 !important;
}

.${CSS_CLASSES.RAI_CARD_ITEM}.${CSS_CLASSES.RAI_UNAVAILABLE}:hover {
  color: #F472B6 !important;
}

.rai-spinner {
  animation: rai-spin 1s linear infinite;
}

@keyframes rai-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

export function injectStyles(): void {
  if (document.getElementById(CSS_CLASSES.STYLES_ID)) return;

  const style = document.createElement('style');
  style.id = CSS_CLASSES.STYLES_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}
