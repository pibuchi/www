// 섹션별 콘텐츠 관리
class SectionManager {
  constructor() {
    this.currentSection = 'business-context';
    this.contentCache = new Map();
  }

  // 섹션 콘텐츠 생성
  createSectionContent(sectionId) {
    if (this.contentCache.has(sectionId)) {
      return this.contentCache.get(sectionId);
    }

    const content = this.generateSectionHTML(sectionId);
    this.contentCache.set(sectionId, content);
    return content;
  }

  // 섹션별 HTML 생성
  generateSectionHTML(sectionId) {
    const meta = SECTION_META[sectionId];
    if (!meta) return this.createEmptySection();

    switch (sectionId) {
      case 'business-context':
        return this.createBusinessContextSection();
      case 'data-integration':
        return this.createDataIntegrationSection();
      case 'persona-modeling':
        return this.createPersonaModelingSection();
      case 'market-intelligence':
        return this.createMarketIntelligenceSection();
      case 'strategy-simulation':
        return this.createStrategySimulationSection();
      case 'insights-dashboard':
        return this.createInsightsDashboardSection();
      case 'performance-tracking':
        return this.createPerformanceTrackingSection();
      default:
        return this.createEmptySection();
    }
  }

  // 비즈니스 컨텍스트 섹션
  createBusinessContextSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">비즈니스 컨텍스트 설정</h2>
            <p class="card-subtitle">프로젝트 목표와 비즈니스 상황을 설정해주세요</p>
          </div>
          <button class="btn btn-secondary guide-help-btn">
            📖 가이드 보기
          </button>
        </div>

        <div class="form-group">
          <label class="form-label">프로젝트 목표</label>
          <select class="form-select" id="project-goal" data-field="projectGoal">
            <option value="">목표를 선택하세요</option>
            <option value="new-product">신제품 출시</option>
            <option value="market-expansion">시장 확장</option>
            <option value="optimization">성과 최적화</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">업종</label>
          <select class="form-select" id="industry" data-field="industry">
            <option value="">업종을 선택하세요</option>
            <option value="tech">IT/테크</option>
            <option value="retail">소매/유통</option>
            <option value="finance">금융</option>
            <option value="healthcare">헬스케어</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">제품/서비스명</label>
          <input type="text" class="form-input" id="product-name" data-field="productName" 
                 placeholder="제품 또는 서비스명을 입력하세요">
        </div>

        <div class="form-group">
          <label class="form-label">제품/서비스 설명</label>
          <textarea class="form-textarea" id="product-description" data-field="productDescription" 
                    placeholder="주요 기능, 특징, 차별점 등을 자세히 설명해주세요"></textarea>
        </div>

        <div class="help-box">
          <h4>💡 도움말</h4>
          <p>
            명확한 비즈니스 목표 설정이 성공적인 페르소나 전략의 첫 단계입니다. 
            구체적이고 측정 가능한 목표를 설정하세요.
          </p>
        </div>

        <button class="btn btn-primary next-section-btn">
          다음 단계: 데이터 통합 →
        </button>
      </div>
    `;
  }

  // 데이터 통합 섹션
  createDataIntegrationSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">데이터 소스 통합</h2>
            <p class="card-subtitle">신뢰성 높은 분석을 위한 다양한 데이터 연결</p>
          </div>
          <button class="btn btn-secondary guide-help-btn">
            📖 가이드 보기
          </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div class="metric-card success">
            <div class="metric-value">3</div>
            <div class="metric-label">연결된 데이터 소스</div>
          </div>
          <div class="metric-card primary">
            <div class="metric-value">87%</div>
            <div class="metric-label">데이터 신뢰도</div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">자사 데이터 (높은 신뢰도)</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" checked data-field="crmData">
              <span>CRM 고객 데이터</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" checked data-field="salesData">
              <span>매출/구매 이력</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" data-field="webData">
              <span>웹사이트 행동 데이터</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">외부 데이터 (보완적 활용)</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" checked data-field="benchmarkData">
              <span>업계 벤치마크 데이터</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" data-field="socialData">
              <span>소셜 미디어 트렌드</span>
            </label>
          </div>
        </div>
        
        <div class="help-box">
          <h4>💡 도움말</h4>
          <p>자사 데이터는 신뢰도가 높지만, 외부 시장 데이터와 결합해야 완전한 인사이트를 얻을 수 있습니다.</p>
        </div>
        
        <button class="btn btn-primary next-section-btn">다음 단계: 페르소나 모델링 →</button>
      </div>
    `;
  }

  // 페르소나 모델링 섹션
  createPersonaModelingSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">AI 페르소나 모델링</h2>
            <p class="card-subtitle">데이터 기반 고객 세분화 및 페르소나 생성</p>
          </div>
          <div class="status status-success">
            신뢰도 87%
          </div>
        </div>
        
        <div class="persona-card primary">
          <div class="persona-header">
            <div class="persona-avatar">A</div>
            <div class="persona-info">
              <h3>액티브 프로페셔널 (Primary)</h3>
              <p>전체 타겟의 34% • 높은 구매력 • 브랜드 충성도 높음</p>
            </div>
          </div>
          
          <div class="persona-details">
            <div class="detail-card">
              <h4>데모그래픽</h4>
              <p>28-35세 직장인<br>월 소득 400-600만원</p>
            </div>
            <div class="detail-card">
              <h4>구매 행동</h4>
              <p>충분한 리서치 후 구매<br>브랜드 신뢰도 중시</p>
            </div>
            <div class="detail-card">
              <h4>관심사</h4>
              <p>건강, 자기계발<br>효율성 추구</p>
            </div>
          </div>
        </div>

        <div class="persona-card secondary">
          <div class="persona-header">
            <div class="persona-avatar secondary">B</div>
            <div class="persona-info">
              <h3>디지털 네이티브 (Secondary)</h3>
              <p>전체 타겟의 26% • 높은 디지털 활용도 • 트렌드 민감</p>
            </div>
          </div>
          
          <div class="persona-details">
            <div class="detail-card">
              <h4>데모그래픽</h4>
              <p>20-27세 학생/직장인<br>월 소득 200-400만원</p>
            </div>
            <div class="detail-card">
              <h4>구매 행동</h4>
              <p>온라인 중심 구매<br>리뷰와 추천 중시</p>
            </div>
            <div class="detail-card">
              <h4>관심사</h4>
              <p>소셜미디어, 게임<br>새로운 경험 추구</p>
            </div>
          </div>
        </div>
        
        <div class="help-box">
          <h4>💡 도움말</h4>
          <p>AI가 생성한 페르소나는 실제 데이터를 기반으로 하므로 높은 정확도를 보입니다. 각 페르소나의 특성을 자세히 검토하세요.</p>
        </div>
        
        <button class="btn btn-primary next-section-btn">다음 단계: 시장 인텔리전스 →</button>
      </div>
    `;
  }

  // 시장 인텔리전스 섹션
  createMarketIntelligenceSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">시장 인텔리전스</h2>
            <p class="card-subtitle">경쟁 환경 분석 및 시장 기회 발굴</p>
          </div>
          <div class="status status-warning">
            신뢰도 73%
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card primary">
            <div class="metric-value">12</div>
            <div class="metric-label">주요 경쟁사</div>
          </div>
          <div class="metric-card success">
            <div class="metric-value">₩2.3조</div>
            <div class="metric-label">시장 규모</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-value">15.2%</div>
            <div class="metric-label">연평균 성장률</div>
          </div>
        </div>
        
        <div class="positioning-map">
          <h3>경쟁사 포지셔닝</h3>
          <div class="map-container">
            <div class="map-axis top">고급/프리미엄</div>
            <div class="map-axis bottom">저가/실속형</div>
            <div class="map-axis left">전문성</div>
            <div class="map-axis right">대중성</div>
            
            <div class="competitor" style="top: 30%; left: 30%;" data-company="A사">A사</div>
            <div class="competitor" style="top: 60%; left: 70%;" data-company="B사">B사</div>
            <div class="competitor our-position" style="top: 45%; left: 45%;" data-company="우리">우리</div>
          </div>
        </div>
        
        <div class="help-box">
          <h4>💡 도움말</h4>
          <p>포지셔닝 맵에서 우리 제품의 위치를 확인하고, 경쟁이 적은 영역을 찾아 차별화 기회를 모색하세요.</p>
        </div>
        
        <button class="btn btn-primary next-section-btn">다음 단계: 전략 시뮬레이션 →</button>
      </div>
    `;
  }

  // 전략 시뮬레이션 섹션
  createStrategySimulationSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">전략 시뮬레이션</h2>
            <p class="card-subtitle">다양한 시나리오 기반 전략 테스트</p>
          </div>
          <button class="btn btn-secondary guide-help-btn">
            📖 가이드 보기
          </button>
        </div>
        
        <div class="scenario-grid">
          <div class="scenario-card primary">
            <div class="scenario-title">시나리오 A</div>
            <div class="scenario-name">프리미엄 전략</div>
            <div class="scenario-roi">ROI 예측: 23%</div>
          </div>
          <div class="scenario-card warning">
            <div class="scenario-title">시나리오 B</div>
            <div class="scenario-name">대중화 전략</div>
            <div class="scenario-roi">ROI 예측: 18%</div>
          </div>
          <div class="scenario-card success">
            <div class="scenario-title">시나리오 C</div>
            <div class="scenario-name">니치 전략</div>
            <div class="scenario-roi">ROI 예측: 31%</div>
          </div>
        </div>
        
        <div class="simulation-controls">
          <h4>시뮬레이션 변수 조정</h4>
          <div class="control-group">
            <label>마케팅 예산</label>
            <input type="range" min="100" max="1000" value="500" class="range-input" data-field="marketingBudget">
            <span class="range-value">500만원</span>
          </div>
          <div class="control-group">
            <label>타겟 범위</label>
            <input type="range" min="1" max="5" value="3" class="range-input" data-field="targetScope">
            <span class="range-value">중간</span>
          </div>
        </div>
        
        <div class="help-box">
          <h4>🎮 시뮬레이션 도움말</h4>
          <p>다양한 변수를 조정하여 최적의 전략을 찾아보세요. 각 시나리오의 예상 성과를 비교해보실 수 있습니다.</p>
        </div>
        
        <button class="btn btn-primary next-section-btn">다음 단계: 인사이트 대시보드 →</button>
      </div>
    `;
  }

  // 인사이트 대시보드 섹션
  createInsightsDashboardSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">인사이트 대시보드</h2>
            <p class="card-subtitle">핵심 인사이트와 실행 가능한 권고사항</p>
          </div>
          <button class="btn btn-secondary export-report-btn">
            📊 보고서 내보내기
          </button>
        </div>
        
        <div class="impact-metrics">
          <div class="impact-card success">
            <h4>💰 수익 임팩트</h4>
            <div class="impact-value">+32%</div>
            <p>예상 매출 증가율</p>
          </div>
          
          <div class="impact-card primary">
            <h4>🎯 타겟 정확도</h4>
            <div class="impact-value">87%</div>
            <p>페르소나 매칭률</p>
          </div>
          
          <div class="impact-card warning">
            <h4>⚡ 효율성</h4>
            <div class="impact-value">2.4x</div>
            <p>마케팅 효율 개선</p>
          </div>
        </div>

        <div class="insights-list">
          <h4>핵심 인사이트</h4>
          <div class="insight-item high">
            <div class="insight-priority">High Impact</div>
            <div class="insight-content">
              <h5>액티브 프로페셔널 집중 공략</h5>
              <p>가장 높은 ROI를 보이는 세그먼트로 우선 투자 권장</p>
            </div>
          </div>
          <div class="insight-item medium">
            <div class="insight-priority">Medium Impact</div>
            <div class="insight-content">
              <h5>디지털 채널 강화</h5>
              <p>온라인 마케팅 비중을 60%까지 확대 검토</p>
            </div>
          </div>
          <div class="insight-item low">
            <div class="insight-priority">Low Impact</div>
            <div class="insight-content">
              <h5>브랜드 인지도 개선</h5>
              <p>장기적 관점에서 브랜드 마케팅 투자 고려</p>
            </div>
          </div>
        </div>
        
        <div class="help-box">
          <h4>💡 실행 가이드</h4>
          <p>High Impact 항목부터 우선 실행하세요. 각 인사이트는 실행 가능한 액션 아이템으로 구성되어 있습니다.</p>
        </div>
        
        <button class="btn btn-primary next-section-btn">다음 단계: 성과 추적 →</button>
      </div>
    `;
  }

  // 성과 추적 섹션
  createPerformanceTrackingSection() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">성과 추적</h2>
            <p class="card-subtitle">실시간 성과 모니터링 및 최적화</p>
          </div>
          <button class="btn btn-secondary setup-alerts-btn">
            🔔 알림 설정
          </button>
        </div>
        
        <div class="performance-metrics">
          <div class="metric-card success">
            <div class="metric-value">94%</div>
            <div class="metric-label">목표 달성률</div>
            <div class="metric-change positive">↗ +12% vs 지난 달</div>
          </div>
          
          <div class="metric-card primary">
            <div class="metric-value">2.8</div>
            <div class="metric-label">평균 CPA</div>
            <div class="metric-change positive">↗ -23% vs 지난 달</div>
          </div>
          
          <div class="metric-card warning">
            <div class="metric-value">156K</div>
            <div class="metric-label">월 리치</div>
            <div class="metric-change positive">↗ +45% vs 지난 달</div>
          </div>
        </div>

        <div class="tracking-chart">
          <h4>성과 트렌드</h4>
          <div class="chart-placeholder">
            <div class="chart-line"></div>
            <div class="chart-data">
              <div class="data-point" style="left: 10%; height: 40%"></div>
              <div class="data-point" style="left: 25%; height: 60%"></div>
              <div class="data-point" style="left: 40%; height: 80%"></div>
              <div class="data-point" style="left: 55%; height: 70%"></div>
              <div class="data-point" style="left: 70%; height: 90%"></div>
              <div class="data-point" style="left: 85%; height: 95%"></div>
            </div>
          </div>
        </div>

        <div class="alert alert-success">
          <div class="alert-icon">✅</div>
          <div class="alert-content">
            <div class="alert-title">목표 달성!</div>
            <div class="alert-description">이번 달 매출 목표를 94% 달성했습니다.</div>
          </div>
        </div>
        
        <div class="help-box">
          <h4>📊 성과 최적화 팁</h4>
          <p>주요 지표를 정기적으로 모니터링하고, 목표 대비 성과가 낮은 영역을 식별하여 즉시 개선하세요.</p>
        </div>
        
        <button class="btn btn-primary complete-workflow-btn">
          ✅ 워크플로우 완료
        </button>
      </div>
    `;
  }

  // 빈 섹션
  createEmptySection() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">섹션을 선택하세요</h2>
          <p class="card-subtitle">왼쪽 사이드바에서 작업할 섹션을 선택해주세요</p>
        </div>
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">시작할 섹션을 선택하세요</div>
          <div class="empty-state-description">
            좌측 사이드바에서 작업하고 싶은 섹션을 클릭하여 시작하세요.
          </div>
        </div>
      </div>
    `;
  }

  // 하이브리드 모드용 간소화된 콘텐츠 생성
  createHybridToolContent(sectionId) {
    switch (sectionId) {
      case 'business-context':
        return `
          <div class="form-group">
            <label class="form-label">프로젝트 목표</label>
            <select class="form-select">
              <option>신제품 출시</option>
              <option>시장 확장</option>
              <option>성과 최적화</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">제품명</label>
            <input type="text" class="form-input" placeholder="제품명 입력">
          </div>
          <p class="help-text">
            왼쪽 가이드를 참고하여 단계별로 작업을 진행하세요.
          </p>
        `;
        
      case 'data-integration':
        return `
          <div class="status-indicator success">✅ 3개 데이터 소스 연결됨</div>
          <div class="data-sources">
            <div class="source-item">CRM 데이터: 연결됨</div>
            <div class="source-item">매출 데이터: 연결됨</div>
            <div class="source-item">시장 데이터: 연결됨</div>
          </div>
          <div class="metric-card primary mini">
            <div class="metric-value">87%</div>
            <div class="metric-label">데이터 신뢰도</div>
          </div>
        `;
        
      case 'persona-modeling':
        return `
          <div class="persona-summary">
            <div class="persona-item">
              <div class="persona-avatar mini">A</div>
              <div class="persona-info mini">
                <span class="persona-name">액티브 프로페셔널</span>
                <span class="persona-stats">34% • 높은 구매력</span>
              </div>
            </div>
            <div class="persona-item">
              <div class="persona-avatar mini secondary">B</div>
              <div class="persona-info mini">
                <span class="persona-name">디지털 네이티브</span>
                <span class="persona-stats">26% • 높은 디지털 활용도</span>
              </div>
            </div>
          </div>
        `;
        
      case 'market-intelligence':
        return `
          <div class="metrics-mini">
            <div class="metric-mini">
              <div class="metric-value">12</div>
              <div class="metric-label">주요 경쟁사</div>
            </div>
            <div class="metric-mini">
              <div class="metric-value">₩2.3조</div>
              <div class="metric-label">시장 규모</div>
            </div>
          </div>
          <div class="positioning-summary">
            <div class="positioning-title">경쟁 포지셔닝</div>
            <div class="positioning-desc">중급 시장 포지션</div>
          </div>
        `;
        
      case 'strategy-simulation':
        return `
          <div class="recommended-strategy">
            <div class="strategy-title">추천 전략</div>
            <div class="strategy-name">니치 전략</div>
            <div class="strategy-roi">ROI 예측: 31%</div>
          </div>
          <div class="budget-info">
            <div class="budget-title">마케팅 예산</div>
            <div class="budget-amount">월 500만원 권장</div>
          </div>
        `;
        
      case 'insights-dashboard':
        return `
          <div class="insights-mini">
            <div class="insight-mini success">
              <div class="insight-value">+32%</div>
              <div class="insight-label">수익 증가 예상</div>
            </div>
            <div class="insight-mini primary">
              <div class="insight-value">87%</div>
              <div class="insight-label">타겟 정확도</div>
            </div>
          </div>
          <div class="key-insight">
            <div class="insight-title">핵심 인사이트</div>
            <div class="insight-desc">액티브 프로페셔널 집중 공략 권장</div>
          </div>
        `;
        
      case 'performance-tracking':
        return `
          <div class="performance-mini">
            <div class="perf-metric">
              <div class="perf-value">94%</div>
              <div class="perf-label">목표 달성률</div>
            </div>
            <div class="perf-metric">
              <div class="perf-value">2.8</div>
              <div class="perf-label">평균 CPA</div>
            </div>
          </div>
          <div class="monitoring-status">
            <div class="status-title">실시간 모니터링</div>
            <div class="status-desc">모든 지표 정상 범위</div>
          </div>
        `;
        
      default:
        return `<p class="help-text">왼쪽 가이드를 참고하여 작업하세요.</p>`;
    }
  }

  // 사이드바 콘텐츠 생성
  createSidebarContent() {
    const analysisSection = SECTIONS.slice(0, 4).map(sectionId => {
      const meta = SECTION_META[sectionId];
      return `
        <div class="sidebar-item" data-section="${sectionId}">
          <span class="icon">${meta.icon}</span>
          <span class="text">${meta.title}</span>
        </div>
      `;
    }).join('');

    const strategySection = SECTIONS.slice(4).map(sectionId => {
      const meta = SECTION_META[sectionId];
      return `
        <div class="sidebar-item" data-section="${sectionId}">
          <span class="icon">${meta.icon}</span>
          <span class="text">${meta.title}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="sidebar-section">
        <h3>📊 분석 단계</h3>
        ${analysisSection}
      </div>
      
      <div class="sidebar-section">
        <h3>🚀 전략 수립</h3>
        ${strategySection}
      </div>

      <div class="progress-indicator">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 45%"></div>
        </div>
        <div class="progress-text">
          <span>전체 진행률</span>
          <span class="progress-percentage">45%</span>
        </div>
      </div>

      <div class="quick-actions">
        <button class="quick-action-btn" onclick="appState.reset()">
          <span class="icon">🔄</span>
          <span>처음부터 시작</span>
        </button>
        <button class="quick-action-btn" onclick="appState.autoSave()">
          <span class="icon">💾</span>
          <span>수동 저장</span>
        </button>
      </div>
    `;
  }

  // 워크플로우 가이드 콘텐츠 생성
  createWorkflowGuideContent() {
    return `
      <div class="guide-hero">
        <h2>📚 워크플로우 가이드</h2>
        <p>체계적인 페르소나 전략 수립을 위한 단계별 가이드</p>
      </div>
      
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-icon">🎯</div>
          <h3>1. 프로젝트 설정</h3>
          <ul>
            <li>비즈니스 목표 설정</li>
            <li>타겟 시장 정의</li>
            <li>데이터 소스 연결</li>
            <li>성공 지표 정의</li>
          </ul>
        </div>
        
        <div class="guide-step">
          <div class="step-icon">📊</div>
          <h3>2. 데이터 분석</h3>
          <ul>
            <li>AI 기반 페르소나 모델링</li>
            <li>시장 인텔리전스</li>
            <li>경쟁사 분석</li>
            <li>타겟 검증</li>
          </ul>
        </div>
        
        <div class="guide-step">
          <div class="step-icon">🚀</div>
          <h3>3. 전략 수립</h3>
          <ul>
            <li>전략 시뮬레이션</li>
            <li>실행 계획 수립</li>
            <li>성과 관리</li>
            <li>지속적 개선</li>
          </ul>
        </div>
      </div>
      
      <div class="guide-cta">
        <button class="btn btn-primary" onclick="switchMode('tool')">
          🔧 작업 도구로 이동
        </button>
      </div>
    `;
  }

  // 섹션 업데이트 - 🔧 문제 해결!
  updateSection(sectionId) {
    this.currentSection = sectionId;
    
    // 메인 콘텐츠 업데이트
    const mainContent = DOM.$('#current-section-content');
    if (mainContent) {
      mainContent.innerHTML = this.createSectionContent(sectionId);
      DOM.fadeIn(mainContent);
    }

    // 하이브리드 모드 콘텐츠 업데이트
    const hybridContent = DOM.$('#hybrid-tool-content');
    if (hybridContent) {
      hybridContent.innerHTML = this.createHybridToolContent(sectionId);
    }

    // 🔧 문제 해결: DOM.$ 함수가 배열을 반환하므로 forEach 사용 가능
    // 사이드바 활성 상태 업데이트
    const sidebarItems = DOM.$('.sidebar-item');
    sidebarItems.forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = DOM.$(`[data-section="${sectionId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }

    // 폼 데이터 복원
    this.restoreFormData(sectionId);
  }

  // 폼 데이터 복원
  restoreFormData(sectionId) {
    const formData = appState.getFormData(sectionId);
    if (!formData) return;

    Object.entries(formData).forEach(([field, value]) => {
      const element = DOM.$(`[data-field="${field}"]`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    });
  }

  // 다음 섹션으로 이동
  nextSection() {
    const nextSection = appState.nextSection();
    if (nextSection) {
      this.updateSection(nextSection);
      return true;
    } else {
      // 마지막 섹션일 경우
      this.showCompletionMessage();
      return false;
    }
  }

  // 완료 메시지 표시
  showCompletionMessage() {
    const message = `
      🎉 모든 단계를 완료했습니다!
      
      성과 추적을 통해 지속적으로 최적화하세요.
      프로젝트 관리 페이지에서 결과를 확인할 수 있습니다.
    `;
    alert(message);
  }

  // 캐시 초기화
  clearCache() {
    this.contentCache.clear();
  }
}

// 전역 섹션 매니저 인스턴스
const sectionManager = new SectionManager();