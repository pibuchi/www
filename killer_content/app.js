// ===== 트렌드 데이터는 data.js에서 가져옴 =====

// ===== 기본 렌더링 =====
// 페이지 로드 시 모든 차트 렌더링
(function(){
  // 현재 페이지 확인
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'item-selection.html') {
    // 아이템 선정 페이지인 경우
    initializeItemSelectionPage();
  } else {
    // 메인 페이지인 경우
    initializeMainPage();
  }
})();

// 메인 페이지 초기화
function initializeMainPage() {
  // 저장된 아이템 데이터 불러오기
  loadSelectedItemData();
  
  // 메뉴 네비게이션 초기화
  initializeNavigation();
  
  // 진행단계 트래커 초기화
  initializeProgressTracker();
  
  // 트렌드 차트 - 누적 막대형 + 총합 추이 라인
  const labels = ['1사분기', '2사분기', '3사분기', '4사분기'];
  
  // 각 카테고리별 데이터 (이미지와 동일한 값)
  const datasets = [
    { label: 'AI카메라', data: [15, 20, 17, 22], color: '#7c5cff' },
    { label: '폴더블UX', data: [25, 21, 22, 25], color: '#ffd166' },
    { label: '친환경소재', data: [22, 22, 25, 35], color: '#36d399' },
    { label: '카메라모듈디자인', data: [0, 23, 16, 10], color: '#2dd4bf' }
  ];
  
  // 총합 데이터 계산
  const totalData = labels.map((_, i) => 
    datasets.reduce((sum, dataset) => sum + (dataset.data[i] || 0), 0)
  );
  
  // 누적 막대형 + 총합 추이 라인 차트 그리기
  drawStackedBarWithLineChart('trendChart', labels, datasets, totalData, '#ff6b6b');
  
  // 범례 생성
  const legend = document.getElementById('trendLegend');
  if (legend) {
    legend.innerHTML = datasets.map(ds=>`<button class="button" data-key="${ds.label}" style="min-height:auto;min-width:auto;padding:6px 10px"><span class='dot' style='background:${ds.color}'></span>${ds.label}</button>`).join('');
    legend.querySelectorAll('button').forEach(btn=>btn.addEventListener('click', (e)=> showTrendDetail(e.currentTarget.dataset.key)));
  }
  
  const trendDetailPremiumClose = document.getElementById('trendDetailPremiumClose');
  if (trendDetailPremiumClose) {
    trendDetailPremiumClose.addEventListener('click', ()=> document.getElementById('trendDetailPremium').classList.add('hidden'));
  }
  
  // 선도기업 렌더링
  const list = document.getElementById('brandList');
  if (list && typeof brands !== 'undefined') {
    brands.forEach(b=>{ 
      const el=document.createElement('div'); 
      el.className='brand'; 
      el.innerHTML=`<img src='${b.img}' alt='${b.name}'/><div class='meta'><strong>${b.name}</strong><small>${b.product}</small><small style='color:#bdbde0'>CMF: ${b.cmf}</small><small style='color:#a5f3d2'>USP: ${b.usp}</small></div>`; 
      list.appendChild(el); 
    });
  }
  
  // 산업규모 차트 - 약간의 지연 후 렌더링하여 레이아웃 안정화
  setTimeout(() => {
    if (typeof updateMarketChart === 'function') {
      updateMarketChart(); // 기본적으로 국내 시장 차트 표시
    }
  }, 100);
  
  // 지역별 성장률 차트 렌더링
  setTimeout(() => {
    if (typeof drawRegionalChart === 'function') {
      drawRegionalChart('regionalChart', regionalGrowthData.labels, regionalGrowthData.values, regionalGrowthData.colors, '%');
    }
  }, 150);
  
  // 페르소나 차트 - 추가 지연으로 레이아웃 완전 안정화
  setTimeout(() => {
    if (typeof updatePersona === 'function') {
      updatePersona('P1'); // P1을 기본값으로 설정
    }
  }, 200);
}

// 아이템 선정 페이지 초기화
function initializeItemSelectionPage() {
  // 아이템 & 페르소나 선정 초기화
  initializeItemAndPersonaSelection();
  
  // 버튼 이벤트 초기화
  initializeSelectionButtons();
  
  // 요약 정보 업데이트
  updateSelectionSummary();
  
  // 메뉴 네비게이션 초기화 (아이템 선정 페이지용)
  initializeItemSelectionNavigation();
}

// ===== 아이템 & 페르소나 선정 =====
function initializeItemAndPersonaSelection() {
  // 아이템 선택 이벤트
  const itemOptions = document.querySelectorAll('.item-option');
  itemOptions.forEach(option => {
    option.addEventListener('click', function() {
      const selectedItem = this.dataset.item;
      selectItem(selectedItem);
    });
  });
  
  // 페르소나 태그 선택 이벤트
  const personaTags = document.querySelectorAll('.persona-tag');
  personaTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const persona = this.dataset.persona;
      togglePersonaSelection(persona, this);
    });
  });
}

// 아이템 선택
function selectItem(itemType) {
  // 모든 아이템 옵션에서 선택 상태 제거
  document.querySelectorAll('.item-option').forEach(option => {
    option.style.borderColor = 'var(--border)';
    option.style.background = 'var(--card2)';
  });
  
  // 선택된 아이템 강조
  const selectedOption = document.querySelector(`[data-item="${itemType}"]`);
  if (selectedOption) {
    selectedOption.style.borderColor = 'var(--accent)';
    selectedOption.style.background = 'rgba(124, 92, 255, 0.1)';
  }
  
  // 아이템 정보 업데이트
  updateItemInfo(itemType);
  
  // 다음 단계 활성화
  enableNextStep();
}

// 아이템 정보 업데이트
function updateItemInfo(itemType) {
  const itemNames = {
    'smartphone': '스마트폰',
    'laptop': '노트북',
    'tablet': '태블릿',
    'headphone': '헤드폰',
    'smartwatch': '스마트워치',
    'camera': '카메라'
  };
  
  const itemDescriptions = {
    'smartphone': '모바일 통신 및 컴퓨팅 디바이스',
    'laptop': '휴대용 컴퓨터 및 업무 도구',
    'tablet': '태블릿 컴퓨터 및 미디어 디바이스',
    'headphone': '음향 출력 및 통신 디바이스',
    'smartwatch': '웨어러블 스마트 디바이스',
    'camera': '이미지 촬영 및 영상 제작 도구'
  };
  
  const itemIcons = {
    'smartphone': '📱',
    'laptop': '💻',
    'tablet': '📱',
    'headphone': '🎧',
    'smartwatch': '⌚',
    'camera': '📷'
  };
  
  // 아이템 정보 업데이트
  const itemIcon = document.querySelector('.item-icon');
  const itemTitle = document.querySelector('.item-info h3');
  const itemDesc = document.querySelector('.item-info p');
  
  if (itemIcon && itemTitle && itemDesc) {
    itemIcon.textContent = itemIcons[itemType];
    itemTitle.textContent = itemNames[itemType];
    itemDesc.textContent = itemDescriptions[itemType];
  }
}

// 페르소나 선택 토글
function togglePersonaSelection(persona, element) {
  if (element.classList.contains('selected')) {
    element.classList.remove('selected');
  } else {
    element.classList.add('selected');
  }
  
  // 다음 단계 활성화 확인
  checkPersonaSelection();
}

// 페르소나 선택 상태 확인
function checkPersonaSelection() {
  const selectedPersonas = document.querySelectorAll('.persona-tag.selected');
  
  if (selectedPersonas.length > 0) {
    // 다음 단계 활성화
    enableNextStep();
  } else {
    // 다음 단계 비활성화
    disableNextStep();
  }
}

// 다음 단계 활성화
function enableNextStep() {
  // 사이드바 메뉴에서 다음 단계 활성화
  const nextStepItems = document.querySelectorAll('.nav-item[data-section="trend-analysis"], .nav-item[data-section="brand-analysis"], .nav-item[data-section="market-analysis"]');
  nextStepItems.forEach(item => {
    item.classList.remove('locked');
    item.classList.add('next');
  });
  
  // 진행률 업데이트
  updateProgressBar('item-selection');
}

// 다음 단계 비활성화
function disableNextStep() {
  // 사이드바 메뉴에서 다음 단계 비활성화
  const nextStepItems = document.querySelectorAll('.nav-item[data-section="trend-analysis"], .nav-item[data-section="brand-analysis"], .nav-item[data-section="market-analysis"]');
  nextStepItems.forEach(item => {
    item.classList.remove('next');
    item.classList.add('locked');
  });
}

// ===== 아이템 선정 페이지 전용 기능 =====
function initializeSelectionButtons() {
  // 초기화 버튼
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', resetSelection);
  }
  
  // 선정 완료 버튼
  const btnConfirm = document.getElementById('btnConfirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', confirmSelection);
  }
  
  // 뒤로 가기 버튼
  const btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', goBack);
  }
  
  // 분석 시작하기 버튼
  const btnStartAnalysis = document.getElementById('btnStartAnalysis');
  if (btnStartAnalysis) {
    btnStartAnalysis.addEventListener('click', startAnalysis);
  }
}

// 선택 초기화
function resetSelection() {
  // 아이템 선택 초기화
  document.querySelectorAll('.item-option').forEach(option => {
    option.classList.remove('selected');
    option.style.borderColor = 'var(--border)';
    option.style.background = 'var(--card2)';
  });
  
  // 스마트폰을 기본값으로 설정
  const smartphoneOption = document.querySelector('[data-item="smartphone"]');
  if (smartphoneOption) {
    smartphoneOption.classList.add('selected');
    smartphoneOption.style.borderColor = 'var(--accent)';
    smartphoneOption.style.background = 'rgba(124, 92, 255, 0.1)';
  }
  
  // 아이템 정보 초기화
  updateItemInfo('smartphone');
  
  // 페르소나 선택 초기화
  document.querySelectorAll('.persona-tag').forEach(tag => {
    tag.classList.remove('selected');
  });
  
  // 모든 페르소나 선택
  document.querySelectorAll('.persona-tag').forEach(tag => {
    tag.classList.add('selected');
  });
  
  // 요약 정보 업데이트
  updateSelectionSummary();
  
  // 선정 완료 버튼 비활성화
  const btnConfirm = document.getElementById('btnConfirm');
  if (btnConfirm) {
    btnConfirm.disabled = true;
  }
}

// 선정 완료
function confirmSelection() {
  // 선택된 아이템과 페르소나 확인
  const selectedItem = document.querySelector('.item-option.selected');
  const selectedPersonas = document.querySelectorAll('.persona-tag.selected');
  
  if (selectedItem && selectedPersonas.length > 0) {
    // 로컬 스토리지에 선택 정보 저장
    const selectionData = {
      item: selectedItem.dataset.item,
      itemName: selectedItem.textContent.trim(),
      personas: Array.from(selectedPersonas).map(tag => tag.dataset.persona),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('itemPersonaSelection', JSON.stringify(selectionData));
    
    // 성공 메시지 표시
    showSuccessMessage('선정이 완료되었습니다!');
    
    // 분석 시작하기 버튼 활성화
    const btnStartAnalysis = document.getElementById('btnStartAnalysis');
    if (btnStartAnalysis) {
      btnStartAnalysis.disabled = false;
    }
  }
}

// 뒤로 가기
function goBack() {
  window.history.back();
}

// 분석 시작
function startAnalysis() {
  // 선택된 아이템과 페르소나 정보를 localStorage에 저장
  const selectedItem = document.querySelector('.item-option.selected');
  const selectedPersonas = document.querySelectorAll('.persona-tag.selected');
  
  if (selectedItem && selectedPersonas.length > 0) {
    const itemData = {
      name: selectedItem.textContent.trim(),
      personas: Array.from(selectedPersonas).map(tag => tag.textContent.trim())
    };
    
    // localStorage에 저장
    localStorage.setItem('selectedItemData', JSON.stringify(itemData));
    
    // 성공 메시지 표시
    showSuccessMessage('아이템 및 타겟 선정이 완료되었습니다!');
    
    // 잠시 후 메인 페이지로 이동
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    alert('아이템과 타겟 페르소나를 모두 선택해주세요.');
  }
}

// 저장된 아이템 데이터 불러오기
function loadSelectedItemData() {
  const savedData = localStorage.getItem('selectedItemData');
  
  if (savedData) {
    try {
      const itemData = JSON.parse(savedData);
      
      // 리포트 제목 업데이트
      const reportTitle = document.getElementById('reportTitle');
      if (reportTitle) {
        reportTitle.textContent = `2025 ${itemData.name} 디자인전략 인사이트 리포트`;
      }
      
      // 리포트 부제목 업데이트
      const reportSubtitle = document.getElementById('reportSubtitle');
      if (reportSubtitle) {
        const personaNames = itemData.personas.join(' · ');
        reportSubtitle.textContent = `트렌드 · 선도기업 · 산업규모 · ${personaNames} 페르소나 해석 (Infographic) — 데이터 기준: 2023Q1–2025Q2`;
      }
      
      // 사이드바 메뉴 상태 업데이트
      updateSidebarMenuStates();
      
    } catch (error) {
      console.error('저장된 아이템 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
  }
}

// 요약 정보 업데이트
function updateSelectionSummary() {
  const selectedItem = document.querySelector('.item-option.selected');
  const selectedPersonas = document.querySelectorAll('.persona-tag.selected');
  
  if (selectedItem && selectedPersonas.length > 0) {
    const itemName = selectedItem.textContent.trim();
    const personaNames = Array.from(selectedPersonas).map(tag => tag.textContent.trim());
    
    // 요약 정보 업데이트
    const summaryItem = document.getElementById('summaryItem');
    const summaryPersonas = document.getElementById('summaryPersonas');
    const summaryScope = document.getElementById('summaryScope');
    
    if (summaryItem) summaryItem.textContent = itemName;
    if (summaryPersonas) summaryPersonas.textContent = personaNames.join(', ');
    
    if (summaryScope) {
      const scopeText = `${itemName} 시장의 ${personaNames.join(', ')} 소비자 분석`;
      summaryScope.textContent = scopeText;
    }
    
    // 선정 완료 버튼 활성화
    const btnConfirm = document.getElementById('btnConfirm');
    if (btnConfirm) {
      btnConfirm.disabled = false;
    }
  }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
  // 간단한 토스트 메시지 생성
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--accent);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // 3초 후 제거
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 아이템 선정 페이지 전용 네비게이션
function initializeItemSelectionNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 잠긴 단계는 클릭 불가
      if (this.classList.contains('locked')) {
        return;
      }
      
      // 외부 링크인지 확인
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#')) {
        // 외부 링크인 경우 해당 페이지로 이동
        window.location.href = href;
        return;
      }
      
      // 모든 메뉴 아이템에서 active 클래스 제거
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // 클릭된 메뉴 아이템에 active 클래스 추가
      this.classList.add('active');
      
      // 해당 섹션으로 스크롤 (아이템 선정 페이지에서는 내부 섹션이 없으므로 생략)
      const targetSection = this.getAttribute('data-section');
      if (targetSection && targetSection !== 'item-selection') {
        scrollToSection(targetSection);
      }
    });
  });
}

// ===== 메뉴 네비게이션 =====
function initializeNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 잠긴 단계는 클릭 불가
      if (this.classList.contains('locked')) {
        return;
      }
      
      // 외부 링크인지 확인
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#')) {
        // 외부 링크인 경우 해당 페이지로 이동
        window.location.href = href;
        return;
      }
      
      // 모든 메뉴 아이템에서 active 클래스 제거
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // 클릭된 메뉴 아이템에 active 클래스 추가
      this.classList.add('active');
      
      // 해당 섹션으로 스크롤
      const targetSection = this.getAttribute('data-section');
      scrollToSection(targetSection);
    });
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// ===== 진행단계 트래커 =====
function initializeProgressTracker() {
  const steps = document.querySelectorAll('.step');
  
  // 현재 진행단계 설정 (기본값: 리서치 단계)
  setCurrentStep('research');
  
  // 진행단계 클릭 이벤트 (선택사항)
  steps.forEach(step => {
    step.addEventListener('click', function() {
      const stepId = this.getAttribute('data-step');
      showStepInfo(stepId);
    });
  });
}

function setCurrentStep(stepId) {
  const steps = document.querySelectorAll('.step');
  
  steps.forEach(step => {
    const currentStepId = step.getAttribute('data-step');
    
    // 모든 단계를 기본 상태로 리셋
    step.classList.remove('completed', 'active');
    
    // 완료된 단계 설정
    if (isStepCompleted(currentStepId, stepId)) {
      step.classList.add('completed');
    }
    
    // 현재 활성 단계 설정
    if (currentStepId === stepId) {
      step.classList.add('active');
    }
  });
  
  // 진행률 업데이트
  updateProgressBar(stepId);
  updateSidebarProgress(stepId);
}

function isStepCompleted(stepId, currentStepId) {
  const stepOrder = ['research', 'ideation', 'evaluation-feedback'];
  const stepIndex = stepOrder.indexOf(stepId);
  const currentIndex = stepOrder.indexOf(currentStepId);
  
  return stepIndex < currentIndex;
}

function updateProgressBar(currentStepId) {
  const stepOrder = ['research', 'ideation', 'evaluation-feedback'];
  const currentIndex = stepOrder.indexOf(currentStepId);
  const progressPercentage = ((currentIndex + 1) / stepOrder.length) * 100;
  
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`;
  }
  
  const progressText = document.querySelector('.progress-text');
  if (progressText) {
    progressText.textContent = `${currentIndex + 1}/3 단계 완료`;
  }
}

function updateSidebarProgress(currentStepId) {
  const stepOrder = ['research', 'ideation', 'evaluation-feedback'];
  const currentIndex = stepOrder.indexOf(currentStepId);
  
  // 사이드바 메뉴 상태 업데이트
  updateSidebarMenuStates(currentIndex);
}

function updateSidebarMenuStates(currentIndex) {
  // 현재 단계에 따른 메뉴 상태 업데이트
  const menuItems = document.querySelectorAll('.nav-item');
  
  menuItems.forEach(item => {
    const section = item.getAttribute('data-section');
    const sectionIndex = getSectionIndex(section);
    
    // 기존 클래스 제거
    item.classList.remove('active', 'current', 'next', 'locked');
    
    if (sectionIndex < currentIndex) {
      item.classList.add('active'); // 완료된 단계
    } else if (sectionIndex === currentIndex) {
      item.classList.add('current'); // 현재 단계
    } else if (sectionIndex === currentIndex + 1) {
      item.classList.add('next'); // 다음 단계
    } else {
      item.classList.add('locked'); // 잠긴 단계
    }
  });
}

function getSectionIndex(section) {
  const sectionOrder = {
    'item-selection': 0,
    'trend-analysis': 0,
    'brand-analysis': 0,
    'market-analysis': 0,
    'ideation': 1,
    'concept-development': 2,
    'evaluation-feedback': 2
  };
  
  return sectionOrder[section] || 0;
}

function showStepInfo(stepId) {
  const stepInfo = {
    'research': '시장 조사 및 데이터 수집 단계',
    'insight': '데이터 분석을 통한 인사이트 도출',
    'ideation': '페르소나 기반 아이디어 생성',
    'concept': '구체적인 컨셉 및 전략 개발',
    'marketing': '마케팅 전략 및 메시지 개발',
    'design': '디자인 및 프로토타입 제작',
    'evaluation': '사용자 피드백 및 최종 평가'
  };
  
  // 간단한 알림으로 단계 정보 표시 (실제로는 모달이나 툴팁으로 구현 가능)
  console.log(`${stepId}: ${stepInfo[stepId]}`);
}

// ===== 단계 진행 및 가이드 =====
function progressToNextStep() {
  const currentStep = document.querySelector('.step.active');
  const currentStepId = currentStep.getAttribute('data-step');
  
  const stepOrder = ['research', 'insight', 'ideation', 'concept', 'marketing', 'design', 'evaluation'];
  const currentIndex = stepOrder.indexOf(currentStepId);
  
  if (currentIndex < stepOrder.length - 1) {
    const nextStepId = stepOrder[currentIndex + 1];
    setCurrentStep(nextStepId);
    
    // 진행 가이드 업데이트
    updateProgressGuidance(nextStepId);
    
    // 성공 메시지
    showProgressMessage(`🎉 ${getStepName(currentStepId)} 단계를 완료했습니다!`);
  }
}

function updateProgressGuidance(stepId) {
  // 진행 가이드가 제거되어 이 함수는 더 이상 필요하지 않음
  console.log(`진행 단계: ${stepId}`);
}

function getStepName(stepId) {
  const stepNames = {
    'research': '리서치',
    'insight': '인사이트',
    'ideation': '아이데이션',
    'concept': '컨셉 개발',
    'marketing': '마케팅',
    'design': '디자인',
    'evaluation': '평가'
  };
  
  return stepNames[stepId] || stepId;
}

function showProgressMessage(message) {
  // 간단한 알림 메시지 (실제로는 토스트나 모달로 구현 가능)
  console.log(message);
  
  // 임시로 alert 사용 (실제 구현에서는 더 세련된 UI 사용)
  setTimeout(() => {
    alert(message);
  }, 100);
}

function showIdeationTools() {
  // 아이데이션 도구 열기 (실제 구현에서는 해당 섹션으로 이동하거나 도구 패널 열기)
  console.log('아이데이션 도구를 엽니다...');
  
  // 예시: 아이데이션 섹션으로 스크롤
  const ideationSection = document.getElementById('ideation');
  if (ideationSection) {
    ideationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showStepTutorial(stepId) {
  // 단계별 가이드 표시 (실제 구현에서는 튜토리얼 모달이나 가이드 패널 열기)
  const tutorials = {
    'ideation': '아이데이션 단계에서는 페르소나 분석 결과를 바탕으로 창의적인 아이디어를 생성합니다. 트렌드 분석과 브랜드 분석 결과를 참고하여 차별화된 컨셉을 개발하세요.',
    'concept': '컨셉 개발 단계에서는 아이데이션을 구체화하고 실현 가능한 전략으로 발전시킵니다.',
    'marketing': '마케팅 단계에서는 개발된 컨셉을 효과적으로 전달할 수 있는 전략을 수립합니다.'
  };
  
  const tutorial = tutorials[stepId] || '해당 단계에 대한 가이드가 준비 중입니다.';
  
  // 간단한 알림으로 가이드 표시 (실제로는 모달이나 사이드 패널로 구현)
  alert(`📚 ${getStepName(stepId)} 단계 가이드\n\n${tutorial}`);
}

// ===== 프리미엄 시스템 =====
let isPremiumUser = false; // 프리미엄 사용자 여부 (기본값을 false로 변경)
let trendPersona='ALL', trendOnlyFav=false, trendHotOnly=false;

// 프리미엄 필요 시 팝업 표시
function showPremiumRequired(feature){
  showPremiumPopup();
}

// 데이터가공정보 팝업 표시
function showDataInfoPopup(){
  const popup = document.getElementById('dataInfoPopup');
  if(popup) {
    popup.classList.remove('hidden');
    popup.style.display = 'flex';
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    document.body.style.overflow = 'hidden';
  }
}

// 데이터가공정보 팝업 숨기기
function hideDataInfoPopup(){
  const popup = document.getElementById('dataInfoPopup');
  if(popup) {
    popup.classList.add('hidden');
    popup.style.display = 'none';
    popup.style.visibility = 'hidden';
    popup.style.opacity = '0';
    document.body.style.overflow = '';
  }
}

// 프리미엄 팝업 표시
function showPremiumPopup(){
  const popup = document.getElementById('premiumPopup');
  if(popup) {
    popup.classList.remove('hidden');
    popup.style.display = 'flex'; // 인라인 스타일 제거하고 flex로 설정
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  }
}

// 프리미엄 팝업 숨기기
function hidePremiumPopup(){
  const popup = document.getElementById('premiumPopup');
  if(popup) {
    popup.classList.add('hidden');
    popup.style.display = 'none'; // 강제로 숨기기
    popup.style.visibility = 'hidden';
    popup.style.opacity = '0';
    document.body.style.overflow = '';
  }
}

// 프리미엄 구독 처리
function handlePremiumUpgrade(plan){
  console.log(`프리미엄 ${plan} 플랜 구독 처리`);
  
  // 실제 구현에서는 결제 처리 로직이 들어갑니다
  // 여기서는 데모용으로 바로 프리미엄 사용자로 변경
  isPremiumUser = true;
  
  // 팝업 숨기기
  hidePremiumPopup();
  
  // 성공 메시지 (선택사항)
  alert('프리미엄 구독이 완료되었습니다! 🎉');
}

// ===== 고급 분석 기능 렌더링 =====
function buildTrend(range=8){
  const labels = range===12?trendLabels12:trendLabels8;
  
  // 기존 데이터를 누적 막대형 차트용으로 변환
  const base = Object.entries(trendSeries).map(([k,v])=>({ 
    key:k, 
    label:k,
    data: range===12? v.data12 : v.data8, 
    color:v.color 
  }));
  
  let sets = base;
  if(trendHotOnly){
    const withDelta = base.map(s=>({ ...s, delta: s.data[s.data.length-1]-s.data[s.data.length-2]})).sort((a,b)=>b.delta-a.delta).slice(0,2);
    const allow=new Set(withDelta.map(s=>s.key)); 
    sets=base.filter(s=>allow.has(s.key));
  }
  
  const react = personaKeywordReaction[trendPersona] || {};
  const mod = sets.map(s=>{
    const pref = trendPersona==='ALL' ? 1 : (react[s.key]??1);
    const alpha = trendOnlyFav ? (pref>=1?1:0) : (pref===2?1: pref===1?0.7:0.25);
    return { 
      label:s.label, 
      data:s.data, 
      color: hexA(s.color||'#7c5cff', alpha) 
    };
  });
  
  // 총합 데이터 계산
  const totalData = labels.map((_, i) => 
    mod.reduce((sum, dataset) => sum + (dataset.data[i] || 0), 0)
  );
  
  // 누적 막대형 + 총합 추이 라인 차트 그리기
  drawStackedBarWithLineChart('trendChart', labels, mod, totalData, '#ff6b6b', '점수');
  
  const legend = document.getElementById('trendLegend');
  legend.innerHTML = mod.map(ds=>`<button class="button" data-key="${ds.label}" style="min-height:auto;min-width:auto;padding:6px 10px"><span class='dot' style='background:${ds.color}'></span>${ds.label}</button>`).join('');
  legend.querySelectorAll('button').forEach(btn=>btn.addEventListener('click', (e)=> showTrendDetail(e.currentTarget.dataset.key)));
}

// 산업 규모 차트 업데이트
function updateMarketChart(){
  const region = document.getElementById('marketRegion').value;
  const period = document.getElementById('marketPeriod').value;
  
  let labels, values, title;
  
  if(period === '5Y') {
    labels = marketYears;
    if(region === 'GLOBAL') {
      values = globalMarketValues;
      title = '글로벌 스마트폰 시장 규모 (단위: 십억 달러)';
    } else if(region === 'DOMESTIC') {
      values = domesticMarketValues;
      title = '국내 스마트폰 시장 규모 (단위: 조원)';
    }
  } else if(period === '3Y') {
    labels = ['2023', '2024E', '2025E'];
    if(region === 'GLOBAL') {
      values = globalMarketValues.slice(2);
      title = '글로벌 스마트폰 시장 규모 (단위: 십억 달러)';
    } else if(region === 'DOMESTIC') {
      values = domesticMarketValues.slice(2);
      title = '국내 스마트폰 시장 규모 (단위: 조원)';
    }
  } else {
    labels = ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2'];
    if(region === 'GLOBAL') {
      values = [130, 135, 140, 145, 150, 155];
      title = '글로벌 스마트폰 시장 규모 (단위: 십억 달러)';
    } else if(region === 'DOMESTIC') {
      values = [7.2, 7.4, 7.6, 7.8, 8.0, 8.2];
      title = '국내 스마트폰 시장 규모 (단위: 조원)';
    }
  }
  
  // 차트 제목 추가
  const chartContainer = document.getElementById('marketChart');
  if(chartContainer) {
    chartContainer.innerHTML = '';
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'text-align:center;margin-bottom:10px;font-size:14px;color:var(--muted);';
    titleDiv.textContent = title;
    chartContainer.appendChild(titleDiv);
    
    // 차트를 직접 marketChart 컨테이너에 그리기
    const unit = region === 'GLOBAL' ? '십억 달러' : '조원';
    drawBarChart('marketChart', labels, values, '#7c5cff', unit);
  }
}

function renderBrands(){
  const list = document.getElementById('brandList'); list.innerHTML='';
  const persona = document.getElementById('brandPersonaFilter').value;
  const onlyFav = document.getElementById('brandOnlyFav').checked;
  const react = persona==='ALL'? null : personaBrandReaction[persona];
  const filtered = (onlyFav && react) ? brands.filter(b=> (react[b.id]??1) >= 2) : brands.slice();
  filtered.forEach(b=>{
    const sentiment = react? (react[b.id]??1) : 1;
    const wrap = document.createElement('div'); wrap.className='brand'+(sentiment===0?' dim':'');
    const badge = sentiment===2?'<span class="sent-badge sent-pos">선호</span>': sentiment===1?'<span class="sent-badge sent-mid">보통</span>':'<span class="sent-badge sent-neg">비선호</span>';
    wrap.innerHTML = `<img src="${b.img}" alt="${b.name}" />
      <div class="meta">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${b.name}</strong>${react?badge:''}
        </div>
        <small>${b.product}</small>
        <small style="color:#bdbde0">CMF: ${b.cmf}</small>
        <small style="color:#a5f3d2">USP: ${b.usp}</small>
      </div>`;
    
    // 브랜드 클릭 이벤트 추가
    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', function() {
      showBrandPersonaReactions(b.name);
    });
    
    list.appendChild(wrap);
  });
}

// 트렌드 상세 로직
function computeStats(arr){ 
  const n=arr.length; 
  const first=arr[0], last=arr[n-1]; 
  const prev=arr[n-2] ?? last; 
  const delta=last-prev; 
  const pct=prev? (delta/prev*100):0; 
  const cagr=(n>1)? (Math.pow(last/Math.max(1,first), 1/(n-1))-1)*100:0; 
  return {first,last,prev,delta,pct,cagr}; 
}

function rxBadgeFor(persona,key){ 
  const m=personaKeywordReaction[persona]||{}; 
  const v=m[key]; 
  if(v===2) return `<span class='rx pos'>${persona} 선호</span>`; 
  if(v===1) return `<span class='rx mid'>${persona} 보통</span>`; 
  if(v===0) return `<span class='rx neg'>${persona} 비선호</span>`; 
  return ''; 
}

function showTrendDetail(key){
  const range = parseInt(document.getElementById('trendRange').value,10);
  const data = (range===12? trendSeries[key].data12 : trendSeries[key].data8);
  const st = computeStats(data);
  const desc = trendNotes[key] || `${key} 트렌드에 대한 상세입니다.`;
  const metricsHtml = [
    `<span class='metric'>최근값 ${st.last.toFixed(0)}</span>`,
    `<span class='metric'>QoQ ${(st.pct>=0?'+':'')}${st.pct.toFixed(1)}%</span>`,
    `<span class='metric'>CAGR ${(st.cagr>=0?'+':'')}${st.cagr.toFixed(1)}%</span>`,
    `<span class='metric'>구간 ${range}분기</span>`
  ].join('');
  const rxHtml = ['P1','P2','P3'].map(pid=>rxBadgeFor(pid,key)).join('');
  
  // 상세 정보 표시
  document.getElementById('trendDetailPremiumTitle').textContent = `${key} · 상세`;
  document.getElementById('trendDetailPremiumDesc').textContent = desc;
  document.getElementById('trendDetailPremiumMetrics').innerHTML = metricsHtml;
  document.getElementById('trendDetailPremiumRx').innerHTML = rxHtml;
  document.getElementById('trendDetailPremium').classList.remove('hidden');
  
  // 페르소나 반응 정보 표시
  showKeywordPersonaReactions(key);
}

// 통계 계산 함수
function computeStats(data) {
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const first = data[0];
  const pct = ((last - prev) / prev) * 100;
  const cagr = ((last / first) ** (1 / (data.length - 1)) - 1) * 100;
  
  return { last, prev, first, pct, cagr };
}

// 페르소나 반응 배지 생성 함수
function rxBadgeFor(persona, key) {
  // data.js의 personaKeywordReaction 데이터 사용
  const v = personaKeywordReaction[persona]?.[key] ?? 0;
  
  if(v === 2) return `<span class='rx pos'>${persona} 선호</span>`;
  if(v === 1) return `<span class='rx mid'>${persona} 관심</span>`; 
  if(v === 0) return `<span class='rx neg'>${persona} 비선호</span>`; 
  return ''; 
}

// 키워드별 페르소나 반응 정보 표시
function showKeywordPersonaReactions(keyword) {
  const reactionsContainer = document.getElementById('keywordPersonaReactions');
  if (!reactionsContainer) return;
  
  // 선택된 키워드 이름 업데이트
  const selectedKeywordName = document.getElementById('selectedKeywordName');
  if (selectedKeywordName) {
    selectedKeywordName.textContent = keyword;
  }
  
  // P1 반응 정보 업데이트
  updatePersonaReaction('p1', keyword);
  updatePersonaReaction('p2', keyword);
  updatePersonaReaction('p3', keyword);
  
  // 종합 분석 업데이트
  updateReactionsSummary(keyword);
  
  // 반응 정보 섹션 표시
  reactionsContainer.classList.remove('hidden');
}

// 개별 페르소나 반응 정보 업데이트
function updatePersonaReaction(personaId, keyword) {
  const persona = personaId.toUpperCase();
  const reaction = personaKeywordReaction[persona]?.[keyword] ?? 0;
  
  // 반응 점수 업데이트
  const scoreElement = document.getElementById(`${personaId}Score`);
  if (scoreElement) {
    scoreElement.textContent = reaction === 2 ? '높음' : reaction === 1 ? '보통' : '낮음';
  }
  
  // 반응 인용구 업데이트
  const quoteElement = document.getElementById(`${personaId}Quote`);
  if (quoteElement) {
    const quotes = {
      P1: {
        2: `${keyword}에 대해 매우 높은 관심을 보입니다. 트렌드에 민감하게 반응하며 적극적으로 탐색합니다.`,
        1: `${keyword}에 대해 관심은 있지만 신중하게 접근합니다. 더 많은 정보를 원합니다.`,
        0: `${keyword}에 대해 낮은 관심을 보입니다. 다른 우선순위가 있습니다.`
      },
      P2: {
        2: `${keyword}에 대해 실용적 관점에서 높은 관심을 보입니다. 효율성과 가성비를 중시합니다.`,
        1: `${keyword}에 대해 보통 수준의 관심을 보입니다. 필요에 따라 고려합니다.`,
        0: `${keyword}에 대해 낮은 관심을 보입니다. 현재 필요성을 느끼지 못합니다.`
      },
      P3: {
        2: `${keyword}에 대해 가치 지향적 관점에서 높은 관심을 보입니다. 지속가능성을 중시합니다.`,
        1: `${keyword}에 대해 보통 수준의 관심을 보입니다. 가치와 실용성을 비교합니다.`,
        0: `${keyword}에 대해 낮은 관심을 보입니다. 다른 가치를 우선시합니다.`
      }
    };
    
    quoteElement.textContent = quotes[persona][reaction] || '반응 데이터가 없습니다.';
  }
  
  // 메트릭 업데이트
  updatePersonaMetrics(personaId, keyword, reaction);
}

// 페르소나별 메트릭 업데이트
function updatePersonaMetrics(personaId, keyword) {
  const persona = personaId.toUpperCase();
  const reaction = personaKeywordReaction[persona]?.[keyword] ?? 0;
  
  // 관심도 (반응 점수 기반)
  const interestElement = document.getElementById(`${personaId}Interest`);
  if (interestElement) {
    const interestValues = ['낮음', '보통', '높음'];
    interestElement.textContent = interestValues[reaction] || '보통';
  }
  
  // 구매의도 (반응 점수 기반)
  const purchaseElement = document.getElementById(`${personaId}Purchase`);
  if (purchaseElement) {
    const purchaseValues = ['낮음', '보통', '높음'];
    purchaseElement.textContent = purchaseValues[reaction] || '보통';
  }
  
  // 추천도 (반응 점수 기반)
  const recommendElement = document.getElementById(`${personaId}Recommend`);
  if (recommendElement) {
    const recommendValues = ['낮음', '보통', '높음'];
    recommendElement.textContent = recommendValues[reaction] || '보통';
  }
}

// 종합 분석 업데이트
function updateReactionsSummary(keyword) {
  const summaryElement = document.getElementById('reactionsSummary');
  if (!summaryElement) return;
  
  const reactions = ['P1', 'P2', 'P3'].map(pid => ({
    persona: pid,
    reaction: personaKeywordReaction[pid]?.[keyword] ?? 0
  }));
  
  const highInterest = reactions.filter(r => r.reaction === 2);
  const lowInterest = reactions.filter(r => r.reaction === 0);
  
  let summary = '';
  if (highInterest.length > 0) {
    summary += `높은 관심: ${highInterest.map(r => r.persona).join(', ')}`;
  }
  if (lowInterest.length > 0) {
    summary += `낮은 관심: ${lowInterest.map(r => r.persona).join(', ')}`;
  }
  
  if (summary) {
    summaryElement.textContent = `${keyword}에 대한 페르소나별 반응 분석: ${summary}`;
  } else {
    summaryElement.textContent = `${keyword}에 대한 페르소나별 반응이 균등하게 분포되어 있습니다.`;
  }
}

// 고급 기능 사용 시 프리미엄 팝업 표시
function showPremiumRequired(source){
  showPremiumPopup();
}

// 페르소나 업데이트 함수
function updatePersona(personaId) {
  const persona = personaDB[personaId];
  if (!persona) return;
  
  // 페르소나 제목 업데이트
  const personaTitle = document.getElementById('personaTitle');
  if (personaTitle) {
    personaTitle.textContent = `${personaId} · ${persona.name}`;
  }
  
  // 페르소나별 인사이트 업데이트
  updatePersonaInsights(personaId);
  
  // 페르소나 신조어 분석 업데이트
  if (typeof updatePersonaBuzzwords === 'function') {
    updatePersonaBuzzwords(personaId);
  }
}

// 페르소나별 인사이트 업데이트 함수
function updatePersonaInsights(personaId) {
  const insights = {
    P1: {
      trend: "P1은 'AI 카메라', '폴더블 UX'에 높은 반응. '친환경 소재'는 관심은 있으나 가격 민감 시 이탈.",
      brand: "Galaxy Z의 신기능에 FOMO 반응. iPhone의 촬영·편집 워크플로우 선호.",
      strategy: "전략: CMF Satin Glass + 미세 텍스처 메탈 · 메시지 'AI가 사진을 완성한다'."
    },
    P2: {
      trend: "P2는 '실용성'과 '가성비' 중심. 'AI 카메라'보다는 '배터리 수명'과 '내구성'에 집중.",
      brand: "삼성의 One UI와 애플의 iOS 안정성 선호. 브랜드보다는 기능과 품질 중시.",
      strategy: "전략: 실용적 디자인 + 내구성 강화 · 메시지 '오래 사용할 수 있는 스마트폰'."
    },
    P3: {
      trend: "P3는 '친환경 소재'와 '지속가능성'에 높은 관심. '재활용 소재'와 '에너지 효율' 중시.",
      brand: "Fairphone, Teracube 등 친환경 브랜드 선호. 기존 대형 브랜드의 친환경 노력도 인정.",
      strategy: "전략: 친환경 소재 + 모듈형 디자인 · 메시지 '지구를 생각하는 스마트폰'."
    }
  };
  
  const personaInsights = insights[personaId];
  if (personaInsights) {
    const insightTrend = document.getElementById('insightTrend');
    const insightBrand = document.getElementById('insightBrand');
    const insightStrategy = document.getElementById('insightStrategy');
    
    if (insightTrend) insightTrend.textContent = personaInsights.trend;
    if (insightBrand) insightBrand.textContent = personaInsights.brand;
    if (insightStrategy) insightStrategy.innerHTML = `<b>전략:</b> ${personaInsights.strategy}`;
  }
}

// 이벤트 바인딩
function bindEvents(){
  // 데이터가공정보 팝업 버튼
  document.getElementById('btnDataInfo').addEventListener('click', showDataInfoPopup);
  document.getElementById('dataInfoClose').addEventListener('click', hideDataInfoPopup);
  
  // 트렌드 상세 닫기 버튼
  const trendDetailClose = document.getElementById('trendDetailPremiumClose');
  if (trendDetailClose) {
    trendDetailClose.addEventListener('click', () => {
      document.getElementById('trendDetailPremium').classList.add('hidden');
    });
  }
  
  // 브랜드 반응 닫기 버튼
  const closeBrandBtn = document.getElementById('closeBrandReactions');
  if (closeBrandBtn) {
    closeBrandBtn.addEventListener('click', () => {
      document.getElementById('brandPersonaReactions').classList.add('hidden');
    });
  }
  
  // 데이터가공정보 팝업 외부 클릭 시 닫기
  document.getElementById('dataInfoPopup').addEventListener('click', (e)=>{
    if(e.target.id === 'dataInfoPopup') hideDataInfoPopup();
  });
  
  // 프리미엄 팝업 버튼
  document.getElementById('popupClose').addEventListener('click', hidePremiumPopup);
  
  // 프리미엄 팝업 외부 클릭 시 닫기
  document.getElementById('premiumPopup').addEventListener('click', (e)=>{
    if(e.target.id === 'premiumPopup') hidePremiumPopup();
  });
  
  // 프리미엄 업그레이드 버튼들
  document.querySelectorAll('.upgrade-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.target.getAttribute('data-plan');
      handlePremiumUpgrade(plan);
    });
  });
  
  // 트렌드 분석 필터 이벤트
  document.getElementById('trendRange').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('trend');
      return;
    }
    buildTrend(parseInt(e.target.value,10));
  });
  
  document.getElementById('trendPersonaFilter').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('trend');
      return;
    }
    trendPersona = e.target.value; 
    buildTrend(parseInt(document.getElementById('trendRange').value,10));
  });
  
  document.getElementById('trendOnlyFav').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('trend');
      return;
    }
    trendOnlyFav = e.target.checked; 
    buildTrend(parseInt(document.getElementById('trendRange').value,10));
  });
  
  document.getElementById('btnHot').addEventListener('click', ()=>{
    if(!isPremiumUser) {
      showPremiumRequired('trend');
      return;
    }
    trendHotOnly=!trendHotOnly; 
    buildTrend(parseInt(document.getElementById('trendRange').value,10));
  });
  
  document.getElementById('brandPersonaFilter').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('brand');
      return;
    }
    renderBrands();
  });
  
  document.getElementById('brandOnlyFav').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('brand');
      return;
    }
    showPremiumRequired('brand');
    return;
  });
  
  // 산업 규모 옵션 변경 이벤트
  document.getElementById('marketRegion').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('market');
      return;
    }
    updateMarketChart();
  });
  
  document.getElementById('marketPeriod').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('market');
      return;
    }
    updateMarketChart();
  });
  
  // 페르소나 선택 변경 이벤트
  document.getElementById('personaSelect').addEventListener('change', (e)=> {
    if(!isPremiumUser) {
      showPremiumRequired('persona');
      return;
    }
    updatePersona(e.target.value);
  });
}

// 초기화
function init(){
  // 페이지 로드 시 팝업 강제 숨기기 (여러 방법으로)
  hidePremiumPopup();
  hideDataInfoPopup();
  
  // 추가로 CSS 클래스와 인라인 스타일로도 숨기기
  const popup = document.getElementById('premiumPopup');
  if(popup) {
    popup.classList.add('hidden');
    popup.style.display = 'none';
    popup.style.visibility = 'hidden';
    popup.style.opacity = '0';
  }
  
  bindEvents();
  
  // 키워드 반응 정보 닫기 버튼 이벤트 리스너
  const closeReactions = document.getElementById('closeReactions');
  if (closeReactions) {
    closeReactions.addEventListener('click', () => {
      document.getElementById('keywordPersonaReactions').classList.add('hidden');
    });
  }
  
  // 브랜드 반응 정보 닫기 버튼 이벤트 리스너
  const closeBrandReactions = document.getElementById('closeBrandReactions');
  if (closeBrandReactions) {
    closeBrandReactions.addEventListener('click', () => {
      document.getElementById('brandPersonaReactions').classList.add('hidden');
    });
  }
  
  // 약간의 지연 후 한 번 더 확인
  setTimeout(() => {
    hidePremiumPopup();
  }, 100);
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', init);

// 추가로 window load 이벤트에서도 확인
window.addEventListener('load', () => {
  hidePremiumPopup();
});

// ===== 키워드 페르소나 반응 기능 =====
// 키워드별 페르소나 반응 데이터
const keywordPersonaReactions = {
  'AI카메라': {
    P1: {
      score: '매우 높음',
      quote: '"AI 카메라 기능은 정말 혁신적이에요! 사진을 찍을 때마다 AI가 자동으로 최적화해주니까 전문가처럼 찍힌 사진이 나와요. 특히 MZ세대라면 이런 신기술에 민감하게 반응할 거예요."',
      metrics: { interest: '95%', purchase: '88%', recommend: '92%' }
    },
    P2: {
      score: '높음',
      quote: '"AI 카메라는 실용적이에요. 사진 촬영이 어려운 사람도 쉽게 좋은 사진을 찍을 수 있고, 업무용으로도 유용할 것 같아요. 다만 가격이 너무 비싸면 고민할 것 같아요."',
      metrics: { interest: '78%', purchase: '72%', recommend: '85%' }
    },
    P3: {
      score: '보통',
      quote: '"AI 카메라는 흥미롭지만, 친환경적인 면에서는 어떻게 보는지 모르겠어요. AI 연산이 배터리 소모를 증가시킨다면 환경에 부담이 될 수 있어요."',
      metrics: { interest: '65%', purchase: '58%', recommend: '62%' }
    }
  },
  '폴더블UX': {
    P1: {
      score: '매우 높음',
      quote: '"폴더블은 정말 트렌디해요! 작은 화면으로도 큰 화면 경험을 할 수 있고, 멀티태스킹이 훨씬 편해져요. MZ라면 이런 혁신적인 디자인에 열광할 거예요!"',
      metrics: { interest: '92%', purchase: '85%', recommend: '89%' }
    },
    P2: {
      score: '높음',
      quote: '"폴더블은 업무에 정말 유용할 것 같아요. 문서 작업이나 프레젠테이션할 때 큰 화면이 필요할 때가 많은데, 휴대성과 큰 화면을 동시에 가질 수 있어요."',
      metrics: { interest: '82%', purchase: '75%', recommend: '78%' }
    },
    P3: {
      score: '낮음',
      quote: '"폴더블은 기술적으로는 흥미롭지만, 친환경적인 관점에서는 우려가 있어요. 복잡한 기계 구조로 인한 수명 단축과 폐기물 증가가 걱정돼요."',
      metrics: { interest: '45%', purchase: '38%', recommend: '42%' }
    }
  },
  '친환경소재': {
    P1: {
      score: '높음',
      quote: '"친환경 소재는 좋은 트렌드예요! MZ세대라면 환경에 대한 관심이 높으니까 이런 제품을 선호할 거예요. 다만 디자인이나 성능이 떨어지면 고민할 것 같아요."',
      metrics: { interest: '78%', purchase: '72%', recommend: '75%' }
    },
    P2: {
      score: '보통',
      quote: '"친환경 소재는 좋은 아이디어지만, 내구성이나 성능이 기존 소재만큼 좋은지 확인이 필요해요. 실용적인 관점에서 보면 신중하게 접근해야 할 것 같아요."',
      metrics: { interest: '65%', purchase: '58%', recommend: '62%' }
    },
    P3: {
      score: '매우 높음',
      quote: '"친환경 소재는 정말 중요한 가치예요! 지구 환경을 생각하는 소비자라면 이런 제품을 적극적으로 지원해야 해요. 가격이 조금 비싸도 환경을 위해 투자할 가치가 있어요."',
      metrics: { interest: '95%', purchase: '88%', recommend: '92%' }
    }
  },
  '카메라모듈디자인': {
    P1: {
      score: '높음',
      quote: '"카메라 모듈 디자인은 스마트폰의 얼굴이에요! MZ세대라면 디자인에 민감하니까 카메라 모듈의 미적 완성도가 중요할 거예요. 트렌디하고 세련된 디자인이면 더 좋아요."',
      metrics: { interest: '82%', purchase: '75%', recommend: '78%' }
    },
    P2: {
      score: '보통',
      quote: '"카메라 모듈 디자인은 기능보다는 실용성이 중요해요. 카메라 성능이 좋고 사용하기 편하다면 디자인은 크게 신경 쓰지 않을 것 같아요."',
      metrics: { interest: '58%', purchase: '52%', recommend: '55%' }
    },
    P3: {
      score: '높음',
      quote: '"카메라 모듈 디자인은 친환경적인 소재로 만들어졌다면 더 좋을 것 같아요. 플라스틱 대신 재활용 가능한 소재나 생분해성 소재를 사용한다면 환경에 대한 메시지도 전달할 수 있어요."',
      metrics: { interest: '75%', purchase: '68%', recommend: '72%' }
    }
  }
};

// ===== 브랜드별 페르소나 반응 기능 =====
// 브랜드별 페르소나 반응 데이터
const brandPersonaReactions = {
  'Samsung': {
    P1: {
      score: '매우 높음',
      quote: '"삼성은 정말 트렌디해요! 특히 Galaxy Z 시리즈의 폴더블 기술은 MZ세대라면 열광할 만해요. 새로운 기술을 빠르게 적용하는 모습이 인상적이에요."',
      metrics: { awareness: '98%', purchase: '85%', recommend: '88%' }
    },
    P2: {
      score: '높음',
      quote: '"삼성은 업무용으로도 정말 좋아요. 멀티태스킹 기능과 생산성 도구들이 잘 갖춰져 있고, 특히 S Pen은 문서 작업할 때 정말 유용해요."',
      metrics: { awareness: '95%', purchase: '78%', recommend: '82%' }
    },
    P3: {
      score: '높음',
      quote: '"삼성의 친환경 노력이 보여요. 재활용 소재 사용과 에너지 효율성 개선 등 환경을 생각하는 모습이 좋아요. 다만 더 적극적인 친환경 정책을 기대해요."',
      metrics: { awareness: '92%', purchase: '75%', recommend: '78%' }
    }
  },
  'Apple': {
    P1: {
      score: '매우 높음',
      quote: '"애플은 브랜드 가치가 정말 높아요! iPhone의 디자인과 사용자 경험은 MZ세대라면 누구나 선망할 만해요. 특히 카메라 성능과 편집 도구는 최고예요."',
      metrics: { awareness: '99%', purchase: '92%', recommend: '95%' }
    },
    P2: {
      score: '높음',
      quote: '"애플은 업무용으로도 훌륭해요. iCloud 연동과 생산성 앱들이 잘 갖춰져 있고, 특히 보안성과 안정성이 뛰어나서 회사에서도 많이 사용해요."',
      metrics: { awareness: '96%', purchase: '82%', recommend: '85%' }
    },
    P3: {
      score: '보통',
      quote: '"애플은 친환경에 대한 약속을 하고 있지만, 실제로는 더 적극적인 친환경 정책이 필요해 보여요. 재활용 소재 사용을 늘리고 수리 가능성을 높여주면 좋겠어요."',
      metrics: { awareness: '88%', purchase: '68%', recommend: '72%' }
    }
  },
  'Xiaomi': {
    P1: {
      score: '높음',
      quote: '"샤오미는 가성비가 정말 좋아요! MZ세대라면 가격 대비 성능이 중요한데, 샤오미는 그 부분에서 정말 만족스러워요. 다만 브랜드 이미지는 조금 부족해요."',
      metrics: { awareness: '85%', purchase: '78%', recommend: '75%' }
    },
    P2: {
      score: '보통',
      quote: '"샤오미는 가성비는 좋지만, 업무용으로는 조금 부족해요. 생산성 앱이나 보안 기능이 다른 브랜드보다 부족하고, 고객 지원도 개선이 필요해요."',
      metrics: { awareness: '78%', purchase: '65%', recommend: '62%' }
    },
    P3: {
      score: '높음',
      quote: '"샤오미는 친환경에 대한 노력이 보여요. 에너지 효율성 개선과 친환경 포장 등 환경을 생각하는 모습이 좋아요. 가격도 합리적이라 접근성이 좋아요."',
      metrics: { awareness: '82%', purchase: '72%', recommend: '75%' }
    }
  },
  'Huawei': {
    P1: {
      score: '보통',
      quote: '"화웨이는 카메라 성능이 정말 뛰어나요! MZ세대라면 사진 촬영에 관심이 많을 텐데, 화웨이의 카메라 기술은 정말 인상적이에요. 다만 앱 지원 문제가 있어요."',
      metrics: { awareness: '75%', purchase: '58%', recommend: '62%' }
    },
    P2: {
      score: '낮음',
      quote: '"화웨이는 기술적으로는 뛰어나지만, 업무용으로는 부적합해요. Google 서비스 부재로 인한 앱 호환성 문제와 보안 우려가 있어서 회사에서 사용하기 어려워요."',
      metrics: { awareness: '72%', purchase: '45%', recommend: '48%' }
    },
    P3: {
      score: '보통',
      quote: '"화웨이의 친환경 노력은 알 수 없어요. 기술은 뛰어나지만 환경에 대한 정보가 부족하고, 친환경 정책에 대한 투명성이 개선이 필요해요."',
      metrics: { awareness: '68%', purchase: '52%', recommend: '55%' }
    }
  }
};

// 브랜드 선택 시 페르소나 반응 표시
function showBrandPersonaReactions(brandName) {
  const reactionsContainer = document.getElementById('brandPersonaReactions');
  const selectedBrandName = document.getElementById('selectedBrandName');
  
  if (!brandPersonaReactions[brandName]) {
    console.warn(`브랜드 "${brandName}"에 대한 페르소나 반응 데이터가 없습니다.`);
    return;
  }
  
  // 선택된 브랜드명 업데이트
  selectedBrandName.textContent = brandName;
  
  // 각 페르소나의 반응 데이터 업데이트
  const personas = ['P1', 'P2', 'P3'];
  personas.forEach(persona => {
    const reactionData = brandPersonaReactions[brandName][persona];
    if (reactionData) {
      // 점수 업데이트
      document.getElementById(`brand${persona}Score`).textContent = reactionData.score;
      
      // 인용문 업데이트
      document.getElementById(`brand${persona}Quote`).textContent = reactionData.quote;
      
      // 메트릭 업데이트
      document.getElementById(`brand${persona}Awareness`).textContent = reactionData.metrics.awareness;
      document.getElementById(`brand${persona}Purchase`).textContent = reactionData.metrics.purchase;
      document.getElementById(`brand${persona}Recommend`).textContent = reactionData.metrics.recommend;
    }
  });
  
  // 종합 분석 업데이트
  updateBrandReactionsSummary(brandName);
  
  // 반응 섹션 표시
  reactionsContainer.classList.remove('hidden');
  
  // 부드러운 스크롤로 반응 섹션으로 이동
  setTimeout(() => {
    reactionsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// 브랜드 종합 분석 업데이트
function updateBrandReactionsSummary(brandName) {
  const summaryContainer = document.getElementById('brandReactionsSummary');
  const reactions = brandPersonaReactions[brandName];
  
  if (!reactions) return;
  
  // 각 페르소나별 점수 계산
  const scores = {
    P1: getScoreValue(reactions.P1.score),
    P2: getScoreValue(reactions.P2.score),
    P3: getScoreValue(reactions.P3.score)
  };
  
  // 평균 점수 계산
  const avgScore = (scores.P1 + scores.P2 + scores.P3) / 3;
  
  // 종합 분석 텍스트 생성
  let summaryText = `"${brandName}"에 대한 페르소나별 반응을 분석한 결과, `;
  
  if (avgScore >= 4) {
    summaryText += `전반적으로 매우 긍정적인 반응을 보이고 있습니다. `;
  } else if (avgScore >= 3) {
    summaryText += `전반적으로 긍정적인 반응을 보이고 있습니다. `;
  } else if (avgScore >= 2) {
    summaryText += `전반적으로 보통 수준의 반응을 보이고 있습니다. `;
  } else {
    summaryText += `전반적으로 부정적인 반응을 보이고 있습니다. `;
  }
  
  // 가장 높은 점수의 페르소나 찾기
  const topPersona = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  const topPersonaName = {
    'P1': '트렌드 민감 MZ',
    'P2': '실용 중심 직장인',
    'P3': '친환경 가치 지향'
  }[topPersona];
  
  summaryText += `특히 ${topPersonaName} 페르소나에서 가장 높은 관심을 보이고 있으며, `;
  
  // 브랜드별 특별한 인사이트 추가
  if (brandName === 'Samsung') {
    summaryText += `혁신적인 기술과 실용적 기능의 균형잡힌 접근이 높은 평가를 받고 있습니다.`;
  } else if (brandName === 'Apple') {
    summaryText += `브랜드 가치와 사용자 경험의 우수성이 전반적으로 인정받고 있습니다.`;
  } else if (brandName === 'Xiaomi') {
    summaryText += `가성비와 친환경 가치에 대한 긍정적 평가가 이루어지고 있습니다.`;
  } else if (brandName === 'Huawei') {
    summaryText += `기술적 우수성과 실용적 한계에 대한 균형잡힌 평가가 이루어지고 있습니다.`;
  }
  
  summaryContainer.textContent = summaryText;
}

// 브랜드 클릭 이벤트 설정
function setupBrandClickEvents() {
  // 브랜드 리스트에 클릭 이벤트 추가
  const brandList = document.getElementById('brandList');
  if (brandList) {
    // 기존 브랜드 요소들에 클릭 이벤트 추가
    const existingBrands = brandList.querySelectorAll('.brand');
    existingBrands.forEach(brand => {
      brand.style.cursor = 'pointer';
      brand.addEventListener('click', function() {
        const brandName = this.querySelector('strong').textContent;
        showBrandPersonaReactions(brandName);
      });
    });
  }
}

// 키워드 선택 시 페르소나 반응 표시
function showKeywordPersonaReactions(keyword) {
  const reactionsContainer = document.getElementById('keywordPersonaReactions');
  const selectedKeywordName = document.getElementById('selectedKeywordName');
  
  if (!keywordPersonaReactions[keyword]) {
    console.warn(`키워드 "${keyword}"에 대한 페르소나 반응 데이터가 없습니다.`);
    return;
  }
  
  // 선택된 키워드명 업데이트
  selectedKeywordName.textContent = keyword;
  
  // 각 페르소나의 반응 데이터 업데이트
  const personas = ['P1', 'P2', 'P3'];
  personas.forEach(persona => {
    const reactionData = keywordPersonaReactions[keyword][persona];
    if (reactionData) {
      // 점수 업데이트
      document.getElementById(`${persona.toLowerCase()}Score`).textContent = reactionData.score;
      
      // 인용문 업데이트
      document.getElementById(`${persona.toLowerCase()}Quote`).textContent = reactionData.quote;
      
      // 메트릭 업데이트
      document.getElementById(`${persona.toLowerCase()}Interest`).textContent = reactionData.metrics.interest;
      document.getElementById(`${persona.toLowerCase()}Purchase`).textContent = reactionData.metrics.purchase;
      document.getElementById(`${persona.toLowerCase()}Recommend`).textContent = reactionData.metrics.recommend;
    }
  });
  
  // 종합 분석 업데이트
  updateReactionsSummary(keyword);
  
  // 반응 섹션 표시
  reactionsContainer.classList.remove('hidden');
  
  // 부드러운 스크롤로 반응 섹션으로 이동
  setTimeout(() => {
    reactionsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// 종합 분석 업데이트
function updateReactionsSummary(keyword) {
  const summaryContainer = document.getElementById('reactionsSummary');
  const reactions = keywordPersonaReactions[keyword];
  
  if (!reactions) return;
  
  // 각 페르소나별 점수 계산
  const scores = {
    P1: getScoreValue(reactions.P1.score),
    P2: getScoreValue(reactions.P2.score),
    P3: getScoreValue(reactions.P3.score)
  };
  
  // 평균 점수 계산
  const avgScore = (scores.P1 + scores.P2 + scores.P3) / 3;
  
  // 종합 분석 텍스트 생성
  let summaryText = `"${keyword}"에 대한 페르소나별 반응을 분석한 결과, `;
  
  if (avgScore >= 4) {
    summaryText += `전반적으로 매우 긍정적인 반응을 보이고 있습니다. `;
  } else if (avgScore >= 3) {
    summaryText += `전반적으로 긍정적인 반응을 보이고 있습니다. `;
  } else if (avgScore >= 2) {
    summaryText += `전반적으로 보통 수준의 반응을 보이고 있습니다. `;
  } else {
    summaryText += `전반적으로 부정적인 반응을 보이고 있습니다. `;
  }
  
  // 가장 높은 점수의 페르소나 찾기
  const topPersona = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  const topPersonaName = {
    'P1': '트렌드 민감 MZ',
    'P2': '실용 중심 직장인',
    'P3': '친환경 가치 지향'
  }[topPersona];
  
  summaryText += `특히 ${topPersonaName} 페르소나에서 가장 높은 관심을 보이고 있으며, `;
  
  // 키워드별 특별한 인사이트 추가
  if (keyword === 'AI카메라') {
    summaryText += `AI 기술에 대한 높은 기대감과 실제 사용성을 중시하는 경향이 나타납니다.`;
  } else if (keyword === '폴더블UX') {
    summaryText += `혁신적인 사용자 경험과 실용적 가치에 대한 균형잡힌 평가가 이루어지고 있습니다.`;
  } else if (keyword === '친환경소재') {
    summaryText += `환경 가치와 제품 성능에 대한 균형잡힌 접근이 요구되고 있습니다.`;
  } else if (keyword === '카메라모듈디자인') {
    summaryText += `디자인적 완성도와 기능적 실용성에 대한 조화로운 접근이 필요합니다.`;
  }
  
  summaryContainer.textContent = summaryText;
}

// 점수 텍스트를 숫자로 변환
function getScoreValue(scoreText) {
  const scoreMap = {
    '매우 높음': 5,
    '높음': 4,
    '보통': 3,
    '낮음': 2,
    '매우 낮음': 1
  };
  return scoreMap[scoreText] || 3;
}

// 반응 섹션 닫기
function closeKeywordReactions() {
  document.getElementById('keywordPersonaReactions').classList.add('hidden');
}

// 브랜드 반응 섹션 닫기
function closeBrandReactions() {
  document.getElementById('brandPersonaReactions').classList.add('hidden');
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
  // 닫기 버튼 이벤트
  const closeBtn = document.getElementById('closeReactions');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeKeywordReactions);
  }
  
  // 브랜드 반응 닫기 버튼 이벤트
  const closeBrandBtn = document.getElementById('closeBrandReactions');
  if (closeBrandBtn) {
    closeBrandBtn.addEventListener('click', closeBrandReactions);
  }
  
  // 기존 트렌드 차트 범례 버튼에 키워드 반응 기능 추가
  const legendButtons = document.querySelectorAll('#trendLegend button');
  legendButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const keyword = this.dataset.key;
      showKeywordPersonaReactions(keyword);
    });
  });
  
  // 브랜드 리스트에 클릭 이벤트 추가
  setupBrandClickEvents();
});
