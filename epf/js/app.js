// 메인 애플리케이션 클래스
class PersonaPlatformApp {
  constructor() {
    this.isInitialized = false;
    this.modules = {};
    this.eventListeners = [];
  }

  // 애플리케이션 초기화
  async init() {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Enterprise Persona Platform 초기화 시작...');
      
      // 브라우저 호환성 확인
      this.checkCompatibility();
      
      // 초기 상태 설정
      this.setupInitialState();
      
      // 이벤트 리스너 설정
      this.setupEventListeners();
      
      // UI 초기화
      this.initializeUI();
      
      // 키보드 단축키 설정
      this.setupKeyboardShortcuts();
      
      // 자동 저장 설정
      this.setupAutoSave();
      
      this.isInitialized = true;
      console.log('✅ 애플리케이션 초기화 완료');
      
      // 초기화 완료 이벤트 발생
      this.emit('app:initialized');
      
    } catch (error) {
      console.error('❌ 애플리케이션 초기화 실패:', error);
      this.showErrorMessage('애플리케이션을 시작할 수 없습니다.');
    }
  }

  // 브라우저 호환성 확인
  checkCompatibility() {
    const required = [
      'localStorage',
      'fetch',
      'querySelector',
      'addEventListener'
    ];
    
    const unsupported = required.filter(feature => {
      switch (feature) {
        case 'localStorage':
          return !BrowserUtils.supports.localStorage;
        case 'fetch':
          return !BrowserUtils.supports.fetch;
        case 'querySelector':
          return !document.querySelector;
        case 'addEventListener':
          return !document.addEventListener;
        default:
          return false;
      }
    });

    if (unsupported.length > 0) {
      throw new Error(`지원되지 않는 브라우저입니다. 필요한 기능: ${unsupported.join(', ')}`);
    }

    // 성능 저하 모드 감지
    if (BrowserUtils.prefersReducedMotion()) {
      document.body.classList.add('reduced-motion');
    }
  }

  // 초기 상태 설정 - 🚨 안전한 버전
  setupInitialState() {
    console.log('🔧 초기 상태 설정 시작...');
    
    try {
      // 사이드바 콘텐츠 생성
      const sidebarContent = DOM ? DOM.$('#sidebar-content') : document.getElementById('sidebar-content');
      if (sidebarContent && window.sectionManager) {
        console.log('📋 사이드바 콘텐츠 생성 중...');
        sidebarContent.innerHTML = sectionManager.createSidebarContent();
        console.log('✅ 사이드바 콘텐츠 생성 완료');
      } else {
        console.warn('⚠️ 사이드바 콘텐츠 생성 실패 - 요소 또는 sectionManager 없음');
      }
    } catch (sidebarError) {
      console.error('🚨 사이드바 생성 오류:', sidebarError);
    }

    try {
      // 워크플로우 가이드 콘텐츠 생성
      const guideContent = DOM ? DOM.$('#guide-content') : document.getElementById('guide-content');
      if (guideContent && window.sectionManager) {
        guideContent.innerHTML = sectionManager.createWorkflowGuideContent();
        console.log('✅ 가이드 콘텐츠 생성 완료');
      }
    } catch (guideError) {
      console.error('가이드 콘텐츠 생성 오류:', guideError);
    }

    try {
      // 초기 섹션 설정 - 안전한 호출
      const currentSection = (window.appState && appState.getState) ? 
        appState.getState('currentSection') : 'business-context';
      
      console.log('🎯 초기 섹션 설정:', currentSection);
      
      if (window.sectionManager && sectionManager.updateSection) {
        sectionManager.updateSection(currentSection);
      } else {
        console.warn('⚠️ sectionManager.updateSection 없음');
      }
    } catch (sectionError) {
      console.error('🚨 초기 섹션 설정 오류:', sectionError);
    }
    
    try {
      // 초기 모드 설정
      const currentMode = (window.appState && appState.getState) ? 
        appState.getState('currentMode') : 'tool';
      this.updateModeDisplay(currentMode);
    } catch (modeError) {
      console.error('모드 설정 오류:', modeError);
    }
    
    try {
      // 초기 페이지 설정
      const currentPage = (window.appState && appState.getState) ? 
        appState.getState('currentPage') : 'dashboard';
      this.updatePageDisplay(currentPage);
    } catch (pageError) {
      console.error('페이지 설정 오류:', pageError);
    }
    
    console.log('✅ 초기 상태 설정 완료');
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 상태 변화 구독
    appState.subscribe('currentModeChange', (data) => {
      this.updateModeDisplay(data.current);
    });

    appState.subscribe('currentPageChange', (data) => {
      this.updatePageDisplay(data.current);
    });

    appState.subscribe('currentSectionChange', (data) => {
      sectionManager.updateSection(data.current);
      this.updateGuideContent(data.current);
    });

    // DOM 이벤트 위임 (수정됨)
    this.setupDOMEventDelegation();
    
    // 페이지 이탈 시 저장
    window.addEventListener('beforeunload', () => {
      appState.autoSave();
    });

    // 온라인/오프라인 상태 감지
    window.addEventListener('online', () => {
      this.updateConnectionStatus(true);
    });

    window.addEventListener('offline', () => {
      this.updateConnectionStatus(false);
    });
  }

  // 🔧 DOM 이벤트 위임 설정 (수정됨)
  setupDOMEventDelegation() {
    // 메인 이벤트 위임 핸들러
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-mode], [data-page], [data-section], .next-section-btn, .guide-help-btn, .complete-workflow-btn, .export-report-btn, .setup-alerts-btn, .project-card');
      
      if (!target) return;

      // 모드 변경 버튼
      if (target.dataset.mode) {
        const mode = target.dataset.mode;
        appState.setMode(mode);
        return;
      }

      // 페이지 네비게이션 버튼
      if (target.dataset.page) {
        const page = target.dataset.page;
        appState.setPage(page);
        return;
      }

      // 🎯 사이드바 섹션 버튼 (핵심 수정)
      if (target.dataset.section) {
        const section = target.dataset.section;
        console.log('🔄 섹션 변경:', section); // 디버깅용
        appState.setSection(section);
        return;
      }

      // 다음 단계 버튼
      if (target.classList.contains('next-section-btn')) {
        this.saveCurrentFormData();
        sectionManager.nextSection();
        return;
      }

      // 가이드 보기 버튼
      if (target.classList.contains('guide-help-btn')) {
        const currentMode = appState.getState('currentMode');
        if (currentMode === MODES.TOOL) {
          appState.setMode(MODES.HYBRID);
        } else {
          appState.setMode(MODES.GUIDE);
        }
        return;
      }

      // 워크플로우 완료 버튼
      if (target.classList.contains('complete-workflow-btn')) {
        this.completeWorkflow();
        return;
      }

      // 보고서 내보내기 버튼
      if (target.classList.contains('export-report-btn')) {
        this.exportReport();
        return;
      }

      // 알림 설정 버튼
      if (target.classList.contains('setup-alerts-btn')) {
        this.setupAlerts();
        return;
      }

      // 프로젝트 카드 클릭
      if (target.classList.contains('project-card') || target.closest('.project-card')) {
        const projectCard = target.closest('.project-card');
        const projectId = projectCard.dataset.project;
        if (projectId) {
          this.openProject(projectId);
        }
        return;
      }
    });

    // 폼 입력 자동 저장
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea')) {
        // 디바운스 적용
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          this.saveCurrentFormData();
        }, 1000);
      }
    });
  }

  // UI 초기화
  initializeUI() {
    // 툴팁 초기화
    this.initializeTooltips();
    
    // 모달 초기화
    this.initializeModals();
    
    // 드롭다운 초기화
    this.initializeDropdowns();
    
    // 애니메이션 초기화
    this.initializeAnimations();
  }

  // 키보드 단축키 설정
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd 키 조합
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            appState.setPage(PAGES.DASHBOARD);
            break;
          case '2':
            e.preventDefault();
            appState.setPage(PAGES.PROJECTS);
            break;
          case '3':
            e.preventDefault();
            appState.setPage(PAGES.SETTINGS);
            break;
          case 's':
            e.preventDefault();
            appState.autoSave();
            this.showSuccessMessage('저장되었습니다.');
            break;
        }
      }

      // F1 키 - 도움말
      if (e.key === 'F1') {
        e.preventDefault();
        appState.setMode(MODES.GUIDE);
      }

      // ESC 키 - 모달 닫기
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  // 자동 저장 설정
  setupAutoSave() {
    const settings = appState.getState('settings');
    if (settings.preferences.autoSave) {
      setInterval(() => {
        appState.autoSave();
      }, settings.preferences.autoSaveInterval * 1000);
    }
  }

  // 모드 표시 업데이트
  updateModeDisplay(mode) {
    // 모드 버튼 활성화 상태 업데이트
    DOM.$$('.mode-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeButton = DOM.$(`[data-mode="${mode}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // 모드별 컨테이너 표시/숨김
    DOM.$$('.workflow-guide-mode, .tool-mode, .hybrid-mode').forEach(container => {
      container.classList.remove('active');
    });

    const modeMap = {
      [MODES.GUIDE]: 'workflow-guide-mode',
      [MODES.TOOL]: 'tool-mode',
      [MODES.HYBRID]: 'hybrid-mode'
    };

    const activeContainer = DOM.$(`#${modeMap[mode]}`);
    if (activeContainer) {
      activeContainer.classList.add('active');
    }

    // 하이브리드 모드인 경우 가이드 콘텐츠 업데이트
    if (mode === MODES.HYBRID) {
      this.updateGuideContent(appState.getState('currentSection'));
    }
  }

  // 페이지 표시 업데이트
  updatePageDisplay(page) {
    // 페이지 버튼 활성화 상태 업데이트
    DOM.$$('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeButton = DOM.$(`[data-page="${page}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // 페이지 콘텐츠 표시/숨김
    DOM.$$('.page-content').forEach(content => {
      content.classList.remove('active');
    });

    const activePage = DOM.$(`#${page}-page`);
    if (activePage) {
      activePage.classList.add('active');
    }

    // 헤더 모드 선택기는 대시보드에서만 표시
    const headerModeSelector = DOM.$('#header-mode-selector');
    if (headerModeSelector) {
      headerModeSelector.style.display = page === PAGES.DASHBOARD ? 'flex' : 'none';
    }

    // 페이지별 초기화
    this.initializePage(page);
  }

  // 페이지별 초기화
  initializePage(page) {
    switch (page) {
      case PAGES.PROJECTS:
        this.initializeProjectsPage();
        break;
      case PAGES.SETTINGS:
        this.initializeSettingsPage();
        break;
      case PAGES.DASHBOARD:
        // 대시보드는 이미 초기화됨
        break;
    }
  }

  // 프로젝트 페이지 초기화
  initializeProjectsPage() {
    const projectsContent = DOM.$('#projects-content');
    if (projectsContent) {
      projectsContent.innerHTML = this.createProjectsPageContent();
    }
  }

  // 설정 페이지 초기화
  initializeSettingsPage() {
    const settingsContent = DOM.$('#settings-content');
    if (settingsContent) {
      settingsContent.innerHTML = this.createSettingsPageContent();
    }
  }

  // 가이드 콘텐츠 업데이트 (하이브리드 모드용)
  updateGuideContent(sectionId) {
    const guideContent = DOM.$('#hybrid-guide-content');
    if (!guideContent) return;

    const guide = GUIDE_CONTENT[sectionId];
    if (guide) {
      guideContent.innerHTML = `
        <h3>현재 단계: ${guide.title}</h3>
        <p>${guide.description}</p>
        
        <h4>✅ 체크리스트</h4>
        <ul>
          ${guide.checklist.map(item => `<li>□ ${item}</li>`).join('')}
        </ul>
        
        ${guide.tips ? `
          <h4>💡 실행 팁</h4>
          <ul>
            ${guide.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        ` : ''}
      `;
    }
  }

  // 현재 폼 데이터 저장
  saveCurrentFormData() {
    const currentSection = appState.getState('currentSection');
    const formData = {};

    // 현재 섹션의 모든 폼 요소 수집
    DOM.$$('[data-field]').forEach(element => {
      const field = element.dataset.field;
      if (element.type === 'checkbox') {
        formData[field] = element.checked;
      } else {
        formData[field] = element.value;
      }
    });

    // 상태에 저장
    appState.updateFormData(currentSection, formData);
  }

  // 워크플로우 완료
  completeWorkflow() {
    // 최종 데이터 저장
    this.saveCurrentFormData();
    
    // 프로젝트 진행률 업데이트
    const currentProject = appState.getCurrentProject();
    if (currentProject) {
      appState.updateProject(currentProject.id, {
        status: STATUS.COMPLETED,
        progress: 100
      });
    }

    const message = `
      🎉 워크플로우가 완료되었습니다!
      
      성과 추적을 통해 지속적으로 최적화하세요.
      프로젝트 관리에서 결과를 확인할 수 있습니다.
    `;
    
    this.showSuccessMessage(message);
    
    // 성과 추적 섹션으로 이동
    appState.setSection('performance-tracking');
  }

  // 보고서 내보내기
  exportReport() {
    // 실제 구현에서는 PDF 생성 라이브러리 사용
    const reportData = {
      project: appState.getCurrentProject(),
      sections: SECTIONS.map(sectionId => ({
        id: sectionId,
        title: SECTION_META[sectionId].title,
        data: appState.getFormData(sectionId)
      })),
      generatedAt: new Date().toISOString()
    };

    // 임시로 JSON 다운로드
    this.downloadJSON(reportData, '페르소나_전략_보고서.json');
    
    this.showSuccessMessage('보고서가 생성되었습니다.');
  }

  // 알림 설정
  setupAlerts() {
    const settings = appState.getState('settings');
    
    // 알림 권한 요청
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showSuccessMessage('알림이 설정되었습니다.');
          
          // 설정 업데이트
          appState.updateSettings({
            notifications: {
              ...settings.notifications,
              enabled: true
            }
          });
        }
      });
    }
  }

  // 프로젝트 열기
  openProject(projectId) {
    const project = appState.getState('projects').find(p => p.id === projectId);
    if (project) {
      const confirmed = confirm(`"${project.name}" 프로젝트를 열겠습니까?\n\n현재 작업이 저장됩니다.`);
      
      if (confirmed) {
        appState.setCurrentProject(projectId);
        appState.setPage(PAGES.DASHBOARD);
        
        // 프로젝트의 현재 섹션으로 이동
        if (project.currentSection) {
          appState.setSection(project.currentSection);
        }
        
        this.showSuccessMessage(`${project.name} 프로젝트를 불러왔습니다.`);
      }
    }
  }

  // 새 프로젝트 생성
  createNewProject() {
    const projectName = prompt('새 프로젝트명을 입력하세요:');
    if (projectName && projectName.trim()) {
      const newProject = appState.addProject({
        name: projectName.trim(),
        description: '새로운 페르소나 전략 프로젝트'
      });
      
      this.showSuccessMessage(`"${projectName}" 프로젝트가 생성되었습니다.`);
      appState.setPage(PAGES.DASHBOARD);
    }
  }

  // 프로젝트 페이지 콘텐츠 생성
  createProjectsPageContent() {
    const projects = appState.getState('projects');
    
    const projectCards = projects.map(project => `
      <div class="project-card" data-project="${project.id}">
        <div class="status status-${project.status}">${this.getStatusText(project.status)}</div>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="project-footer">
          <span class="project-date">${DateUtils.format(project.createdAt)} 생성</span>
          <div class="progress-badge">
            ${project.progress}% 완료
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">프로젝트 관리</h2>
            <p class="card-subtitle">진행 중인 프로젝트와 완료된 프로젝트를 관리하세요</p>
          </div>
          <button class="btn btn-primary" onclick="app.createNewProject()">
            ➕ 새 프로젝트 만들기
          </button>
        </div>
        
        <div class="projects-grid">
          ${projectCards}
        </div>
      </div>
    `;
  }

  // 설정 페이지 콘텐츠 생성
  createSettingsPageContent() {
    const settings = appState.getState('settings');
    const user = appState.getState('user');

    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">계정 설정</h2>
        </div>
        
        <div class="settings-grid">
          <div class="form-group">
            <label class="form-label">이름</label>
            <input type="text" class="form-input" value="${user.name}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" value="${user.email}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">부서</label>
            <input type="text" class="form-input" value="${user.department}">
          </div>
          <div class="form-group">
            <label class="form-label">권한</label>
            <select class="form-select">
              <option>관리자</option>
              <option>일반 사용자</option>
              <option>뷰어</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>🔔 알림 설정</h3>
        </div>
        
        <div class="settings-list">
          <label class="setting-item">
            <span>이메일 알림</span>
            <div class="toggle">
              <input type="checkbox" class="toggle-input" ${settings.notifications.email ? 'checked' : ''} 
                     onchange="app.updateNotificationSetting('email', this.checked)">
              <span class="toggle-slider"></span>
            </div>
          </label>
          
          <label class="setting-item">
            <span>프로젝트 마감 알림</span>
            <div class="toggle">
              <input type="checkbox" class="toggle-input" ${settings.notifications.deadline ? 'checked' : ''}
                     onchange="app.updateNotificationSetting('deadline', this.checked)">
              <span class="toggle-slider"></span>
            </div>
          </label>
          
          <label class="setting-item">
            <span>주간 진행률 리포트</span>
            <div class="toggle">
              <input type="checkbox" class="toggle-input" ${settings.notifications.weeklyReport ? 'checked' : ''}
                     onchange="app.updateNotificationSetting('weeklyReport', this.checked)">
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>⚙️ 고급 설정</h3>
        </div>
        
        <div class="settings-grid">
          <div class="form-group">
            <label class="form-label">기본 언어</label>
            <select class="form-select">
              <option>한국어</option>
              <option>English</option>
              <option>日本語</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">타임존</label>
            <select class="form-select">
              <option>Asia/Seoul (KST)</option>
              <option>America/New_York (EST)</option>
              <option>Europe/London (GMT)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">자동 저장 주기</label>
            <select class="form-select" onchange="app.updateAutoSaveInterval(this.value)">
              <option value="30" ${settings.preferences.autoSaveInterval === 30 ? 'selected' : ''}>30초</option>
              <option value="60" ${settings.preferences.autoSaveInterval === 60 ? 'selected' : ''}>1분</option>
              <option value="300" ${settings.preferences.autoSaveInterval === 300 ? 'selected' : ''}>5분</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="settings-actions">
        <button class="btn btn-secondary" onclick="app.resetSettings()">초기화</button>
        <button class="btn btn-primary" onclick="app.saveSettings()">변경사항 저장</button>
      </div>
    `;
  }

  // 상태 텍스트 변환
  getStatusText(status) {
    const statusMap = {
      [STATUS.ACTIVE]: '진행 중',
      [STATUS.PLANNING]: '계획 중',
      [STATUS.COMPLETED]: '완료됨',
      [STATUS.PAUSED]: '일시정지'
    };
    return statusMap[status] || status;
  }

  // 알림 설정 업데이트
  updateNotificationSetting(type, enabled) {
    const settings = appState.getState('settings');
    appState.updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: enabled
      }
    });
  }

  // 자동 저장 간격 업데이트
  updateAutoSaveInterval(interval) {
    const settings = appState.getState('settings');
    appState.updateSettings({
      preferences: {
        ...settings.preferences,
        autoSaveInterval: parseInt(interval)
      }
    });
  }

  // 설정 저장
  saveSettings() {
    appState.saveToStorage();
    this.showSuccessMessage('설정이 저장되었습니다.');
  }

  // 설정 초기화
  resetSettings() {
    const confirmed = confirm('모든 설정을 초기값으로 되돌리시겠습니까?');
    if (confirmed) {
      appState.resetSettings();
      this.showSuccessMessage('설정이 초기화되었습니다.');
      setTimeout(() => location.reload(), 1000);
    }
  }

  // 연결 상태 업데이트
  updateConnectionStatus(isOnline) {
    const statusElement = DOM.$('.connection-status');
    if (statusElement) {
      statusElement.innerHTML = isOnline 
        ? '🔗 시스템 연결됨' 
        : '🔌 오프라인 모드';
      
      statusElement.className = isOnline 
        ? 'connection-status status-success'
        : 'connection-status status-warning';
    }
  }

  // 툴팁 초기화
  initializeTooltips() {
    // 툴팁 구현
  }

  // 모달 초기화
  initializeModals() {
    // 모달 구현
  }

  // 드롭다운 초기화
  initializeDropdowns() {
    // 드롭다운 구현
  }

  // 애니메이션 초기화
  initializeAnimations() {
    // 스크롤 애니메이션 등
  }

  // 모든 모달 닫기
  closeAllModals() {
    DOM.$$('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  // JSON 다운로드
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 성공 메시지 표시
  showSuccessMessage(message) {
    this.showToast(message, 'success');
  }

  // 오류 메시지 표시
  showErrorMessage(message) {
    this.showToast(message, 'error');
  }

  // 토스트 메시지 표시
  showToast(message, type = 'info') {
    const toast = DOM.create('div', {
      className: `toast toast-${type}`,
      innerHTML: `
        <div class="toast-content">
          <span class="toast-icon">${this.getToastIcon(type)}</span>
          <span class="toast-message">${message}</span>
        </div>
      `
    });

    document.body.appendChild(toast);

    // 애니메이션
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 자동 제거
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // 토스트 아이콘
  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  // 이벤트 발생
  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }

  // 애플리케이션 종료
  destroy() {
    // 이벤트 리스너 제거
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // 상태 저장
    appState.autoSave();

    console.log('📱 애플리케이션이 종료되었습니다.');
  }
}

// 전역 애플리케이션 인스턴스
const app = new PersonaPlatformApp();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(error => {
    console.error('앱 초기화 실패:', error);
  });
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  app.destroy();
});