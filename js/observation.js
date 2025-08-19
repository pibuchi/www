// =========================
// 관찰조사 모듈
// =========================

/**
 * 관찰조사 데이터 저장
 */
function saveObservation() {
    try {
        const notes = document.getElementById('observationNotes')?.value || '';
        const location = document.getElementById('observationLocation')?.value || '';
        const time = document.getElementById('observationTime')?.value || '';
        const tags = Array.from(document.querySelectorAll('#observationTags .tag')).map(tag => 
            tag.textContent.replace('×', '').trim()
        );

        if (!notes.trim()) {
            showError('관찰 내용을 입력해주세요.');
            return;
        }

        const data = {
            notes: notes.trim(),
            location: location.trim(),
            time: time,
            tags: tags
        };

        // 직접 데이터 추가
        const observation = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            ...data
        };
        
        // 배열 초기화 확인
        if (!Array.isArray(researchData.observations)) {
            researchData.observations = [];
        }
        
        researchData.observations.push(observation);
        saveDataToStorage();
        
        // UI 업데이트
        if (typeof updateStats === 'function') {
            updateStats();
        }
        if (typeof updateAllLists === 'function') {
            updateAllLists();
        }
        
        showSaveStatus('관찰조사가 저장되었습니다');
        clearObservationForm();
        
        return observation;
    } catch (error) {
        console.error('관찰조사 저장 중 오류:', error);
        showError('관찰조사 저장 중 오류가 발생했습니다.');
    }
}

/**
 * 관찰조사 폼 초기화
 */
function clearObservationForm() {
    clearFormData(['observationNotes', 'observationLocation']);
    document.getElementById('observationTags').innerHTML = '';
    setCurrentTime();
}

/**
 * 관찰조사 목록 업데이트
 */
function updateObservationList() {
    const container = document.getElementById('observationList');
    if (!container) return;

    const observations = getData('observations');
    container.innerHTML = '';

    if (isEmpty(observations)) {
        container.appendChild(renderEmptyState('아직 관찰 기록이 없습니다.'));
        return;
    }

    observations.slice(0, 5).forEach(obs => {
        const item = renderListItem(obs, 'observations');
        container.appendChild(item);
    });
}

/**
 * 관찰 패턴 분석
 */
function analyzeObservations() {
    const observations = getData('observations');
    
    if (isEmpty(observations)) {
        showError('분석할 관찰 데이터가 없습니다.');
        return;
    }

    // 패턴 분석 시뮬레이션
    const patterns = analyzePatterns(observations);
    const frequency = analyzeFrequency(observations);
    
    if (elementExists('observationPatterns')) {
        document.getElementById('observationPatterns').textContent = patterns;
    }
    if (elementExists('observationFrequency')) {
        document.getElementById('observationFrequency').textContent = frequency;
    }
    
    showSaveStatus('관찰 데이터 패턴 분석이 완료되었습니다.');
    
    // 분석 결과 상세 보기
    showAnalysisDetails(observations, patterns, frequency);
}

/**
 * 패턴 분석 로직
 */
function analyzePatterns(observations) {
    const locationCounts = {};
    const tagCounts = {};
    
    observations.forEach(obs => {
        // 장소별 빈도
        if (obs.location) {
            locationCounts[obs.location] = (locationCounts[obs.location] || 0) + 1;
        }
        
        // 태그별 빈도
        if (obs.tags) {
            obs.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    
    // 반복되는 패턴 수 계산
    const locationPatterns = Object.values(locationCounts).filter(count => count > 1).length;
    const tagPatterns = Object.values(tagCounts).filter(count => count > 1).length;
    
    return locationPatterns + tagPatterns;
}

/**
 * 빈도 분석 로직
 */
function analyzeFrequency(observations) {
    if (observations.length === 0) return 0;
    
    // 시간대별 분석
    const hourCounts = {};
    observations.forEach(obs => {
        if (obs.time) {
            const hour = new Date(obs.time).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
    });
    
    // 가장 빈번한 시간대의 빈도 반환
    return Math.max(...Object.values(hourCounts), 0);
}

/**
 * 분석 결과 상세 보기
 */
function showAnalysisDetails(observations, patterns, frequency) {
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>📊 분석 결과</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>총 관찰 기록:</strong> ${observations.length}건<br>
                <strong>반복 패턴:</strong> ${patterns}개<br>
                <strong>최고 빈도:</strong> ${frequency}회
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📍 장소별 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateLocationAnalysis(observations)}
            </div>
        </div>
        
        <div>
            <h4>🏷️ 태그별 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateTagAnalysis(observations)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '관찰조사 분석 결과',
        content,
        [
            {
                text: '닫기',
                class: 'btn-secondary',
                onclick: `ModalManager.close(this.closest('.modal-overlay'))`
            }
        ]
    );
}

/**
 * 장소별 분석 생성
 */
function generateLocationAnalysis(observations) {
    const locationCounts = {};
    
    observations.forEach(obs => {
        if (obs.location) {
            locationCounts[obs.location] = (locationCounts[obs.location] || 0) + 1;
        }
    });
    
    if (Object.keys(locationCounts).length === 0) {
        return '<em>장소 정보가 없습니다.</em>';
    }
    
    return Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([location, count]) => `<div>${escapeHtml(location)}: ${count}회</div>`)
        .join('');
}

/**
 * 태그별 분석 생성
 */
function generateTagAnalysis(observations) {
    const tagCounts = {};
    
    observations.forEach(obs => {
        if (obs.tags) {
            obs.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    
    if (Object.keys(tagCounts).length === 0) {
        return '<em>태그 정보가 없습니다.</em>';
    }
    
    return Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => `<span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 12px; margin: 2px; display: inline-block; font-size: 0.8rem;">${escapeHtml(tag)} (${count})</span>`)
        .join('');
}

/**
 * 관찰 데이터 필터링
 */
function filterObservations(filters) {
    let observations = getData('observations');
    
    if (filters.location) {
        observations = observations.filter(obs => 
            obs.location && obs.location.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    
    if (filters.tag) {
        observations = observations.filter(obs => 
            obs.tags && obs.tags.some(tag => 
                tag.toLowerCase().includes(filters.tag.toLowerCase())
            )
        );
    }
    
    if (filters.dateFrom) {
        observations = observations.filter(obs => 
            new Date(obs.timestamp) >= new Date(filters.dateFrom)
        );
    }
    
    if (filters.dateTo) {
        observations = observations.filter(obs => 
            new Date(obs.timestamp) <= new Date(filters.dateTo)
        );
    }
    
    return observations;
}

/**
 * 관찰 데이터 내보내기
 */
function exportObservations() {
    const observations = getData('observations');
    
    if (isEmpty(observations)) {
        showError('내보낼 관찰 데이터가 없습니다.');
        return;
    }
    
    const exportData = {
        exportDate: getCurrentTimestamp(),
        type: 'observations',
        count: observations.length,
        data: observations
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `observations_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showSaveStatus('관찰조사 데이터가 내보내졌습니다.');
}