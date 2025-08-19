// =========================
// 유틸리티 함수들
// =========================

/**
 * 고유 ID 생성
 */
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 현재 타임스탬프 반환
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

/**
 * 날짜를 한국어 형식으로 포맷
 */
function formatDateKorean(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
}

/**
 * HTML 이스케이프 처리
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 안전한 날짜 정렬
 */
function safeSortByDate(array, dateField, ascending = true) {
    return [...array].sort((a, b) => {
        const dateA = new Date(a[dateField]);
        const dateB = new Date(b[dateField]);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

/**
 * 현재 시간을 입력 필드에 설정
 */
function setCurrentTime() {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 16);
    
    const timeInputs = ['observationTime', 'shadowStartTime'];
    
    timeInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element && !element.value) {
            element.value = timeString;
        }
    });
}

/**
 * 알림 메시지 표시
 */
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

/**
 * 에러 메시지 표시
 */
function showError(message) {
    showAlert(message, 'error');
}

/**
 * 저장 완료 메시지 표시
 */
function showSaveStatus(message) {
    showAlert(message, 'success');
}

/**
 * 배열이 비어있는지 확인
 */
function isEmpty(array) {
    return !array || array.length === 0;
}

/**
 * 문자열 자르기 (말줄임표 추가)
 */
function truncateText(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * 숫자를 한국어 단위로 변환
 */
function formatNumber(num) {
    if (num >= 10000) {
        return Math.floor(num / 1000) + 'k';
    }
    return num.toString();
}

/**
 * 태그 추가 함수
 */
function addTag(tagText, container) {
    if (!tagText || !container) return;
    
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        ${escapeHtml(tagText)}
        <button type="button" class="tag-remove" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(tag);
}

/**
 * DOM 요소가 존재하는지 확인
 */
function elementExists(id) {
    return document.getElementById(id) !== null;
}

/**
 * 폼 데이터 초기화
 */
function clearFormData(formIds) {
    formIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            } else {
                element.value = '';
            }
        }
    });
}

/**
 * 로딩 상태 토글
 */
function toggleLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (element) {
        element.disabled = isLoading;
        element.textContent = isLoading ? '처리 중...' : element.getAttribute('data-original-text') || element.textContent;
        if (!isLoading && !element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', element.textContent);
        }
    }
}

/**
 * 디바운스 함수
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 로컬 스토리지 안전 접근
 */
function safeLocalStorage() {
    try {
        return typeof(Storage) !== "undefined";
    } catch (e) {
        return false;
    }
}

/**
 * 파일 크기 포맷
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}