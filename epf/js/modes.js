// 모드 관리 클래스
class ModeManager {
  constructor() {
    this.currentMode = MODES.TOOL;
    this.modeHistory = [MODES.TOOL];
    this.modeData = new Map();
    this.transitions = new Map();
    this.setupModeTransitions();
  }

  // 모드 전환 규칙 설정
  setupModeTransitions() {
    // 각 모드에서 전환 가능한 모드들
    this.transitions.set(MODES.TOOL, [MODES.GUIDE, MODES.HYBRID]);
    this.transitions.set(MODES.GUIDE, [MODES.TOOL, MODES.HYBRID]);
    this.transitions.set(MODES.HYBRID, [MODES.TOOL, MODES.GUIDE]);
  }

  // 모드 전환
  switchMode(targetMode) {
    if (!Object.values(MODES).includes(targetMode)) {
      console.error(`Invalid mode: ${targetMode}`);
      return false;
    }

    // 현재 모드와 같으면 무시
    if (this.currentMode === targetMode) {
      return true;
    }

    // 전환 가능 여부 확인
    if (!this.canTransitionTo(targetMode)) {
      console.warn(`Cannot transition from ${this.currentMode} to ${targetMode}`);
      return false;
    }

    const previousMode = this.currentMode;
    
    // 현재 모드 데이터 저장
    this.saveModeData(previousMode);
    
    // 모드 전환 애니메이션
    this.animateModeTransition(previousMode, targetMode);
    
    // 모드 업데이트
    this.currentMode = targetMode;
    this.updateModeHistory(targetMode);
    
    // 새 모드 초기화
    this.initializeMode(targetMode);
    
    // 상태 업데이트
    appState.setState({ currentMode: targetMode });
    
    console.log(`Mode switched: ${previousMode} → ${targetMode}`);
    return true;
  }

  // 전환 가능 여부 확인
  canTransitionTo(targetMode) {
    const allowedTransitions = this.transitions.get(this.currentMode) || [];
    return allowedTransitions.includes(targetMode);
  }

  // 모드 히스토리 업데이트
  updateModeHistory(mode) {
    // 연속된 같은 모드 방지
    if (this.modeHistory[this.modeHistory.length - 1] !== mode) {
      this.modeHistory.push(mode);
      
      // 히스토리 길이 제한 (최대 5개)
      if (this.modeHistory.length > 5) {
        this.modeHistory.shift();
      }
    }
  }

  // 이전 모드로 돌아가기
  goToPreviousMode() {
    if (this.modeHistory.length > 1) {
      // 현재 모드 제거
      this.modeHistory.pop();
      
      // 이전 모드로 전환
      const previousMode = this.modeHistory[this.modeHistory.length - 1];
      this.switchMode(previousMode);
      
      return true;
    }
    return false;
  }

  // 모드 전환 애니메이션
  async animateModeTransition(fromMode, toMode) {
    const fromContainer = this.getModeContainer(fromMode);
    const toContainer = this.getModeContainer(toMode);

    if (!fromContainer || !toContainer) return;

    // 전환 효과에 따른 애니메이션 선택
    const transitionType = this.getTransitionType(fromMode, toMode);
    
    switch (transitionType) {
      case 'slide':
        await this.slideTransition(fromContainer, toContainer);
        break;
      case 'fade':
        await this.fadeTransition(fromContainer, toContainer);
        break;
      case 'split':
        await this.splitTransition(fromContainer, toContainer);
        break;
      default:
        await this.defaultTransition(fromContainer, toContainer);
    }
  }

  // 전환 타입 결정
  getTransitionType(fromMode, toMode) {
    // 하이브리드 모드로/에서 전환 시 분할 효과
    if (fromMode === MODES.HYBRID || toMode === MODES.HYBRID) {
      return 'split';
    }
    
    // 도구 ↔ 가이드 모드 간에는 슬라이드 효과
    if ((fromMode === MODES.TOOL && toMode === MODES.GUIDE) ||
        (fromMode === MODES.GUIDE && toMode === MODES.TOOL)) {
      return 'slide';
    }
    
    // 기본적으로 페이드 효과
    return 'fade';
  }

  // 슬라이드 전환
  async slideTransition(fromContainer, toContainer) {
    const direction = this.currentMode === MODES.GUIDE ? 'left' : 'right';
    
    // 현재 컨테이너 슬라이드 아웃
    await DOM.animate(fromContainer, [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: `translateX(${direction === 'left' ? '-100%' : '100%'})`, opacity: 0 }
    ], { duration: 300 });
    
    fromContainer.classList.remove('active');
    
    // 새 컨테이너 슬라이드 인
    toContainer.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
    toContainer.classList.add('active');
    
    await DOM.animate(toContainer, [
      { transform: `translateX(${direction === 'left' ? '100%' : '-100%'})`, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ], { duration: 300 });
    
    toContainer.style.transform = '';
  }

  // 페이드 전환
  async fadeTransition(fromContainer, toContainer) {
    // 크로스 페이드 효과
    const fadeOut = DOM.animate(fromContainer, [
      { opacity: 1 },
      { opacity: 0 }
    ], { duration: 200 });
    
    setTimeout(() => {
      fromContainer.classList.remove('active');
      toContainer.classList.add('active');
      
      DOM.animate(toContainer, [
        { opacity: 0 },
        { opacity: 1 }
      ], { duration: 200 });
    }, 100);
    
    await fadeOut;
  }

  // 분할 전환 (하이브리드 모드용)
  async splitTransition(fromContainer, toContainer) {
    if (toContainer.id === 'hybrid-mode') {
      // 하이브리드 모드로 전환
      await this.transitionToHybrid(fromContainer, toContainer);
    } else {
      // 하이브리드 모드에서 전환
      await this.transitionFromHybrid(fromContainer, toContainer);
    }
  }

  // 하이브리드 모드로 전환
  async transitionToHybrid(fromContainer, toContainer) {
    // 기존 컨테이너를 축소하면서 페이드 아웃
    await DOM.animate(fromContainer, [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.8)', opacity: 0 }
    ], { duration: 250 });
    
    fromContainer.classList.remove('active');
    toContainer.classList.add('active');
    
    // 하이브리드 패널들을 확장하면서 페이드 인
    const panels = toContainer.querySelectorAll('.hybrid-panel');
    panels.forEach((panel, index) => {
      panel.style.transform = 'scale(0.8)';
      panel.style.opacity = '0';
      
      setTimeout(() => {
        DOM.animate(panel, [
          { transform: 'scale(0.8)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 }
        ], { duration: 300 });
      }, index * 100);
    });
  }

  // 하이브리드 모드에서 전환
  async transitionFromHybrid(fromContainer, toContainer) {
    const panels = fromContainer.querySelectorAll('.hybrid-panel');
    
    // 패널들을 순차적으로 축소
    const fadePromises = Array.from(panels).map((panel, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          DOM.animate(panel, [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0.8)', opacity: 0 }
          ], { duration: 200 }).then(resolve);
        }, index * 50);
      });
    });
    
    await Promise.all(fadePromises);
    
    fromContainer.classList.remove('active');
    toContainer.classList.add('active');
    
    // 새 컨테이너 확장하면서 페이드 인
    toContainer.style.transform = 'scale(0.8)';
    toContainer.style.opacity = '0';
    
    await DOM.animate(toContainer, [
      { transform: 'scale(0.8)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: 300 });
    
    toContainer.style.transform = '';
    toContainer.style.opacity = '';
  }

  // 기본 전환
  async defaultTransition(fromContainer, toContainer) {
    await this.fadeTransition(fromContainer, toContainer);
  }

  // 모드 컨테이너 조회
  getModeContainer(mode) {
    const containerMap = {
      [MODES.TOOL]: DOM.$('#tool-mode'),
      [MODES.GUIDE]: DOM.$('#workflow-guide-mode'),
      [MODES.HYBRID]: DOM.$('#hybrid-mode')
    };
    return containerMap[mode];
  }

  // 모드 초기화
  initializeMode(mode) {
    switch (mode) {
      case MODES.TOOL:
        this.initializeToolMode();
        break;
      case MODES.GUIDE:
        this.initializeGuideMode();
        break;
      case MODES.HYBRID:
        this.initializeHybridMode();
        break;
    }
    
    // 모드별 버튼 상태 업데이트
    this.updateModeButtons(mode);
  }

  // 도구 모드 초기화
  initializeToolMode() {
    // 사이드바와 메인 콘텐츠 영역 설정
    const sidebar = DOM.$('.tool-sidebar');
    const content = DOM.$('.tool-content');
    
    if (sidebar && content) {
      // 사이드바 콘텐츠 업데이트
      sidebar.innerHTML = sectionManager.createSidebarContent();
      
      // 현재 섹션 콘텐츠 업데이트
      const currentSection = appState.getState('currentSection');
      sectionManager.updateSection(currentSection);
    }
    
    // 저장된 모드 데이터 복원
    this.restoreModeData(MODES.TOOL);
    
    console.log('Tool mode initialized');
  }

  // 가이드 모드 초기화
  initializeGuideMode() {
    const guideContainer = DOM.$('#workflow-guide-mode');
    
    if (guideContainer) {
      // 가이드 콘텐츠가 없으면 생성
      if (!guideContainer.innerHTML.trim()) {
        guideContainer.innerHTML = sectionManager.createWorkflowGuideContent();
      }
    }
    
    // 저장된 모드 데이터 복원
    this.restoreModeData(MODES.GUIDE);
    
    console.log('Guide mode initialized');
  }

  // 하이브리드 모드 초기화
  initializeHybridMode() {
    const hybridContainer = DOM.$('#hybrid-mode');
    const guideContent = DOM.$('#hybrid-guide-content');
    const toolContent = DOM.$('#hybrid-tool-content');
    
    if (guideContent && toolContent) {
      // 현재 섹션에 맞는 가이드 콘텐츠 업데이트
      const currentSection = appState.getState('currentSection');
      this.updateHybridGuideContent(currentSection);
      
      // 도구 콘텐츠 업데이트
      this.updateHybridToolContent(currentSection);
    }
    
    // 저장된 모드 데이터 복원
    this.restoreModeData(MODES.HYBRID);
    
    console.log('Hybrid mode initialized');
  }

  // 하이브리드 모드 가이드 콘텐츠 업데이트
  updateHybridGuideContent(sectionId) {
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
        
        <div class="guide-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.calculateSectionProgress(sectionId)}%"></div>
          </div>
          <div class="progress-text">
            <span>${guide.title} 진행률</span>
            <span>${this.calculateSectionProgress(sectionId)}%</span>
          </div>
        </div>
      `;
    }
  }

  // 하이브리드 모드 도구 콘텐츠 업데이트
  updateHybridToolContent(sectionId) {
    const toolContent = DOM.$('#hybrid-tool-content');
    if (!toolContent) return;

    toolContent.innerHTML = sectionManager.createHybridToolContent(sectionId);
  }

  // 섹션 진행률 계산
  calculateSectionProgress(sectionId) {
    const formData = appState.getFormData(sectionId);
    if (!formData) return 0;

    const totalFields = this.getSectionFieldCount(sectionId);
    const completedFields = Object.keys(formData).filter(key => {
      const value = formData[key];
      return value !== null && value !== undefined && value !== '';
    }).length;

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }

  // 섹션별 필드 수 반환
  getSectionFieldCount(sectionId) {
    const fieldCounts = {
      'business-context': 4, // projectGoal, industry, productName, productDescription
      'data-integration': 5, // 체크박스 5개
      'persona-modeling': 0, // 읽기 전용
      'market-intelligence': 0, // 읽기 전용
      'strategy-simulation': 2, // marketingBudget, targetScope
      'insights-dashboard': 0, // 읽기 전용
      'performance-tracking': 0 // 읽기 전용
    };
    
    return fieldCounts[sectionId] || 0;
  }

  // 모드 버튼 상태 업데이트
  updateModeButtons(activeMode) {
    const buttons = document.querySelectorAll('.mode-nav-item');
    buttons.forEach(button => {
      button.classList.remove('active');
      
      const mode = button.dataset.mode;
      if (mode === activeMode) {
        button.classList.add('active');
      }
      
      // 전환 가능 여부에 따른 버튼 상태
      const canTransition = this.canTransitionTo(mode);
      button.disabled = !canTransition;
      
      if (!canTransition) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }
    });
  }

  // 모드 데이터 저장
  saveModeData(mode) {
    const data = {};
    
    switch (mode) {
      case MODES.TOOL:
        data.scrollPosition = window.scrollY;
        data.sidebarCollapsed = DOM.$('.tool-sidebar')?.classList.contains('collapsed');
        break;
        
      case MODES.GUIDE:
        data.scrollPosition = window.scrollY;
        data.currentStep = this.getCurrentGuideStep();
        break;
        
      case MODES.HYBRID:
        data.leftPanelScroll = DOM.$('#hybrid-guide-content')?.scrollTop || 0;
        data.rightPanelScroll = DOM.$('#hybrid-tool-content')?.scrollTop || 0;
        break;
    }
    
    this.modeData.set(mode, data);
  }

  // 모드 데이터 복원
  restoreModeData(mode) {
    const data = this.modeData.get(mode);
    if (!data) return;
    
    switch (mode) {
      case MODES.TOOL:
        if (data.scrollPosition) {
          setTimeout(() => window.scrollTo(0, data.scrollPosition), 100);
        }
        if (data.sidebarCollapsed) {
          DOM.$('.tool-sidebar')?.classList.add('collapsed');
        }
        break;
        
      case MODES.GUIDE:
        if (data.scrollPosition) {
          setTimeout(() => window.scrollTo(0, data.scrollPosition), 100);
        }
        break;
        
      case MODES.HYBRID:
        setTimeout(() => {
          if (data.leftPanelScroll) {
            const leftPanel = DOM.$('#hybrid-guide-content');
            if (leftPanel) leftPanel.scrollTop = data.leftPanelScroll;
          }
          if (data.rightPanelScroll) {
            const rightPanel = DOM.$('#hybrid-tool-content');
            if (rightPanel) rightPanel.scrollTop = data.rightPanelScroll;
          }
        }, 100);
        break;
    }
  }

  // 현재 가이드 단계 조회
  getCurrentGuideStep() {
    // 현재 표시된 가이드 단계 확인 로직
    const currentSection = appState.getState('currentSection');
    return SECTIONS.indexOf(currentSection) + 1;
  }

  // 모드별 단축키 설정
  setupModeShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + 숫자 키로 모드 전환
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.switchMode(MODES.TOOL);
            break;
          case '2':
            e.preventDefault();
            this.switchMode(MODES.GUIDE);
            break;
          case '3':
            e.preventDefault();
            this.switchMode(MODES.HYBRID);
            break;
        }
      }
      
      // ESC 키로 이전 모드로 돌아가기
      if (e.key === 'Escape' && this.modeHistory.length > 1) {
        e.preventDefault();
        this.goToPreviousMode();
      }
    });
  }

  // 모드별 도움말 표시
  showModeHelp(mode) {
    const helpContent = {
      [MODES.TOOL]: {
        title: '🔧 작업 도구 모드',
        description: '각 섹션별로 데이터를 입력하고 분석 결과를 확인할 수 있습니다.',
        shortcuts: [
          'Alt + 1: 도구 모드로 전환',
          'Tab: 다음 입력 필드로 이동',
          'Ctrl + S: 수동 저장'
        ],
        tips: [
          '좌측 사이드바에서 원하는 섹션을 선택하세요',
          '각 섹션의 도움말을 참고하여 정확한 정보를 입력하세요',
          '작업 중 자동 저장되므로 안심하고 작업하세요'
        ]
      },
      [MODES.GUIDE]: {
        title: '📚 워크플로우 가이드 모드',
        description: '전체 워크플로우를 이해하고 각 단계별 가이드를 확인할 수 있습니다.',
        shortcuts: [
          'Alt + 2: 가이드 모드로 전환',
          '스크롤: 가이드 내용 탐색'
        ],
        tips: [
          '처음 사용하시는 경우 가이드를 먼저 읽어보세요',
          '각 단계별 체크리스트를 활용하세요',
          '실행 팁을 참고하여 효과적으로 작업하세요'
        ]
      },
      [MODES.HYBRID]: {
        title: '⚡ 하이브리드 모드',
        description: '가이드를 참고하면서 동시에 작업을 진행할 수 있습니다.',
        shortcuts: [
          'Alt + 3: 하이브리드 모드로 전환',
          'Tab: 패널 간 포커스 이동'
        ],
        tips: [
          '왼쪽에서 가이드를 확인하고 오른쪽에서 작업하세요',
          '각 섹션별로 맞춤형 가이드가 표시됩니다',
          '진행률을 실시간으로 확인할 수 있습니다'
        ]
      }
    };

    const help = helpContent[mode];
    if (help) {
      this.displayHelpModal(help);
    }
  }

  // 도움말 모달 표시
  displayHelpModal(helpData) {
    const modal = DOM.create('div', {
      className: 'modal help-modal active',
      innerHTML: `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>${helpData.title}</h3>
            <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
          </div>
          <div class="modal-body">
            <p>${helpData.description}</p>
            
            <h4>키보드 단축키</h4>
            <ul>
              ${helpData.shortcuts.map(shortcut => `<li>${shortcut}</li>`).join('')}
            </ul>
            
            <h4>사용 팁</h4>
            <ul>
              ${helpData.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="this.closest('.modal').remove()">확인</button>
          </div>
        </div>
      `
    });

    document.body.appendChild(modal);

    // 모달 외부 클릭 시 닫기
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      modal.remove();
    });
  }

  // 모드 상태 검증
  validateModeState() {
    const issues = [];

    // 현재 모드가 유효한지 확인
    if (!Object.values(MODES).includes(this.currentMode)) {
      issues.push(`Invalid current mode: ${this.currentMode}`);
    }

    // 모드 컨테이너가 존재하는지 확인
    Object.values(MODES).forEach(mode => {
      const container = this.getModeContainer(mode);
      if (!container) {
        issues.push(`Missing container for mode: ${mode}`);
      }
    });

    // 활성 모드 컨테이너가 정확한지 확인
    const activeContainers = document.querySelectorAll('.workflow-guide-mode.active, .tool-mode.active, .hybrid-mode.active');
    if (activeContainers.length !== 1) {
      issues.push(`Expected 1 active mode container, found ${activeContainers.length}`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  // 모드 성능 메트릭 수집
  collectPerformanceMetrics() {
    const metrics = {
      currentMode: this.currentMode,
      modeHistory: [...this.modeHistory],
      transitionCount: this.modeHistory.length - 1,
      modeDataSize: Array.from(this.modeData.entries()).reduce((acc, [mode, data]) => {
        acc[mode] = JSON.stringify(data).length;
        return acc;
      }, {}),
      timestamp: Date.now()
    };

    return metrics;
  }

  // 모드 상태 내보내기
  exportModeState() {
    return {
      currentMode: this.currentMode,
      modeHistory: [...this.modeHistory],
      modeData: Object.fromEntries(this.modeData),
      timestamp: new Date().toISOString()
    };
  }

  // 모드 상태 가져오기
  importModeState(stateData) {
    if (!stateData || typeof stateData !== 'object') {
      throw new Error('Invalid mode state data');
    }

    // 상태 복원
    if (stateData.currentMode && Object.values(MODES).includes(stateData.currentMode)) {
      this.currentMode = stateData.currentMode;
    }

    if (Array.isArray(stateData.modeHistory)) {
      this.modeHistory = stateData.modeHistory.filter(mode => Object.values(MODES).includes(mode));
    }

    if (stateData.modeData && typeof stateData.modeData === 'object') {
      this.modeData.clear();
      Object.entries(stateData.modeData).forEach(([mode, data]) => {
        if (Object.values(MODES).includes(mode)) {
          this.modeData.set(mode, data);
        }
      });
    }

    // 현재 모드로 전환
    this.initializeMode(this.currentMode);

    return true;
  }

  // 모드 통계 정보
  getStatistics() {
    const modeUsage = this.modeHistory.reduce((acc, mode) => {
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});

    return {
      currentMode: this.currentMode,
      totalTransitions: this.modeHistory.length - 1,
      modeUsage,
      mostUsedMode: Object.entries(modeUsage).sort(([,a], [,b]) => b - a)[0]?.[0],
      averageTimePerMode: this.calculateAverageTimePerMode()
    };
  }

  // 모드별 평균 사용 시간 계산
  calculateAverageTimePerMode() {
    // 실제 구현에서는 타임스탬프 기반으로 계산
    return {
      [MODES.TOOL]: '5분 30초',
      [MODES.GUIDE]: '2분 45초',
      [MODES.HYBRID]: '8분 15초'
    };
  }

  // 디버그 정보
  getDebugInfo() {
    return {
      currentMode: this.currentMode,
      modeHistory: this.modeHistory,
      validation: this.validateModeState(),
      performance: this.collectPerformanceMetrics(),
      statistics: this.getStatistics()
    };
  }
}

// 전역 모드 매니저 인스턴스
const modeManager = new ModeManager();

// 모드 단축키 설정
modeManager.setupModeShortcuts();