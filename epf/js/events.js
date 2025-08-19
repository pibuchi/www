// 이벤트 처리 클래스
class EventManager {
  constructor() {
    this.eventListeners = new Map();
    this.customEvents = new Map();
    this.eventQueue = [];
    this.isProcessingQueue = false;
    this.eventStats = {
      totalEvents: 0,
      eventsByType: {},
      errorCount: 0
    };
  }

  // 초기화
  init() {
    this.setupGlobalEventListeners();
    this.setupCustomEventHandlers();
    this.setupErrorHandling();
    this.startEventQueueProcessor();
    
    console.log('EventManager initialized');
  }

  // 전역 이벤트 리스너 설정
  setupGlobalEventListeners() {
    // 모드 변경 이벤트
    this.on('.mode-nav-item', 'click', this.handleModeChange.bind(this));
    
    // 페이지 네비게이션 이벤트
    this.on('.nav-item', 'click', this.handlePageNavigation.bind(this));
    
    // 사이드바 섹션 이벤트
    this.on('.sidebar-item', 'click', this.handleSectionChange.bind(this));
    
    // 폼 입력 이벤트
    this.on('input, select, textarea', 'input', this.handleFormInput.bind(this));
    this.on('input, select, textarea', 'change', this.handleFormChange.bind(this));
    
    // 버튼 클릭 이벤트
    this.on('.next-section-btn', 'click', this.handleNextSection.bind(this));
    this.on('.guide-help-btn', 'click', this.handleGuideHelp.bind(this));
    this.on('.complete-workflow-btn', 'click', this.handleWorkflowComplete.bind(this));
    this.on('.export-report-btn', 'click', this.handleReportExport.bind(this));
    this.on('.setup-alerts-btn', 'click', this.handleAlertsSetup.bind(this));
    
    // 프로젝트 관련 이벤트
    this.on('.project-card', 'click', this.handleProjectClick.bind(this));
    
    // 키보드 이벤트
    this.setupKeyboardEvents();
    
    // 윈도우 이벤트
    this.setupWindowEvents();
  }

  // 이벤트 리스너 등록 (위임 방식)
  on(selector, event, handler, options = {}) {
    const wrappedHandler = (e) => {
      try {
        // 이벤트 통계 업데이트
        this.updateEventStats(event);
        
        // 실제 핸들러 실행
        if (e.target.matches(selector) || e.target.closest(selector)) {
          const target = e.target.matches(selector) ? e.target : e.target.closest(selector);
          handler.call(target, e);
        }
      } catch (error) {
        this.handleEventError(error, { selector, event, target: e.target });
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener(event, wrappedHandler, options);
    
    // 리스너 추적
    const listenerId = `${selector}-${event}-${Date.now()}`;
    this.eventListeners.set(listenerId, {
      selector,
      event,
      handler: wrappedHandler,
      originalHandler: handler,
      options
    });
    
    return listenerId;
  }

  // 이벤트 리스너 제거
  off(listenerId) {
    const listener = this.eventListeners.get(listenerId);
    if (listener) {
      document.removeEventListener(listener.event, listener.handler, listener.options);
      this.eventListeners.delete(listenerId);
      return true;
    }
    return false;
  }

  // 커스텀 이벤트 등록
  registerCustomEvent(eventName, handler) {
    if (!this.customEvents.has(eventName)) {
      this.customEvents.set(eventName, []);
    }
    this.customEvents.get(eventName).push(handler);
    
    return () => {
      const handlers = this.customEvents.get(eventName);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  // 커스텀 이벤트 발생
  emit(eventName, data = {}) {
    const handlers = this.customEvents.get(eventName) || [];
    
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        this.handleEventError(error, { eventName, data });
      }
    });
    
    // DOM 이벤트로도 발생
    const event = new CustomEvent(eventName, { 
      detail: data,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  // 이벤트 큐에 추가
  queueEvent(eventData) {
    this.eventQueue.push({
      ...eventData,
      timestamp: Date.now(),
      id: StringUtils.generateId('event')
    });
  }

  // 이벤트 큐 처리기 시작
  startEventQueueProcessor() {
    setInterval(() => {
      this.processEventQueue();
    }, 100); // 100ms마다 처리
  }

  // 이벤트 큐 처리
  async processEventQueue() {
    if (this.isProcessingQueue || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        await this.processQueuedEvent(event);
      }
    } catch (error) {
      console.error('Error processing event queue:', error);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // 큐된 이벤트 처리
  async processQueuedEvent(eventData) {
    const { type, data, callback } = eventData;
    
    try {
      switch (type) {
        case 'auto-save':
          await this.handleAutoSave(data);
          break;
        case 'analytics':
          await this.handleAnalyticsEvent(data);
          break;
        case 'notification':
          await this.handleNotificationEvent(data);
          break;
        default:
          console.warn(`Unknown queued event type: ${type}`);
      }
      
      if (callback) {
        callback(null, eventData);
      }
    } catch (error) {
      if (callback) {
        callback(error, eventData);
      }
      throw error;
    }
  }

  // 키보드 이벤트 설정
  setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + 키 조합
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.handleShortcut('page-dashboard');
            break;
          case '2':
            e.preventDefault();
            this.handleShortcut('page-projects');
            break;
          case '3':
            e.preventDefault();
            this.handleShortcut('page-settings');
            break;
          case 's':
            e.preventDefault();
            this.handleShortcut('save');
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              this.handleShortcut('redo');
            } else {
              e.preventDefault();
              this.handleShortcut('undo');
            }
            break;
        }
      }

      // Alt + 키 조합 (모드 전환)
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.handleShortcut('mode-tool');
            break;
          case '2':
            e.preventDefault();
            this.handleShortcut('mode-guide');
            break;
          case '3':
            e.preventDefault();
            this.handleShortcut('mode-hybrid');
            break;
        }
      }

      // 단일 키
      switch (e.key) {
        case 'F1':
          e.preventDefault();
          this.handleShortcut('help');
          break;
        case 'Escape':
          e.preventDefault();
          this.handleShortcut('escape');
          break;
      }
    });
  }

  // 윈도우 이벤트 설정
  setupWindowEvents() {
    // 페이지 언로드 시 자동 저장
    window.addEventListener('beforeunload', (e) => {
      this.handleBeforeUnload(e);
    });

    // 온라인/오프라인 상태 변경
    window.addEventListener('online', () => {
      this.emit('connection:online');
    });

    window.addEventListener('offline', () => {
      this.emit('connection:offline');
    });

    // 창 크기 변경
    window.addEventListener('resize', DebounceUtils.debounce(() => {
      this.emit('window:resize', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 250));

    // 스크롤 이벤트
    window.addEventListener('scroll', DebounceUtils.throttle(() => {
      this.emit('window:scroll', {
        scrollY: window.scrollY,
        scrollX: window.scrollX
      });
    }, 100));
  }

  // 커스텀 이벤트 핸들러 설정
  setupCustomEventHandlers() {
    // 상태 변경 이벤트
    this.registerCustomEvent('state:change', this.handleStateChange.bind(this));
    
    // 모드 변경 이벤트
    this.registerCustomEvent('mode:change', this.handleModeChangeEvent.bind(this));
    
    // 페이지 변경 이벤트
    this.registerCustomEvent('page:change', this.handlePageChangeEvent.bind(this));
    
    // 섹션 변경 이벤트
    this.registerCustomEvent('section:change', this.handleSectionChangeEvent.bind(this));
    
    // 프로젝트 이벤트
    this.registerCustomEvent('project:save', this.handleProjectSave.bind(this));
    this.registerCustomEvent('project:load', this.handleProjectLoad.bind(this));
    
    // 오류 이벤트
    this.registerCustomEvent('error:handler', this.handleApplicationError.bind(this));
  }

  // 오류 처리 설정
  setupErrorHandling() {
    // 전역 오류 처리
    window.addEventListener('error', (e) => {
      this.handleGlobalError(e);
    });

    // Promise 오류 처리
    window.addEventListener('unhandledrejection', (e) => {
      this.handleUnhandledRejection(e);
    });
  }

  // === 이벤트 핸들러 메서드들 ===

  // 모드 변경 핸들러
  handleModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode && Object.values(MODES).includes(mode)) {
      modeManager.switchMode(mode);
      
      this.queueEvent({
        type: 'analytics',
        data: {
          action: 'mode_change',
          mode: mode,
          timestamp: Date.now()
        }
      });
    }
  }

  // 페이지 네비게이션 핸들러
  handlePageNavigation(e) {
    const page = e.currentTarget.dataset.page;
    if (page && Object.values(PAGES).includes(page)) {
      pageManager.switchPage(page);
      
      this.queueEvent({
        type: 'analytics',
        data: {
          action: 'page_navigation',
          page: page,
          timestamp: Date.now()
        }
      });
    }
  }

  // 섹션 변경 핸들러
  handleSectionChange(e) {
    const section = e.currentTarget.dataset.section;
    if (section && SECTIONS.includes(section)) {
      // 현재 폼 데이터 저장
      app.saveCurrentFormData();
      
      // 섹션 변경
      appState.setSection(section);
      
      this.queueEvent({
        type: 'analytics',
        data: {
          action: 'section_change',
          section: section,
          timestamp: Date.now()
        }
      });
    }
  }

  // 폼 입력 핸들러
  handleFormInput(e) {
    const field = e.target.dataset.field;
    if (field) {
      // 디바운스된 자동 저장
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = setTimeout(() => {
        this.queueEvent({
          type: 'auto-save',
          data: {
            field: field,
            value: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
            section: appState.getState('currentSection')
          }
        });
      }, 1000);
    }
  }

  // 폼 변경 핸들러
  handleFormChange(e) {
    const field = e.target.dataset.field;
    if (field) {
      const currentSection = appState.getState('currentSection');
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      
      // 즉시 상태 업데이트
      appState.updateFormData(currentSection, { [field]: value });
      
      this.emit('form:change', {
        field: field,
        value: value,
        section: currentSection
      });
    }
  }

  // 다음 섹션 핸들러
  handleNextSection(e) {
    // 현재 폼 데이터 저장
    app.saveCurrentFormData();
    
    // 유효성 검사
    const isValid = this.validateCurrentSection();
    if (!isValid) {
      app.showErrorMessage('필수 입력 항목을 확인해주세요.');
      return;
    }
    
    // 다음 섹션으로 이동
    const nextSection = sectionManager.nextSection();
    if (nextSection) {
      this.emit('section:progress', {
        fromSection: appState.getState('currentSection'),
        toSection: nextSection
      });
    }
  }

  // 가이드 도움말 핸들러
  handleGuideHelp(e) {
    const currentMode = appState.getState('currentMode');
    const targetMode = currentMode === MODES.TOOL ? MODES.HYBRID : MODES.GUIDE;
    
    modeManager.switchMode(targetMode);
    
    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'help_requested',
        currentMode: currentMode,
        targetMode: targetMode,
        section: appState.getState('currentSection')
      }
    });
  }

  // 워크플로우 완료 핸들러
  handleWorkflowComplete(e) {
    app.completeWorkflow();
    
    this.emit('workflow:complete', {
      projectId: appState.getCurrentProject()?.id,
      completedAt: new Date().toISOString(),
      duration: this.calculateWorkflowDuration()
    });
  }

  // 보고서 내보내기 핸들러
  handleReportExport(e) {
    app.exportReport();
    
    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'report_export',
        projectId: appState.getCurrentProject()?.id,
        timestamp: Date.now()
      }
    });
  }

  // 알림 설정 핸들러
  handleAlertsSetup(e) {
    app.setupAlerts();
    
    this.emit('alerts:setup', {
      timestamp: Date.now()
    });
  }

  // 프로젝트 클릭 핸들러
  handleProjectClick(e) {
    // 버튼 클릭 시에는 프로젝트 열기 방지
    if (e.target.closest('button')) return;
    
    const projectId = e.currentTarget.dataset.project;
    if (projectId) {
      pageManager.openProject(projectId);
    }
  }

  // 단축키 핸들러
  handleShortcut(shortcutType) {
    switch (shortcutType) {
      case 'page-dashboard':
        pageManager.switchPage(PAGES.DASHBOARD);
        break;
      case 'page-projects':
        pageManager.switchPage(PAGES.PROJECTS);
        break;
      case 'page-settings':
        pageManager.switchPage(PAGES.SETTINGS);
        break;
      case 'save':
        appState.autoSave();
        app.showSuccessMessage('저장되었습니다.');
        break;
      case 'mode-tool':
        modeManager.switchMode(MODES.TOOL);
        break;
      case 'mode-guide':
        modeManager.switchMode(MODES.GUIDE);
        break;
      case 'mode-hybrid':
        modeManager.switchMode(MODES.HYBRID);
        break;
      case 'help':
        const currentMode = appState.getState('currentMode');
        modeManager.showModeHelp(currentMode);
        break;
      case 'escape':
        this.handleEscape();
        break;
      case 'undo':
        this.handleUndo();
        break;
      case 'redo':
        this.handleRedo();
        break;
    }

    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'shortcut_used',
        shortcut: shortcutType,
        timestamp: Date.now()
      }
    });
  }

  // ESC 키 핸들러
  handleEscape() {
    // 모달이 열려있으면 닫기
    const activeModal = DOM.$('.modal.active');
    if (activeModal) {
      activeModal.remove();
      return;
    }
    
    // 드롭다운이 열려있으면 닫기
    const activeDropdown = DOM.$('.dropdown.active');
    if (activeDropdown) {
      activeDropdown.classList.remove('active');
      return;
    }
    
    // 이전 모드로 돌아가기
    modeManager.goToPreviousMode();
  }

  // 실행 취소 핸들러
  handleUndo() {
    // 실행 취소 기능 구현
    console.log('Undo requested');
    app.showToast('실행 취소 기능은 곧 구현됩니다.', 'info');
  }

  // 다시 실행 핸들러
  handleRedo() {
    // 다시 실행 기능 구현
    console.log('Redo requested');
    app.showToast('다시 실행 기능은 곧 구현됩니다.', 'info');
  }

  // 페이지 언로드 전 핸들러
  handleBeforeUnload(e) {
    // 자동 저장
    appState.autoSave();
    
    // 저장되지 않은 변경사항이 있는지 확인
    const hasUnsavedChanges = this.checkUnsavedChanges();
    if (hasUnsavedChanges) {
      const message = '저장되지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?';
      e.returnValue = message;
      return message;
    }
  }

  // === 커스텀 이벤트 핸들러들 ===

  // 상태 변경 이벤트 핸들러
  handleStateChange(data) {
    console.log('State changed:', data);
    
    // 상태 변경 로깅
    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'state_change',
        changes: data,
        timestamp: Date.now()
      }
    });
  }

  // 모드 변경 이벤트 핸들러
  handleModeChangeEvent(data) {
    console.log('Mode changed:', data);
    
    // UI 업데이트
    pageManager.updateModeDisplay(data.mode);
  }

  // 페이지 변경 이벤트 핸들러
  handlePageChangeEvent(data) {
    console.log('Page changed:', data);
    
    // 페이지별 이벤트 추적 설정
    this.setupPageSpecificEvents(data.page);
  }

  // 섹션 변경 이벤트 핸들러
  handleSectionChangeEvent(data) {
    console.log('Section changed:', data);
    
    // 섹션별 가이드 업데이트
    if (appState.getState('currentMode') === MODES.HYBRID) {
      modeManager.updateHybridGuideContent(data.section);
    }
  }

  // 프로젝트 저장 이벤트 핸들러
  handleProjectSave(data) {
    console.log('Project saved:', data);
    
    this.emit('notification:show', {
      type: 'success',
      message: '프로젝트가 저장되었습니다.',
      duration: 3000
    });
  }

  // 프로젝트 로드 이벤트 핸들러
  handleProjectLoad(data) {
    console.log('Project loaded:', data);
    
    // 프로젝트 데이터 복원
    this.restoreProjectState(data);
  }

  // 애플리케이션 오류 핸들러
  handleApplicationError(data) {
    console.error('Application error:', data);
    
    // 오류 로깅
    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'application_error',
        error: data.error?.message || 'Unknown error',
        stack: data.error?.stack,
        context: data.context,
        timestamp: Date.now()
      }
    });
    
    // 사용자에게 오류 알림
    app.showErrorMessage('오류가 발생했습니다. 페이지를 새로고침해주세요.');
  }

  // === 유틸리티 메서드들 ===

  // 현재 섹션 유효성 검사
  validateCurrentSection() {
    const currentSection = appState.getState('currentSection');
    const formData = appState.getFormData(currentSection);
    
    // 섹션별 필수 필드 검사
    const requiredFields = this.getRequiredFields(currentSection);
    
    for (const field of requiredFields) {
      if (!formData || !formData[field] || formData[field] === '') {
        return false;
      }
    }
    
    return true;
  }

  // 섹션별 필수 필드 반환
  getRequiredFields(sectionId) {
    const requiredFieldsMap = {
      'business-context': ['projectGoal', 'industry', 'productName'],
      'data-integration': [],
      'persona-modeling': [],
      'market-intelligence': [],
      'strategy-simulation': [],
      'insights-dashboard': [],
      'performance-tracking': []
    };
    
    return requiredFieldsMap[sectionId] || [];
  }

  // 저장되지 않은 변경사항 확인
  checkUnsavedChanges() {
    // 마지막 저장 시간과 현재 시간 비교
    const lastSaveTime = StorageUtils.get('lastSaveTime', 0);
    const currentTime = Date.now();
    
    // 5분 이상 저장하지 않았으면 경고
    return (currentTime - lastSaveTime) > 5 * 60 * 1000;
  }

  // 워크플로우 소요 시간 계산
  calculateWorkflowDuration() {
    const startTime = StorageUtils.get('workflowStartTime');
    if (startTime) {
      return Date.now() - startTime;
    }
    return 0;
  }

  // 페이지별 이벤트 설정
  setupPageSpecificEvents(pageId) {
    // 기존 페이지별 이벤트 제거
    this.removePageSpecificEvents();
    
    switch (pageId) {
      case PAGES.PROJECTS:
        this.setupProjectsPageEvents();
        break;
      case PAGES.SETTINGS:
        this.setupSettingsPageEvents();
        break;
      case PAGES.DASHBOARD:
        this.setupDashboardPageEvents();
        break;
    }
  }

  // 프로젝트 페이지 이벤트 설정
  setupProjectsPageEvents() {
    this.projectsEvents = [
      this.on('.project-card', 'dblclick', this.handleProjectDoubleClick.bind(this)),
      this.on('.project-card', 'contextmenu', this.handleProjectContextMenu.bind(this))
    ];
  }

  // 설정 페이지 이벤트 설정
  setupSettingsPageEvents() {
    this.settingsEvents = [
      this.on('[data-setting]', 'change', this.handleSettingChange.bind(this))
    ];
  }

  // 대시보드 페이지 이벤트 설정
  setupDashboardPageEvents() {
    this.dashboardEvents = [
      this.on('.metric-card', 'click', this.handleMetricClick.bind(this)),
      this.on('.progress-bar', 'click', this.handleProgressClick.bind(this))
    ];
  }

  // 페이지별 이벤트 제거
  removePageSpecificEvents() {
    [this.projectsEvents, this.settingsEvents, this.dashboardEvents].forEach(events => {
      if (events) {
        events.forEach(eventId => this.off(eventId));
      }
    });
  }

  // 프로젝트 더블클릭 핸들러
  handleProjectDoubleClick(e) {
    const projectId = e.currentTarget.dataset.project;
    pageManager.editProject(projectId);
  }

  // 프로젝트 컨텍스트 메뉴 핸들러
  handleProjectContextMenu(e) {
    e.preventDefault();
    // 컨텍스트 메뉴 표시 로직
    this.showProjectContextMenu(e.currentTarget, e.clientX, e.clientY);
  }

  // 설정 변경 핸들러
  handleSettingChange(e) {
    const settingPath = e.target.dataset.setting;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    pageManager.updateSetting(settingPath, value);
  }

  // 메트릭 클릭 핸들러
  handleMetricClick(e) {
    const metricType = e.currentTarget.dataset.metric;
    this.showMetricDetails(metricType);
  }

  // 진행률 클릭 핸들러
  handleProgressClick(e) {
    const currentSection = appState.getState('currentSection');
    this.showProgressDetails(currentSection);
  }

  // === 큐된 이벤트 핸들러들 ===

  // 자동 저장 핸들러
  async handleAutoSave(data) {
    try {
      appState.updateFormData(data.section, { [data.field]: data.value });
      appState.autoSave();
      
      console.log(`Auto-saved: ${data.field} = ${data.value}`);
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  }

  // 분석 이벤트 핸들러
  async handleAnalyticsEvent(data) {
    try {
      // 실제 구현에서는 분석 서비스로 전송
      console.log('Analytics event:', data);
      
      // 로컬 스토리지에 임시 저장
      const analytics = StorageUtils.get('analytics', []);
      analytics.push(data);
      
      // 최대 1000개까지만 보관
      if (analytics.length > 1000) {
        analytics.splice(0, analytics.length - 1000);
      }
      
      StorageUtils.set('analytics', analytics);
    } catch (error) {
      console.error('Analytics event failed:', error);
    }
  }

  // 알림 이벤트 핸들러
  async handleNotificationEvent(data) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.title || '알림', {
          body: data.message,
          icon: data.icon || '/favicon.ico',
          tag: data.tag || 'app-notification'
        });
      }
    } catch (error) {
      console.error('Notification failed:', error);
    }
  }

  // === 오류 처리 메서드들 ===

  // 이벤트 오류 핸들러
  handleEventError(error, context) {
    this.eventStats.errorCount++;
    
    console.error('Event handler error:', error, context);
    
    this.emit('error:handler', {
      error,
      context,
      timestamp: Date.now()
    });
  }

  // 전역 오류 핸들러
  handleGlobalError(e) {
    console.error('Global error:', e.error);
    
    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'global_error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        timestamp: Date.now()
      }
    });
  }

  // 처리되지 않은 Promise 거부 핸들러
  handleUnhandledRejection(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    this.queueEvent({
      type: 'analytics',
      data: {
        action: 'unhandled_rejection',
        reason: e.reason?.toString() || 'Unknown reason',
        timestamp: Date.now()
      }
    });
  }

  // === 유틸리티 메서드들 ===

  // 이벤트 통계 업데이트
  updateEventStats(eventType) {
    this.eventStats.totalEvents++;
    this.eventStats.eventsByType[eventType] = (this.eventStats.eventsByType[eventType] || 0) + 1;
  }

  // 프로젝트 상태 복원
  restoreProjectState(projectData) {
    // 프로젝트 데이터를 기반으로 상태 복원
    if (projectData.formData) {
      appState.setState({ formData: projectData.formData });
    }
    
    if (projectData.currentSection) {
      appState.setSection(projectData.currentSection);
    }
  }

  // 프로젝트 컨텍스트 메뉴 표시
  showProjectContextMenu(projectElement, x, y) {
    // 컨텍스트 메뉴 구현
    console.log('Show context menu for project:', projectElement.dataset.project);
  }

  // 메트릭 상세 정보 표시
  showMetricDetails(metricType) {
    // 메트릭 상세 모달 표시
    console.log('Show metric details:', metricType);
  }

  // 진행률 상세 정보 표시
  showProgressDetails(section) {
    // 진행률 상세 정보 표시
    console.log('Show progress details:', section);
  }

  // 이벤트 통계 조회
  getEventStats() {
    return { ...this.eventStats };
  }

  // 이벤트 매니저 정리
  destroy() {
    // 모든 이벤트 리스너 제거
    this.eventListeners.forEach((listener, id) => {
      this.off(id);
    });
    
    // 커스텀 이벤트 제거
    this.customEvents.clear();
    
    // 이벤트 큐 정리
    this.eventQueue.length = 0;
    
    console.log('EventManager destroyed');
  }

  // 디버그 정보
  getDebugInfo() {
    return {
      eventListeners: this.eventListeners.size,
      customEvents: this.customEvents.size,
      queueLength: this.eventQueue.length,
      stats: this.eventStats,
      isProcessingQueue: this.isProcessingQueue
    };
  }
}

// 전역 이벤트 매니저 인스턴스
const eventManager = new EventManager();