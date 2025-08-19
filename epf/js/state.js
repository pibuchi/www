// 애플리케이션 상태 관리
class AppState {
  constructor() {
    this.state = {
      currentMode: MODES.TOOL,
      currentSection: SECTIONS[0],
      currentPage: PAGES.DASHBOARD,
      currentProject: null,
      isLoading: false,
      formData: {},
      projects: [...SAMPLE_PROJECTS],
      settings: { ...DEFAULT_SETTINGS },
      user: {
        name: '김상품기획',
        email: 'product.manager@company.com',
        department: '상품기획팀',
        role: '관리자'
      }
    };
    
    this.subscribers = {};
    this.loadFromStorage();
  }

  // 상태 변경 구독
  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    
    // 구독 해제 함수 반환
    return () => {
      const index = this.subscribers[event].indexOf(callback);
      if (index > -1) {
        this.subscribers[event].splice(index, 1);
      }
    };
  }

  // 이벤트 발생
  emit(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event subscriber for ${event}:`, error);
        }
      });
    }
  }

  // 상태 업데이트
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // 변경된 속성에 대한 이벤트 발생
    Object.keys(updates).forEach(key => {
      if (prevState[key] !== this.state[key]) {
        this.emit(`${key}Change`, {
          previous: prevState[key],
          current: this.state[key]
        });
      }
    });
    
    this.saveToStorage();
  }

  // 상태 조회
  getState(key) {
    return key ? this.state[key] : { ...this.state };
  }

  // 모드 변경
  setMode(mode) {
    if (Object.values(MODES).includes(mode)) {
      this.setState({ currentMode: mode });
      this.emit(EVENTS.MODE_CHANGE, mode);
    }
  }

  // 페이지 변경
  setPage(page) {
    if (Object.values(PAGES).includes(page)) {
      this.setState({ currentPage: page });
      this.emit(EVENTS.PAGE_CHANGE, page);
    }
  }

  // 섹션 변경
  setSection(section) {
    if (SECTIONS.includes(section)) {
      this.setState({ currentSection: section });
      this.emit(EVENTS.SECTION_CHANGE, section);
    }
  }

  // 다음 섹션으로 이동
  nextSection() {
    const currentIndex = SECTIONS.indexOf(this.state.currentSection);
    if (currentIndex < SECTIONS.length - 1) {
      const nextSection = SECTIONS[currentIndex + 1];
      this.setSection(nextSection);
      return nextSection;
    }
    return null;
  }

  // 이전 섹션으로 이동
  prevSection() {
    const currentIndex = SECTIONS.indexOf(this.state.currentSection);
    if (currentIndex > 0) {
      const prevSection = SECTIONS[currentIndex - 1];
      this.setSection(prevSection);
      return prevSection;
    }
    return null;
  }

  // 폼 데이터 업데이트
  updateFormData(sectionKey, data) {
    const formData = {
      ...this.state.formData,
      [sectionKey]: { ...this.state.formData[sectionKey], ...data }
    };
    this.setState({ formData });
  }

  // 폼 데이터 조회
  getFormData(sectionKey) {
    return sectionKey ? this.state.formData[sectionKey] : this.state.formData;
  }

  // 프로젝트 관리
  addProject(project) {
    const newProject = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: STATUS.PLANNING,
      progress: 0
    };
    
    const projects = [...this.state.projects, newProject];
    this.setState({ projects, currentProject: newProject.id });
    this.emit(EVENTS.PROJECT_SAVE, newProject);
    return newProject;
  }

  updateProject(projectId, updates) {
    const projects = this.state.projects.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : project
    );
    this.setState({ projects });
    this.emit(EVENTS.PROJECT_SAVE, updates);
  }

  deleteProject(projectId) {
    const projects = this.state.projects.filter(project => project.id !== projectId);
    this.setState({ projects });
    
    if (this.state.currentProject === projectId) {
      this.setState({ currentProject: null });
    }
  }

  setCurrentProject(projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (project) {
      this.setState({ currentProject: projectId });
      if (project.currentSection) {
        this.setSection(project.currentSection);
      }
    }
  }

  getCurrentProject() {
    return this.state.projects.find(p => p.id === this.state.currentProject);
  }

  // 설정 관리
  updateSettings(updates) {
    const settings = { ...this.state.settings, ...updates };
    this.setState({ settings });
    this.emit(EVENTS.SETTINGS_SAVE, settings);
  }

  resetSettings() {
    this.setState({ settings: { ...DEFAULT_SETTINGS } });
    this.emit(EVENTS.SETTINGS_SAVE, DEFAULT_SETTINGS);
  }

  // 로딩 상태 관리
  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  // 로컬 스토리지에서 불러오기
  loadFromStorage() {
    try {
      // 프로젝트 데이터 로드
      const savedProject = localStorage.getItem(APP_CONFIG.storage.project);
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        this.setState({
          currentMode: projectData.currentMode || MODES.TOOL,
          currentSection: projectData.currentSection || SECTIONS[0],
          currentPage: projectData.currentPage || PAGES.DASHBOARD,
          formData: projectData.formData || {}
        });
      }

      // 설정 로드
      const savedSettings = localStorage.getItem(APP_CONFIG.storage.settings);
      if (savedSettings) {
        const settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
        this.setState({ settings });
      }

      // 사용자 선호도 로드
      const savedPreferences = localStorage.getItem(APP_CONFIG.storage.userPreferences);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        // 선호도 적용 로직
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // 로컬 스토리지에 저장
  saveToStorage() {
    try {
      const saveData = {
        currentMode: this.state.currentMode,
        currentSection: this.state.currentSection,
        currentPage: this.state.currentPage,
        formData: this.state.formData,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(APP_CONFIG.storage.project, JSON.stringify(saveData));
      localStorage.setItem(APP_CONFIG.storage.settings, JSON.stringify(this.state.settings));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // 자동 저장
  autoSave() {
    this.saveToStorage();
    console.log('Auto-saved at:', new Date().toLocaleTimeString());
  }

  // 상태 초기화
  reset() {
    this.state = {
      currentMode: MODES.TOOL,
      currentSection: SECTIONS[0],
      currentPage: PAGES.DASHBOARD,
      currentProject: null,
      isLoading: false,
      formData: {},
      projects: [...SAMPLE_PROJECTS],
      settings: { ...DEFAULT_SETTINGS }
    };
    this.saveToStorage();
  }

  // 디버그 정보
  debug() {
    return {
      state: this.state,
      subscribers: Object.keys(this.subscribers).reduce((acc, key) => {
        acc[key] = this.subscribers[key].length;
        return acc;
      }, {}),
      storage: {
        project: localStorage.getItem(APP_CONFIG.storage.project),
        settings: localStorage.getItem(APP_CONFIG.storage.settings)
      }
    };
  }
}

// 전역 상태 인스턴스
const appState = new AppState();

// 자동 저장 설정
if (appState.getState('settings').preferences.autoSave) {
  setInterval(() => {
    appState.autoSave();
  }, appState.getState('settings').preferences.autoSaveInterval * 1000);
}