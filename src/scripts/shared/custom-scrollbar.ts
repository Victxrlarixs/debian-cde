/**
 * Custom Motif/CDE Scrollbar Implementation
 * Works across all browsers (Chrome, Firefox, Safari, Edge)
 * Provides authentic Unix scrollbar experience with arrow buttons
 */

interface ScrollbarConfig {
  element: HTMLElement;
  orientation: 'vertical' | 'horizontal';
}

class MotifScrollbar {
  private container: HTMLElement;
  private content: HTMLElement;
  private scrollbar: HTMLElement;
  private track: HTMLElement;
  private thumb: HTMLElement;
  private btnUp: HTMLElement;
  private btnDown: HTMLElement;
  private orientation: 'vertical' | 'horizontal';
  private isDragging = false;
  private dragStartPos = 0;
  private dragStartScroll = 0;

  constructor(config: ScrollbarConfig) {
    this.container = config.element;
    this.orientation = config.orientation;
    this.content = this.wrapContent();
    this.scrollbar = this.createScrollbar();
    this.track = this.scrollbar.querySelector('.motif-scrollbar-track') as HTMLElement;
    this.thumb = this.scrollbar.querySelector('.motif-scrollbar-thumb') as HTMLElement;
    this.btnUp = this.scrollbar.querySelector('.motif-scrollbar-btn-up') as HTMLElement;
    this.btnDown = this.scrollbar.querySelector('.motif-scrollbar-btn-down') as HTMLElement;

    this.attachEvents();
    this.updateThumb();
  }

  private wrapContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'motif-scrollbar-content';
    wrapper.style.overflow = 'hidden';
    wrapper.style.flex = '1';
    wrapper.style.position = 'relative';

    const content = document.createElement('div');
    content.className = 'motif-scrollbar-inner';
    content.style.overflow = 'auto';
    content.style.height = '100%';
    content.style.width = '100%';
    content.style.scrollbarWidth = 'none'; // Firefox
    content.style.msOverflowStyle = 'none'; // IE/Edge

    // Hide native scrollbar
    const style = document.createElement('style');
    style.textContent = `
      .motif-scrollbar-inner::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);

    // Move all children to content
    while (this.container.firstChild) {
      content.appendChild(this.container.firstChild);
    }

    wrapper.appendChild(content);
    this.container.appendChild(wrapper);
    this.container.style.display = 'flex';
    this.container.style.flexDirection = this.orientation === 'vertical' ? 'row' : 'column';

    return content;
  }

  private createScrollbar(): HTMLElement {
    const scrollbar = document.createElement('div');
    scrollbar.className = `motif-scrollbar motif-scrollbar-${this.orientation}`;

    const btnUp = document.createElement('div');
    btnUp.className = 'motif-scrollbar-btn motif-scrollbar-btn-up';
    btnUp.innerHTML = `<img src="/icons/ui/scrollbarArrow${this.orientation === 'vertical' ? 'Up' : 'Left'}.png" alt="">`;

    const track = document.createElement('div');
    track.className = 'motif-scrollbar-track';

    const thumb = document.createElement('div');
    thumb.className = 'motif-scrollbar-thumb';

    track.appendChild(thumb);

    const btnDown = document.createElement('div');
    btnDown.className = 'motif-scrollbar-btn motif-scrollbar-btn-down';
    btnDown.innerHTML = `<img src="/icons/ui/scrollbarArrow${this.orientation === 'vertical' ? 'Down' : 'Right'}.png" alt="">`;

    scrollbar.appendChild(btnUp);
    scrollbar.appendChild(track);
    scrollbar.appendChild(btnDown);

    this.container.appendChild(scrollbar);

    return scrollbar;
  }

  private attachEvents(): void {
    // Arrow buttons
    this.btnUp.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.scrollByStep(-30);
      this.btnUp.classList.add('active');
      const img = this.btnUp.querySelector('img');
      if (img)
        img.src = `/icons/scrollbarArrow${this.orientation === 'vertical' ? 'Up' : 'Left'}Pressed.png`;
    });

    this.btnUp.addEventListener('mouseup', () => {
      this.btnUp.classList.remove('active');
      const img = this.btnUp.querySelector('img');
      if (img)
        img.src = `/icons/scrollbarArrow${this.orientation === 'vertical' ? 'Up' : 'Left'}.png`;
    });

    this.btnDown.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.scrollByStep(30);
      this.btnDown.classList.add('active');
      const img = this.btnDown.querySelector('img');
      if (img)
        img.src = `/icons/scrollbarArrow${this.orientation === 'vertical' ? 'Down' : 'Right'}Pressed.png`;
    });

    this.btnDown.addEventListener('mouseup', () => {
      this.btnDown.classList.remove('active');
      const img = this.btnDown.querySelector('img');
      if (img)
        img.src = `/icons/scrollbarArrow${this.orientation === 'vertical' ? 'Down' : 'Right'}.png`;
    });

    // Thumb dragging
    this.thumb.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.isDragging = true;
      this.dragStartPos = this.orientation === 'vertical' ? e.clientY : e.clientX;
      this.dragStartScroll =
        this.orientation === 'vertical' ? this.content.scrollTop : this.content.scrollLeft;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const delta = (this.orientation === 'vertical' ? e.clientY : e.clientX) - this.dragStartPos;
      const scrollRatio = this.getScrollRatio();
      const scrollDelta = delta / scrollRatio;

      if (this.orientation === 'vertical') {
        this.content.scrollTop = this.dragStartScroll + scrollDelta;
      } else {
        this.content.scrollLeft = this.dragStartScroll + scrollDelta;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        document.body.style.userSelect = '';
      }
    });

    // Track click
    this.track.addEventListener('mousedown', (e) => {
      if (e.target === this.thumb) return;
      const rect = this.track.getBoundingClientRect();
      const clickPos =
        this.orientation === 'vertical' ? e.clientY - rect.top : e.clientX - rect.left;
      const thumbPos =
        this.orientation === 'vertical' ? this.thumb.offsetTop : this.thumb.offsetLeft;

      if (clickPos < thumbPos) {
        this.scrollByPage(-1);
      } else {
        this.scrollByPage(1);
      }
    });

    // Content scroll
    this.content.addEventListener('scroll', () => {
      this.updateThumb();
    });

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      this.updateThumb();
    });
    resizeObserver.observe(this.content);
    resizeObserver.observe(this.container);
  }

  private scrollByStep(amount: number): void {
    if (this.orientation === 'vertical') {
      this.content.scrollTop += amount;
    } else {
      this.content.scrollLeft += amount;
    }
  }

  private scrollByPage(direction: number): void {
    const pageSize =
      this.orientation === 'vertical' ? this.content.clientHeight : this.content.clientWidth;
    this.scrollByStep(pageSize * direction * 0.8);
  }

  private getScrollRatio(): number {
    if (this.orientation === 'vertical') {
      const trackHeight = this.track.clientHeight;
      const thumbHeight = this.thumb.clientHeight;
      const scrollHeight = this.content.scrollHeight - this.content.clientHeight;
      return (trackHeight - thumbHeight) / scrollHeight;
    } else {
      const trackWidth = this.track.clientWidth;
      const thumbWidth = this.thumb.clientWidth;
      const scrollWidth = this.content.scrollWidth - this.content.clientWidth;
      return (trackWidth - thumbWidth) / scrollWidth;
    }
  }

  private updateThumb(): void {
    if (this.orientation === 'vertical') {
      const scrollHeight = this.content.scrollHeight;
      const clientHeight = this.content.clientHeight;
      const scrollTop = this.content.scrollTop;

      if (scrollHeight <= clientHeight) {
        this.scrollbar.style.display = 'none';
        return;
      }

      this.scrollbar.style.display = 'flex';

      const thumbHeight = Math.max((clientHeight / scrollHeight) * this.track.clientHeight, 40);
      const thumbTop =
        (scrollTop / (scrollHeight - clientHeight)) * (this.track.clientHeight - thumbHeight);

      this.thumb.style.height = `${thumbHeight}px`;
      this.thumb.style.top = `${thumbTop}px`;
    } else {
      const scrollWidth = this.content.scrollWidth;
      const clientWidth = this.content.clientWidth;
      const scrollLeft = this.content.scrollLeft;

      if (scrollWidth <= clientWidth) {
        this.scrollbar.style.display = 'none';
        return;
      }

      this.scrollbar.style.display = 'flex';

      const thumbWidth = Math.max((clientWidth / scrollWidth) * this.track.clientWidth, 40);
      const thumbLeft =
        (scrollLeft / (scrollWidth - clientWidth)) * (this.track.clientWidth - thumbWidth);

      this.thumb.style.width = `${thumbWidth}px`;
      this.thumb.style.left = `${thumbLeft}px`;
    }
  }
}

// Auto-initialize scrollbars
export function initCustomScrollbars(): void {
  const selectors = [
    '.fm-files',
    '.fm-sidebar',
    '#emacs-textarea',
    '.emacs-splash',
    '.window-body',
    '.modal-body',
    '.ns-content',
    '.lynx-content',
    '.man-content',
    '#process-monitor-content',
    '.backdrop-modal-body',
    '.terminal-output',
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (!(el as HTMLElement).dataset.motifScrollbar) {
        new MotifScrollbar({
          element: el as HTMLElement,
          orientation: 'vertical',
        });
        (el as HTMLElement).dataset.motifScrollbar = 'true';
      }
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomScrollbars);
} else {
  initCustomScrollbars();
}
