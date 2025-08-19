// =========================
// UI 관리자
// =========================

/**
 * 통계 업데이트
 */
function updateStats() {
    const stats = getDataStats();
    
    if (elementExists('observationCount')) {
        document.getElementById('observationCount').textContent = stats.totalObservations;
    }
    if (elementExists('interviewCount')) {
        document.getElementById('interviewCount').textContent = stats.totalInterviews;
    }
    if (elementExists('shadowCount')) {
        document.getElementById('shadowCount').textContent = stats.totalShadowActivities;
    }
    if (elementExists('photoCount')) {
        document.getElementById('photoCount').textContent = stats.totalPhotoDiaries;
    }
    if (elementExists('ideaCount')) {
        document.getElementById('ideaCount').textContent = stats.totalIdeas;
    }
}

/**
 * 모든 목록 업데이트
 */
function updateAllLists() {
    try {
        // 각 함수가 존재하는지 확인 후 호출
        if (typeof updateObservationList === 'function') {
            updateObservationList();
        }
        if (typeof updateInterviewList === 'function') {
            updateInterviewList();
        }
        if (typeof updateShadowTimeline === 'function') {
            updateShadowTimeline();
        }
        if (typeof updatePhotoDiaryList === 'function') {
            updatePhotoDiaryList();
        }
        if (typeof updateIdeaList === 'function') {
            updateIdeaList();
        }
    } catch (error) {
        console.error('목록 업데이트 중 오류:', error);
    }
}

/**
 * 모든 활동 업데이트 (별칭)
 */
function updateRecentActivity() {
    updateAllLists();
}

/**
 * 네비게이션 설정
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.method-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // 모든 버튼과 섹션 비활성화
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // 선택된 버튼과 섹션 활성화
            this.classList.add('active');
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

/**
 * 태그 입력 설정
 */
function setupTagInput() {
    const tagInput = document.getElementById('observationTagInput');
    const tagsContainer = document.getElementById('observationTags');

    if (tagInput && tagsContainer) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                addTag(this.value.trim(), tagsContainer);
                this.value = '';
            }
        });
    }
}

/**
 * 사진 업로드 설정
 */
function setupPhotoUpload() {
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
}

/**
 * 리스트 항목 렌더링
 */
function renderListItem(item, type) {
    const itemElement = document.createElement('div');
    itemElement.className = 'idea-item';
    itemElement.setAttribute('data-id', item.id);
    
    let title, content, meta;
    
    switch (type) {
        case 'observations':
            title = item.location || '장소 미지정';
            content = truncateText(item.notes, 100);
            meta = item.tags ? item.tags.map(tag => 
                `<span style="background: #e9ecef; padding: 2px 8px; border-radius: 10px; margin-right: 5px; font-size: 0.8rem;">${escapeHtml(tag)}</span>`
            ).join('') : '';
            break;
            
        case 'interviews':
            title = `인터뷰 - ${item.participant || '참여자'}`;
            content = truncateText(item.transcript, 150);
            meta = item.themes ? `주요 주제: ${escapeHtml(item.themes)}` : '';
            break;
            
        case 'photoDiaries':
            title = '포토다이어리';
            content = escapeHtml(item.description);
            meta = `${item.context ? escapeHtml(item.context) + ' • ' : ''}사진 ${item.photoCount || 0}장`;
            break;
            
        case 'ideas':
            title = escapeHtml(item.title);
            content = escapeHtml(item.description);
            meta = `우선순위: ${escapeHtml(item.priority || '보통')}`;
            break;
            
        default:
            title = '데이터';
            content = JSON.stringify(item);
            meta = '';
    }
    
    itemElement.innerHTML = `
        <div class="idea-header">
            <h4>${title}</h4>
            <span class="idea-category">${formatDateKorean(item.timestamp)}</span>
        </div>
        <div class="idea-description">${content}</div>
        ${meta ? `<div class="idea-meta">${meta}</div>` : ''}
    `;
    
    return itemElement;
}

/**
 * 빈 상태 메시지 렌더링
 */
function renderEmptyState(message) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'empty-state';
    emptyElement.style.cssText = `
        padding: 40px;
        text-align: center;
        color: #6c757d;
        font-style: italic;
    `;
    emptyElement.textContent = message;
    return emptyElement;
}

/**
 * 로딩 상태 표시
 */
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6c757d;">
                <div style="font-size: 1.2rem; margin-bottom: 10px;">로딩 중...</div>
                <div style="font-size: 0.9rem;">데이터를 불러오고 있습니다.</div>
            </div>
        `;
    }
}

/**
 * 확인 대화상자
 */
function confirmDialog(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

/**
 * 모달 창 관리
 */
const ModalManager = {
    create: function(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modalContent.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #2c3e50;">${title}</h3>
            <div style="margin-bottom: 20px;">${content}</div>
            <div style="text-align: right;">
                ${actions.map(action => 
                    `<button class="btn ${action.class || 'btn-secondary'}" 
                             onclick="${action.onclick}"
                             style="margin-left: 10px;">
                        ${action.text}
                     </button>`
                ).join('')}
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 배경 클릭시 닫기
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                ModalManager.close(modal);
            }
        });
        
        return modal;
    },
    
    close: function(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }
};

/**
 * 툴팁 관리
 */
function addTooltip(element, message) {
    element.title = message;
    element.style.cursor = 'help';
}

/**
 * 진행률 표시
 */
function updateProgressBar(elementId, percentage) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.width = percentage + '%';
        element.setAttribute('aria-valuenow', percentage);
    }
}

/**
 * 탭 관리
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 모든 탭 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 선택된 탭 활성화
            this.classList.add('active');
            const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * 반응형 처리
 */
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

// 리사이즈 이벤트 리스너
window.addEventListener('resize', debounce(handleResize, 250));