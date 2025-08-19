// 유틸리티 함수들

// DOM 조작 유틸리티
const DOM = {
  // 요소 선택
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  // 다중 요소 선택
  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  // 요소 생성
  create(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });

    return element;
  },

  // 클래스 토글
  toggleClass(element, className, force) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    return element?.classList.toggle(className, force);
  },

  // 애니메이션
  animate(element, keyframes, options = {}) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (!element) return Promise.resolve();

    return element.animate(keyframes, {
      duration: APP_CONFIG.animation.duration.normal,
      easing: APP_CONFIG.animation.easing,
      ...options
    }).finished;
  },

  // 페이드 인
  fadeIn(element, duration = APP_CONFIG.animation.duration.normal) {
    return this.animate(element, [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration });
  },

  // 페이드 아웃
  fadeOut(element, duration = APP_CONFIG.animation.duration.normal) {
    return this.animate(element, [
      { opacity: 1 },
      { opacity: 0 }
    ], { duration });
  },

  // 슬라이드 업
  slideUp(element, duration = APP_CONFIG.animation.duration.normal) {
    return this.animate(element, [
      { maxHeight: element.scrollHeight + 'px', opacity: 1 },
      { maxHeight: '0px', opacity: 0 }
    ], { duration });
  },

  // 슬라이드 다운
  slideDown(element, duration = APP_CONFIG.animation.duration.normal) {
    return this.animate(element, [
      { maxHeight: '0px', opacity: 0 },
      { maxHeight: element.scrollHeight + 'px', opacity: 1 }
    ], { duration });
  }
};

// 문자열 유틸리티
const StringUtils = {
  // 템플릿 문자열 처리
  template(str, data) {
    return str.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
  },

  // 문자열 자르기
  truncate(str, length, suffix = '...') {
    return str.length > length ? str.substring(0, length) + suffix : str;
  },

  // 카멜케이스 변환
  toCamelCase(str) {
    return str.replace(/[-_]([a-z])/g, (match, letter) => letter.toUpperCase());
  },

  // 케밥케이스 변환  
  toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },

  // HTML 이스케이프
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // 랜덤 ID 생성
  generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// 날짜/시간 유틸리티
const DateUtils = {
  // 포맷팅
  format(date, format = 'YYYY-MM-DD') {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes);
  },

  // 상대적 시간
  timeAgo(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const units = [
      { name: '년', seconds: 31536000 },
      { name: '개월', seconds: 2592000 },
      { name: '일', seconds: 86400 },
      { name: '시간', seconds: 3600 },
      { name: '분', seconds: 60 }
    ];

    for (const unit of units) {
      const interval = Math.floor(diffInSeconds / unit.seconds);
      if (interval >= 1) {
        return `${interval}${unit.name} 전`;
      }
    }

    return '방금 전';
  },

  // 날짜 추가
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

// 배열 유틸리티
const ArrayUtils = {
  // 중복 제거
  unique(array) {
    return [...new Set(array)];
  },

  // 그룹화
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = typeof key === 'function' ? key(item) : item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // 청크 분할
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // 셔플
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// 객체 유틸리티
const ObjectUtils = {
  // 깊은 복사
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  // 깊은 병합
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  },

  // 객체에서 키 선택
  pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  // 객체에서 키 제외
  omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  }
};

// 유효성 검사 유틸리티
const ValidationUtils = {
  // 필수 값 검사
  required(value) {
    return value !== null && value !== undefined && value !== '';
  },

  // 이메일 검사
  email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },

  // 최소 길이 검사
  minLength(value, min) {
    return value.length >= min;
  },

  // 최대 길이 검사
  maxLength(value, max) {
    return value.length <= max;
  },

  // 숫자 범위 검사
  range(value, min, max) {
    const num = Number(value);
    return num >= min && num <= max;
  },

  // 폼 검증
  validateForm(formData, rules) {
    const errors = {};
    
    Object.entries(rules).forEach(([field, fieldRules]) => {
      const value = formData[field];
      
      if (fieldRules.required && !this.required(value)) {
        errors[field] = ERROR_MESSAGES.required;
        return;
      }
      
      if (value && fieldRules.minLength && !this.minLength(value, fieldRules.minLength)) {
        errors[field] = StringUtils.template(ERROR_MESSAGES.minLength, { min: fieldRules.minLength });
        return;
      }
      
      if (value && fieldRules.maxLength && !this.maxLength(value, fieldRules.maxLength)) {
        errors[field] = StringUtils.template(ERROR_MESSAGES.maxLength, { max: fieldRules.maxLength });
        return;
      }
      
      if (value && fieldRules.email && !this.email(value)) {
        errors[field] = ERROR_MESSAGES.invalid;
        return;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// 로컬 스토리지 유틸리티
const StorageUtils = {
  // 값 저장
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  // 값 조회
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  // 값 삭제
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  // 모든 값 삭제
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  // 키 존재 여부 확인
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  // 스토리지 크기 확인
  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return total;
  }
};

// 디바운스 유틸리티
const DebounceUtils = {
  // 디바운스 함수 생성
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // 스로틀 함수 생성
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// 이벤트 유틸리티
const EventUtils = {
  // 이벤트 위임
  delegate(parent, selector, event, handler) {
    parent.addEventListener(event, function(e) {
      if (e.target.matches(selector)) {
        handler.call(e.target, e);
      }
    });
  },

  // 커스텀 이벤트 발생
  emit(element, eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },

  // 한 번만 실행되는 이벤트 리스너
  once(element, event, handler) {
    const onceHandler = (e) => {
      handler(e);
      element.removeEventListener(event, onceHandler);
    };
    element.addEventListener(event, onceHandler);
  }
};

// 네트워크 유틸리티
const NetworkUtils = {
  // HTTP 요청
  async request(url, options = {}) {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = { ...defaultOptions, ...options };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('Network request failed:', error);
      throw error;
    }
  },

  // GET 요청
  get(url, params = {}) {
    const urlWithParams = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      urlWithParams.searchParams.append(key, value);
    });
    return this.request(urlWithParams.toString());
  },

  // POST 요청
  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: data
    });
  },

  // PUT 요청
  put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: data
    });
  },

  // DELETE 요청
  delete(url) {
    return this.request(url, {
      method: 'DELETE'
    });
  }
};

// 퍼포먼스 유틸리티
const PerformanceUtils = {
  // 함수 실행 시간 측정
  measure(func, name = 'function') {
    return function(...args) {
      const start = performance.now();
      const result = func.apply(this, args);
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    };
  },

  // 메모이제이션
  memoize(func) {
    const cache = new Map();
    return function(...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    };
  },

  // RAF 기반 애니메이션
  animate(callback, duration = 1000) {
    const start = performance.now();
    
    function frame(time) {
      const progress = Math.min((time - start) / duration, 1);
      callback(progress);
      
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }
    
    requestAnimationFrame(frame);
  }
};

// 브라우저 호환성 유틸리티
const BrowserUtils = {
  // 기능 지원 여부 확인
  supports: {
    localStorage: (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    
    webAnimations: 'animate' in document.createElement('div'),
    
    fetch: 'fetch' in window,
    
    intersection: 'IntersectionObserver' in window,
    
    css: {
      grid: CSS.supports('display', 'grid'),
      flexbox: CSS.supports('display', 'flex'),
      customProperties: CSS.supports('--custom', 'property')
    }
  },

  // 사용자 에이전트 정보
  getUserAgent() {
    const ua = navigator.userAgent;
    return {
      isMobile: /Mobile|Android|iPhone|iPad/i.test(ua),
      isTablet: /iPad|Android/i.test(ua) && !/Mobile/i.test(ua),
      isDesktop: !/Mobile|Android|iPhone|iPad/i.test(ua),
      isChrome: /Chrome/i.test(ua),
      isFirefox: /Firefox/i.test(ua),
      isSafari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
      isEdge: /Edge/i.test(ua)
    };
  },

  // 다크 모드 감지
  prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  // 접근성 설정 감지
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// 포맷터 유틸리티
const FormatUtils = {
  // 숫자 포맷
  number(value, options = {}) {
    return new Intl.NumberFormat('ko-KR', options).format(value);
  },

  // 통화 포맷
  currency(value, currency = 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency
    }).format(value);
  },

  // 퍼센트 포맷
  percent(value, decimals = 1) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  },

  // 파일 크기 포맷
  fileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
};

// 색상 유틸리티
const ColorUtils = {
  // HEX를 RGB로 변환
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // RGB를 HEX로 변환
  rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  },

  // 색상 밝기 계산
  getBrightness(hex) {
    const rgb = this.hexToRgb(hex);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },

  // 색상이 밝은지 어두운지 판단
  isLight(hex) {
    return this.getBrightness(hex) > 128;
  }
};