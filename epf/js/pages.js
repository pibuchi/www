// 페이지 관리 클래스
class PageManager {
  constructor() {
    this.currentPage = PAGES.DASHBOARD;
    this.pageHistory = [PAGES.DASHBOARD];
    this.maxHistoryLength = 10;
  }

  // 페이지 전환
  switchPage(pageId) {
    if (!Object.values(PAGES).includes(pageId)) {
      console.error(`Invalid page ID: ${pageId}`);
      return false;
    }

    const previousPage = this.currentPage;
    this.currentPage = pageId;

    // 히스토리 업데이트
    this.updateHistory(pageId);

    // 페이지 전환 애니메이션
    this.animatePageTransition(previousPage, pageId);

    // 페이지별 초기화
    this.initializePage(pageId);

    // 상태 업데이트
    appState.setState({ currentPage: pageId });

    console.log(`Page switched: ${previousPage} → ${pageId}`);
    return true;
  }

  // 페이지 히스토리 업데이트
  updateHistory(pageId) {
    // 중복 제거 (연속된 같은 페이지)
    if (this.pageHistory[this.pageHistory.length - 1] !== pageId) {
      this.pageHistory.push(pageId);
      
      // 히스토리 길이 제한
      if (this.pageHistory.length > this.maxHistoryLength) {
        this.pageHistory.shift();
      }
    }
  }

  // 이전 페이지로 이동
  goBack() {
    if (this.pageHistory.length > 1) {
      // 현재 페이지 제거
      this.pageHistory.pop();
      
      // 이전 페이지로 이동
      const previousPage = this.pageHistory[this.pageHistory.length - 1];
      this.switchPage(previousPage);
      
      return true;
    }
    return false;
  }

  // 페이지 전환 애니메이션
  async animatePageTransition(fromPage, toPage) {
    const fromElement = DOM.$(`#${fromPage}-page`);
    const toElement = DOM.$(`#${toPage}-page`);

    if (!fromElement || !toElement) return;

    // 현재 페이지 페이드 아웃
    if (fromElement.classList.contains('active')) {
      await DOM.fadeOut(fromElement, 200);
      fromElement.classList.remove('active');
    }

    // 새 페이지 페이드 인
    toElement.classList.add('active');
    await DOM.fadeIn(toElement, 300);
  }

  // 페이지별 초기화
  initializePage(pageId) {
    switch (pageId) {
      case PAGES.DASHBOARD:
        this.initializeDashboard();
        break;
      case PAGES.PROJECTS:
        this.initializeProjects();
        break;
      case PAGES.SETTINGS:
        this.initializeSettings();
        break;
    }
  }

  // 대시보드 초기화
  initializeDashboard() {
    // 헤더 모드 선택기 표시
    const headerModeSelector = DOM.$('#header-mode-selector');
    if (headerModeSelector) {
      headerModeSelector.style.display = 'flex';
    }

    // 현재 모드에 따른 콘텐츠 표시
    const currentMode = appState.getState('currentMode');
    this.updateModeDisplay(currentMode);

    // 진행률 업데이트
    this.updateProgress();
  }

  // 프로젝트 페이지 초기화
  initializeProjects() {
    // 헤더 모드 선택기 숨김
    const headerModeSelector = DOM.$('#header-mode-selector');
    if (headerModeSelector) {
      headerModeSelector.style.display = 'none';
    }

    // 프로젝트 목록 렌더링
    this.renderProjectsList();

    // 프로젝트 통계 업데이트
    this.updateProjectsStats();
  }

  // 설정 페이지 초기화
  initializeSettings() {
    // 헤더 모드 선택기 숨김
    const headerModeSelector = DOM.$('#header-mode-selector');
    if (headerModeSelector) {
      headerModeSelector.style.display = 'none';
    }

    // 설정 폼 렌더링
    this.renderSettingsForm();

    // 사용자 정보 로드
    this.loadUserInfo();
  }

  // 모드 표시 업데이트
  updateModeDisplay(mode) {
    // 모든 모드 컨테이너 숨김
    DOM.$$('.workflow-guide-mode, .tool-mode, .hybrid-mode').forEach(container => {
      container.classList.remove('active');
    });

    // 선택된 모드 표시
    const modeContainerMap = {
      [MODES.GUIDE]: 'workflow-guide-mode',
      [MODES.TOOL]: 'tool-mode',
      [MODES.HYBRID]: 'hybrid-mode'
    };

    const activeContainer = DOM.$(`#${modeContainerMap[mode]}`);
    if (activeContainer) {
      activeContainer.classList.add('active');
    }

    // 모드 버튼 활성화 상태 업데이트
    DOM.$$('.mode-nav-item').forEach(item => {
      item.classList.remove('active');
    });

    const activeButton = DOM.$(`[data-mode="${mode}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  // 진행률 업데이트
  updateProgress() {
    const currentProject = appState.getCurrentProject();
    const formData = appState.getFormData();
    
    // 완료된 섹션 수 계산
    const completedSections = Object.keys(formData).filter(sectionId => {
      const sectionData = formData[sectionId];
      return sectionData && Object.keys(sectionData).length > 0;
    }).length;

    const totalSections = SECTIONS.length;
    const progressPercentage = Math.round((completedSections / totalSections) * 100);

    // 진행률 바 업데이트
    const progressFill = DOM.$('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }

    const progressText = DOM.$('.progress-percentage');
    if (progressText) {
      progressText.textContent = `${progressPercentage}%`;
    }

    // 현재 프로젝트 진행률 업데이트
    if (currentProject) {
      appState.updateProject(currentProject.id, {
        progress: progressPercentage
      });
    }
  }

  // 프로젝트 목록 렌더링
  renderProjectsList() {
    const projectsContent = DOM.$('#projects-content');
    if (!projectsContent) return;

    const projects = appState.getState('projects');
    
    const projectCards = projects.map(project => this.createProjectCard(project)).join('');

    projectsContent.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">프로젝트 관리</h2>
            <p class="card-subtitle">진행 중인 프로젝트와 완료된 프로젝트를 관리하세요</p>
          </div>
          <button class="btn btn-primary" onclick="pageManager.createNewProject()">
            ➕ 새 프로젝트 만들기
          </button>
        </div>
        
        <div class="projects-grid">
          ${projectCards || '<div class="empty-state"><div class="empty-state-icon">📁</div><div class="empty-state-title">프로젝트가 없습니다</div><div class="empty-state-description">새 프로젝트를 만들어 시작하세요.</div></div>'}
        </div>
      </div>
    `;

    // 프로젝트 카드 이벤트 리스너
    this.attachProjectCardListeners();
  }

  // 프로젝트 카드 생성
  createProjectCard(project) {
    const statusText = this.getStatusText(project.status);
    const statusClass = this.getStatusClass(project.status);
    const createdDate = DateUtils.format(new Date(project.createdAt));
    const updatedDate = DateUtils.format(new Date(project.updatedAt));

    return `
      <div class="project-card" data-project="${project.id}" data-status="${project.status}">
        <div class="status ${statusClass}">${statusText}</div>
        <h3>${StringUtils.escapeHtml(project.name)}</h3>
        <p>${StringUtils.escapeHtml(project.description)}</p>
        <div class="project-footer">
          <div class="project-dates">
            <div class="project-date">생성: ${createdDate}</div>
            <div class="project-date">수정: ${updatedDate}</div>
          </div>
          <div class="progress-badge">
            ${project.progress}% 완료
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-sm btn-secondary" onclick="pageManager.editProject('${project.id}')">
            ✏️ 편집
          </button>
          <button class="btn btn-sm btn-outline" onclick="pageManager.duplicateProject('${project.id}')">
            📋 복제
          </button>
          <button class="btn btn-sm btn-ghost" onclick="pageManager.deleteProject('${project.id}')">
            🗑️ 삭제
          </button>
        </div>
      </div>
    `;
  }

  // 프로젝트 카드 이벤트 리스너 연결
  attachProjectCardListeners() {
    DOM.$$('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // 버튼 클릭 시에는 프로젝트 열기 방지
        if (e.target.closest('button')) return;
        
        const projectId = card.dataset.project;
        this.openProject(projectId);
      });
    });
  }

  // 설정 폼 렌더링
  renderSettingsForm() {
    const settingsContent = DOM.$('#settings-content');
    if (!settingsContent) return;

    const settings = appState.getState('settings');
    const user = appState.getState('user');

    settingsContent.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">계정 설정</h2>
        </div>
        
        <div class="settings-grid">
          <div class="form-group">
            <label class="form-label">이름</label>
            <input type="text" class="form-input" value="${user.name}" data-setting="user.name">
          </div>
          <div class="form-group">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" value="${user.email}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">부서</label>
            <input type="text" class="form-input" value="${user.department}" data-setting="user.department">
          </div>
          <div class="form-group">
            <label class="form-label">권한</label>
            <select class="form-select" data-setting="user.role">
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>관리자</option>
              <option value="user" ${user.role === 'user' ? 'selected' : ''}>일반 사용자</option>
              <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>뷰어</option>
            </select>
          </div>
        </div>
      </div>
      
      ${this.createDataConnectionSettings()}
      ${this.createNotificationSettings(settings)}
      ${this.createAdvancedSettings(settings)}
      
      <div class="settings-actions">
        <button class="btn btn-secondary" onclick="pageManager.resetSettings()">초기화</button>
        <button class="btn btn-primary" onclick="pageManager.saveSettings()">변경사항 저장</button>
      </div>
    `;

    // 설정 변경 이벤트 리스너
    this.attachSettingsListeners();
  }

  // 데이터 연동 설정
  createDataConnectionSettings() {
    const connections = [
      { id: 'crm', name: 'CRM 시스템', desc: 'Salesforce 연동', status: 'connected' },
      { id: 'analytics', name: 'Google Analytics', desc: '웹 분석 데이터', status: 'connected' },
      { id: 'social', name: 'Social Media API', desc: '소셜 트렌드 데이터', status: 'disconnected' }
    ];

    const connectionItems = connections.map(conn => `
      <div class="data-connection-item">
        <div class="connection-info">
          <h4>${conn.name}</h4>
          <p>${conn.desc}</p>
        </div>
        <div class="connection-status-badge ${conn.status}">
          ${conn.status === 'connected' ? '연결됨' : '연결하기'}
        </div>
      </div>
    `).join('');

    return `
      <div class="card">
        <div class="card-header">
          <h3>🔗 데이터 연동 설정</h3>
        </div>
        ${connectionItems}
      </div>
    `;
  }

  // 알림 설정
  createNotificationSettings(settings) {
    return `
      <div class="card">
        <div class="card-header">
          <h3>🔔 알림 설정</h3>
        </div>
        
        <div class="settings-list">
          <label class="setting-item">
            <span>이메일 알림</span>
            <div class="toggle">
              <input type="checkbox" class="toggle-input" ${settings.notifications.email ? 'checked' : ''} 
                     data-setting="notifications.email">
              <span class="toggle-slider"></span>
            </div>
          </label>
          
          <label class="setting-item">
            <span>프로젝트 마감 알림</span>
            <div class="toggle">
              <input type="checkbox" class="toggle-input" ${settings.notifications.deadline ? 'checked' : ''}
                     data-setting="notifications.deadline">
              <span class="toggle-slider"></span>
            </div>
          </label>
          
          <label class="setting-item">
            <span>주간 진행률 리포트</span>
            <div class="toggle">
              <input type="checkbox" class="toggle-input" ${settings.notifications.weeklyReport ? 'checked' : ''}
                     data-setting="notifications.weeklyReport">
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
    `;
  }

  // 고급 설정
  createAdvancedSettings(settings) {
    return `
      <div class="card">
        <div class="card-header">
          <h3>⚙️ 고급 설정</h3>
        </div>
        
        <div class="settings-grid">
          <div class="form-group">
            <label class="form-label">기본 언어</label>
            <select class="form-select" data-setting="preferences.language">
              <option value="ko" ${settings.preferences.language === 'ko' ? 'selected' : ''}>한국어</option>
              <option value="en" ${settings.preferences.language === 'en' ? 'selected' : ''}>English</option>
              <option value="ja" ${settings.preferences.language === 'ja' ? 'selected' : ''}>日本語</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">타임존</label>
            <select class="form-select" data-setting="preferences.timezone">
              <option value="Asia/Seoul" ${settings.preferences.timezone === 'Asia/Seoul' ? 'selected' : ''}>Asia/Seoul (KST)</option>
              <option value="America/New_York" ${settings.preferences.timezone === 'America/New_York' ? 'selected' : ''}>America/New_York (EST)</option>
              <option value="Europe/London" ${settings.preferences.timezone === 'Europe/London' ? 'selected' : ''}>Europe/London (GMT)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">자동 저장 주기</label>
            <select class="form-select" data-setting="preferences.autoSaveInterval">
              <option value="30" ${settings.preferences.autoSaveInterval === 30 ? 'selected' : ''}>30초</option>
              <option value="60" ${settings.preferences.autoSaveInterval === 60 ? 'selected' : ''}>1분</option>
              <option value="300" ${settings.preferences.autoSaveInterval === 300 ? 'selected' : ''}>5분</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">테마</label>
            <select class="form-select" data-setting="display.theme">
              <option value="dark" ${settings.display.theme === 'dark' ? 'selected' : ''}>다크</option>
              <option value="light" ${settings.display.theme === 'light' ? 'selected' : ''}>라이트</option>
              <option value="auto" ${settings.display.theme === 'auto' ? 'selected' : ''}>시스템 설정</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  // 설정 변경 이벤트 리스너
  attachSettingsListeners() {
    DOM.$('[data-setting]').forEach(element => {
      const eventType = element.type === 'checkbox' ? 'change' : 'input';
      
      element.addEventListener(eventType, (e) => {
        const settingPath = e.target.dataset.setting;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        
        this.updateSetting(settingPath, value);
      });
    });
  }

  // 설정 업데이트
  updateSetting(path, value) {
    const pathParts = path.split('.');
    const currentState = appState.getState();
    
    // 중첩된 객체 업데이트
    let target = currentState;
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!target[pathParts[i]]) {
        target[pathParts[i]] = {};
      }
      target = target[pathParts[i]];
    }
    
    const lastKey = pathParts[pathParts.length - 1];
    target[lastKey] = value;
    
    // 상태 업데이트
    appState.setState(currentState);
    
    console.log(`Setting updated: ${path} = ${value}`);
  }

  // 사용자 정보 로드
  loadUserInfo() {
    // 실제 구현에서는 서버에서 로드
    const userInfo = StorageUtils.get('userInfo');
    if (userInfo) {
      appState.setState({ user: { ...appState.getState('user'), ...userInfo } });
    }
  }

  // 프로젝트 통계 업데이트
  updateProjectsStats() {
    const projects = appState.getState('projects');
    
    const stats = {
      total: projects.length,
      active: projects.filter(p => p.status === STATUS.ACTIVE).length,
      completed: projects.filter(p => p.status === STATUS.COMPLETED).length,
      planning: projects.filter(p => p.status === STATUS.PLANNING).length
    };

    // 통계 표시 (필요시 구현)
    console.log('Project stats:', stats);
  }

  // 새 프로젝트 생성
  createNewProject() {
    const projectName = prompt('새 프로젝트명을 입력하세요:');
    if (projectName && projectName.trim()) {
      // 유효성 검사
      const validation = ValidationUtils.validateForm(
        { projectName: projectName.trim() },
        { projectName: VALIDATION_RULES.projectName }
      );

      if (!validation.isValid) {
        alert(Object.values(validation.errors)[0]);
        return;
      }

      const newProject = appState.addProject({
        name: projectName.trim(),
        description: '새로운 페르소나 전략 프로젝트'
      });
      
      // 프로젝트 목록 다시 렌더링
      this.renderProjectsList();
      
      // 성공 메시지
      app.showSuccessMessage(`"${projectName}" 프로젝트가 생성되었습니다.`);
      
      // 대시보드로 이동할지 묻기
      const goToDashboard = confirm('새 프로젝트로 이동하시겠습니까?');
      if (goToDashboard) {
        appState.setCurrentProject(newProject.id);
        this.switchPage(PAGES.DASHBOARD);
      }
    }
  }

  // 프로젝트 열기
  openProject(projectId) {
    const project = appState.getState('projects').find(p => p.id === projectId);
    if (!project) {
      app.showErrorMessage('프로젝트를 찾을 수 없습니다.');
      return;
    }

    const confirmed = confirm(`"${project.name}" 프로젝트를 열겠습니까?\n\n현재 작업이 저장됩니다.`);
    
    if (confirmed) {
      // 현재 작업 저장
      app.saveCurrentFormData();
      
      // 프로젝트 설정
      appState.setCurrentProject(projectId);
      
      // 대시보드로 이동
      this.switchPage(PAGES.DASHBOARD);
      
      // 프로젝트의 현재 섹션으로 이동
      if (project.currentSection && SECTIONS.includes(project.currentSection)) {
        appState.setSection(project.currentSection);
      }
      
      app.showSuccessMessage(`${project.name} 프로젝트를 불러왔습니다.`);
    }
  }

  // 프로젝트 편집
  editProject(projectId) {
    const project = appState.getState('projects').find(p => p.id === projectId);
    if (!project) return;

    const newName = prompt('프로젝트명을 수정하세요:', project.name);
    if (newName && newName.trim() && newName.trim() !== project.name) {
      const validation = ValidationUtils.validateForm(
        { projectName: newName.trim() },
        { projectName: VALIDATION_RULES.projectName }
      );

      if (!validation.isValid) {
        alert(Object.values(validation.errors)[0]);
        return;
      }

      appState.updateProject(projectId, { name: newName.trim() });
      this.renderProjectsList();
      app.showSuccessMessage('프로젝트명이 수정되었습니다.');
    }
  }

  // 프로젝트 복제
  duplicateProject(projectId) {
    const project = appState.getState('projects').find(p => p.id === projectId);
    if (!project) return;

    const confirmed = confirm(`"${project.name}" 프로젝트를 복제하시겠습니까?`);
    if (confirmed) {
      const duplicatedProject = {
        ...project,
        name: `${project.name} (복사본)`,
        status: STATUS.PLANNING,
        progress: 0,
        createdAt: DateUtils.format(new Date()),
        updatedAt: DateUtils.format(new Date())
      };

      appState.addProject(duplicatedProject);
      this.renderProjectsList();
      app.showSuccessMessage('프로젝트가 복제되었습니다.');
    }
  }

  // 프로젝트 삭제
  deleteProject(projectId) {
    const project = appState.getState('projects').find(p => p.id === projectId);
    if (!project) return;

    const confirmed = confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`);
    if (confirmed) {
      appState.deleteProject(projectId);
      this.renderProjectsList();
      app.showSuccessMessage('프로젝트가 삭제되었습니다.');
    }
  }

  // 설정 저장
  saveSettings() {
    try {
      appState.saveToStorage();
      app.showSuccessMessage('설정이 저장되었습니다.');
      
      // 특정 설정 변경 시 페이지 새로고침 필요한 경우
      const settings = appState.getState('settings');
      if (settings.display.theme !== 'dark') {
        const needsReload = confirm('테마 변경사항을 적용하려면 페이지를 새로고침해야 합니다. 지금 새로고침하시겠습니까?');
        if (needsReload) {
          location.reload();
        }
      }
    } catch (error) {
      console.error('Settings save error:', error);
      app.showErrorMessage('설정 저장 중 오류가 발생했습니다.');
    }
  }

  // 설정 초기화
  resetSettings() {
    const confirmed = confirm('모든 설정을 초기값으로 되돌리시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
      appState.resetSettings();
      this.renderSettingsForm();
      app.showSuccessMessage('설정이 초기화되었습니다.');
      
      // 새로고침 권장
      setTimeout(() => {
        const reload = confirm('변경사항을 완전히 적용하려면 페이지를 새로고침하는 것이 좋습니다. 지금 새로고침하시겠습니까?');
        if (reload) {
          location.reload();
        }
      }, 1000);
    }
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

  // 상태 CSS 클래스 반환
  getStatusClass(status) {
    const classMap = {
      [STATUS.ACTIVE]: 'status-success',
      [STATUS.PLANNING]: 'status-warning',
      [STATUS.COMPLETED]: 'status-info',
      [STATUS.PAUSED]: 'status-error'
    };
    return classMap[status] || 'status-info';
  }

  // 페이지 데이터 내보내기
  exportPageData(pageId) {
    const pageData = {
      pageId,
      timestamp: new Date().toISOString(),
      data: {}
    };

    switch (pageId) {
      case PAGES.PROJECTS:
        pageData.data = {
          projects: appState.getState('projects'),
          currentProject: appState.getCurrentProject()
        };
        break;
      case PAGES.SETTINGS:
        pageData.data = {
          settings: appState.getState('settings'),
          user: appState.getState('user')
        };
        break;
      case PAGES.DASHBOARD:
        pageData.data = {
          currentMode: appState.getState('currentMode'),
          currentSection: appState.getState('currentSection'),
          formData: appState.getFormData()
        };
        break;
    }

    return pageData;
  }

  // 페이지 데이터 가져오기
  importPageData(pageData) {
    if (!pageData || !pageData.pageId || !pageData.data) {
      throw new Error('Invalid page data format');
    }

    switch (pageData.pageId) {
      case PAGES.PROJECTS:
        if (pageData.data.projects) {
          appState.setState({ projects: pageData.data.projects });
        }
        break;
      case PAGES.SETTINGS:
        if (pageData.data.settings) {
          appState.updateSettings(pageData.data.settings);
        }
        if (pageData.data.user) {
          appState.setState({ user: pageData.data.user });
        }
        break;
      case PAGES.DASHBOARD:
        if (pageData.data.formData) {
          appState.setState({ formData: pageData.data.formData });
        }
        break;
    }

    return true;
  }

  // 페이지 상태 검증
  validatePageState(pageId) {
    switch (pageId) {
      case PAGES.PROJECTS:
        return Array.isArray(appState.getState('projects'));
      case PAGES.SETTINGS:
        return typeof appState.getState('settings') === 'object';
      case PAGES.DASHBOARD:
        return Object.values(MODES).includes(appState.getState('currentMode'));
      default:
        return false;
    }
  }

  // 페이지 접근 권한 확인
  checkPagePermission(pageId) {
    const user = appState.getState('user');
    
    // 권한별 접근 제한 (필요시 구현)
    switch (user.role) {
      case 'viewer':
        return pageId !== PAGES.SETTINGS;
      case 'user':
      case 'admin':
      default:
        return true;
    }
  }

  // 현재 페이지 정보 반환
  getCurrentPageInfo() {
    return {
      pageId: this.currentPage,
      pageName: this.getPageName(this.currentPage),
      canGoBack: this.pageHistory.length > 1,
      history: [...this.pageHistory]
    };
  }

  // 페이지 이름 반환
  getPageName(pageId) {
    const pageNames = {
      [PAGES.DASHBOARD]: '메인 대시보드',
      [PAGES.PROJECTS]: '프로젝트 관리',
      [PAGES.SETTINGS]: '설정'
    };
    return pageNames[pageId] || pageId;
  }

  // 디버그 정보
  getDebugInfo() {
    return {
      currentPage: this.currentPage,
      pageHistory: this.pageHistory,
      pageState: this.validatePageState(this.currentPage),
      permissions: Object.values(PAGES).reduce((acc, pageId) => {
        acc[pageId] = this.checkPagePermission(pageId);
        return acc;
      }, {})
    };
  }
}

// 전역 페이지 매니저 인스턴스
const pageManager = new PageManager();