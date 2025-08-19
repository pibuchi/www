// =========================
// 쉐도우 트래킹 모듈
// =========================

/**
 * 쉐도우 트래킹 활동 추가
 */
function addShadowActivity() {
    const startTime = document.getElementById('shadowStartTime')?.value;
    const activity = document.getElementById('shadowActivity')?.value;
    const location = document.getElementById('shadowLocation')?.value;
    const tools = document.getElementById('shadowTools')?.value;

    if (!startTime) {
        showError('시작 시간을 선택해주세요.');
        return;
    }

    if (!activity || !activity.trim()) {
        showError('활동 내용을 입력해주세요.');
        return;
    }

    const data = {
        startTime: startTime,
        activity: activity.trim(),
        location: location ? location.trim() : '',
        tools: tools ? tools.trim() : ''
    };

    try {
        // data-manager.js의 addShadowActivity 대신 직접 데이터 추가
        const shadowActivity = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            ...data
        };
        
        // 배열 초기화 확인
        if (!Array.isArray(researchData.shadowTracking)) {
            researchData.shadowTracking = [];
        }
        
        researchData.shadowTracking.push(shadowActivity);
        saveDataToStorage();
        
        // UI 업데이트
        if (typeof updateStats === 'function') {
            updateStats();
        }
        updateShadowTimeline();
        if (typeof updateAllLists === 'function') {
            updateAllLists();
        }
        
        showSaveStatus('활동이 추가되었습니다');
        clearShadowForm();
        
        return shadowActivity;
    } catch (error) {
        console.error('쉐도우 활동 추가 중 오류:', error);
        showError('활동 추가 중 오류가 발생했습니다.');
    }
}

/**
 * 쉐도우 트래킹 폼 초기화
 */
function clearShadowForm() {
    clearFormData(['shadowActivity', 'shadowLocation', 'shadowTools']);
    setCurrentTime();
}

/**
 * 쉐도우 트래킹 타임라인 업데이트
 */
function updateShadowTimeline() {
    const timeline = document.getElementById('shadowTimeline');
    if (!timeline) return;

    const activities = getData('shadowTracking');
    timeline.innerHTML = '';

    if (isEmpty(activities)) {
        timeline.appendChild(renderEmptyState('아직 활동이 없습니다.'));
        return;
    }

    const sortedActivities = safeSortByDate(activities, 'startTime', false);

    sortedActivities.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.setAttribute('data-id', item.id);
        
        timelineItem.innerHTML = `
            <div class="timeline-time">${formatDateKorean(item.startTime)}</div>
            <div class="timeline-activity">
                <strong>${escapeHtml(item.activity)}</strong>
                ${item.location ? `<div style="font-size: 12px; color: #7f8c8d; margin-top: 3px;">📍 ${escapeHtml(item.location)}</div>` : ''}
                ${item.tools ? `<div style="font-size: 11px; color: #95a5a6; margin-top: 2px;">🛠️ ${escapeHtml(item.tools)}</div>` : ''}
            </div>
            <div class="timeline-actions" style="margin-top: 8px;">
                <button class="btn btn-secondary" style="font-size: 0.7rem; padding: 3px 8px;" 
                        onclick="editShadowActivity('${item.id}')">수정</button>
                <button class="btn btn-secondary" style="font-size: 0.7rem; padding: 3px 8px; margin-left: 5px;" 
                        onclick="deleteShadowActivity('${item.id}')">삭제</button>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });

    // 통계 업데이트
    updateShadowStats();
}

/**
 * 쉐도우 트래킹 통계 업데이트
 */
function updateShadowStats() {
    const activities = getData('shadowTracking');
    
    if (isEmpty(activities)) {
        updateShadowStatsDisplay(0, 0, 0);
        return;
    }
    
    // 총 추적 시간 계산 (활동 수 기준)
    const totalHours = activities.length;
    
    // 고유 장소 수 계산
    const locations = [...new Set(activities.map(a => a.location).filter(l => l))];
    const uniqueLocations = locations.length;
    
    // 시간대별 활동 분포 계산
    const hourDistribution = calculateHourDistribution(activities);
    
    updateShadowStatsDisplay(totalHours, uniqueLocations, hourDistribution.peak);
}

/**
 * 통계 디스플레이 업데이트
 */
function updateShadowStatsDisplay(hours, locations, peakHour) {
    if (elementExists('shadowDuration')) {
        document.getElementById('shadowDuration').textContent = hours + 'h';
    }
    if (elementExists('shadowLocations')) {
        document.getElementById('shadowLocations').textContent = locations;
    }
}

/**
 * 시간대별 분포 계산
 */
function calculateHourDistribution(activities) {
    const hourCounts = {};
    
    activities.forEach(activity => {
        if (activity.startTime) {
            const hour = new Date(activity.startTime).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
    });
    
    const maxCount = Math.max(...Object.values(hourCounts), 0);
    const peakHour = Object.entries(hourCounts).find(([,count]) => count === maxCount)?.[0] || 0;
    
    return {
        distribution: hourCounts,
        peak: parseInt(peakHour),
        maxCount
    };
}

/**
 * 여정 지도 생성
 */
function generateJourneyMap() {
    const activities = getData('shadowTracking');
    
    if (isEmpty(activities)) {
        showError('여정 지도를 생성할 데이터가 없습니다.');
        return;
    }
    
    const journeyData = analyzeJourney(activities);
    
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>🗺️ 여정 개요</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>총 활동:</strong> ${activities.length}개<br>
                <strong>활동 기간:</strong> ${journeyData.timeSpan}<br>
                <strong>방문 장소:</strong> ${journeyData.uniqueLocations}곳<br>
                <strong>가장 활발한 시간:</strong> ${journeyData.peakHour}시
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📍 장소별 활동</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${journeyData.locationSummary}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>⏰ 시간대별 패턴</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateHourlyChart(journeyData.hourlyPattern)}
            </div>
        </div>
        
        <div>
            <h4>🔄 활동 패턴</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${journeyData.activityPatterns}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '여정 지도',
        content,
        [
            {
                text: '여정 내보내기',
                class: 'btn-primary',
                onclick: `exportJourneyMap(${JSON.stringify(journeyData).replace(/"/g, '&quot;')}); ModalManager.close(this.closest('.modal-overlay'));`
            },
            {
                text: '닫기',
                class: 'btn-secondary',
                onclick: `ModalManager.close(this.closest('.modal-overlay'))`
            }
        ]
    );
    
    showSaveStatus('여정 지도가 생성되었습니다.');
}

/**
 * 여정 분석
 */
function analyzeJourney(activities) {
    const sortedActivities = safeSortByDate(activities, 'startTime', true);
    
    // 시간 범위 계산
    const firstActivity = sortedActivities[0];
    const lastActivity = sortedActivities[sortedActivities.length - 1];
    const timeSpan = firstActivity && lastActivity ? 
        `${formatDateKorean(firstActivity.startTime)} ~ ${formatDateKorean(lastActivity.startTime)}` : 
        '정보 없음';
    
    // 장소별 활동 수 계산
    const locationCounts = {};
    activities.forEach(activity => {
        if (activity.location) {
            locationCounts[activity.location] = (locationCounts[activity.location] || 0) + 1;
        }
    });
    
    const uniqueLocations = Object.keys(locationCounts).length;
    
    // 장소별 요약
    const locationSummary = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([location, count]) => 
            `<div style="margin: 5px 0;"><strong>${escapeHtml(location)}:</strong> ${count}회 활동</div>`
        ).join('') || '<em>장소 정보가 없습니다.</em>';
    
    // 시간대별 패턴
    const hourlyPattern = calculateHourDistribution(activities);
    
    // 활동 패턴 분석
    const activityTypes = {};
    activities.forEach(activity => {
        const type = categorizeActivity(activity.activity);
        activityTypes[type] = (activityTypes[type] || 0) + 1;
    });
    
    const activityPatterns = Object.entries(activityTypes)
        .sort(([,a], [,b]) => b - a)
        .map(([type, count]) => 
            `<span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 15px; margin: 3px; display: inline-block;">
                ${escapeHtml(type)} (${count})
            </span>`
        ).join('');
    
    return {
        timeSpan,
        uniqueLocations,
        locationSummary,
        hourlyPattern,
        peakHour: hourlyPattern.peak,
        activityPatterns: activityPatterns || '<em>활동 패턴을 분석할 수 없습니다.</em>'
    };
}

/**
 * 활동 분류
 */
function categorizeActivity(activityText) {
    const activity = activityText.toLowerCase();
    
    if (activity.includes('식사') || activity.includes('먹') || activity.includes('점심') || activity.includes('저녁')) {
        return '식사';
    } else if (activity.includes('이동') || activity.includes('걷') || activity.includes('버스') || activity.includes('지하철')) {
        return '이동';
    } else if (activity.includes('회의') || activity.includes('미팅') || activity.includes('업무') || activity.includes('일')) {
        return '업무';
    } else if (activity.includes('휴식') || activity.includes('쉬') || activity.includes('대기')) {
        return '휴식';
    } else if (activity.includes('쇼핑') || activity.includes('구매') || activity.includes('마트')) {
        return '쇼핑';
    } else if (activity.includes('운동') || activity.includes('헬스') || activity.includes('조깅')) {
        return '운동';
    } else if (activity.includes('공부') || activity.includes('학습') || activity.includes('독서')) {
        return '학습';
    } else if (activity.includes('놀이') || activity.includes('게임') || activity.includes('오락')) {
        return '여가';
    } else {
        return '기타';
    }
}

/**
 * 시간대별 차트 생성
 */
function generateHourlyChart(hourlyPattern) {
    const hours = Array.from({length: 24}, (_, i) => i);
    const maxCount = hourlyPattern.maxCount || 1;
    
    return hours.map(hour => {
        const count = hourlyPattern.distribution[hour] || 0;
        const height = Math.max((count / maxCount) * 100, 5);
        const isActive = count > 0;
        
        return `
            <div style="display: inline-block; width: 20px; margin: 2px 1px; text-align: center;">
                <div style="
                    height: ${height}px; 
                    background: ${isActive ? '#667eea' : '#e9ecef'}; 
                    border-radius: 2px;
                    margin-bottom: 3px;
                    ${isActive ? `title="${hour}시: ${count}회"` : ''}
                "></div>
                <div style="font-size: 8px; color: #6c757d;">${hour}</div>
            </div>
        `;
    }).join('');
}

/**
 * 쉐도우 활동 수정
 */
function editShadowActivity(activityId) {
    const activities = getData('shadowTracking');
    const activity = activities.find(item => item.id === activityId);
    
    if (!activity) {
        showError('활동을 찾을 수 없습니다.');
        return;
    }

    const content = `
        <div class="form-group">
            <label>시작 시간</label>
            <input type="datetime-local" id="editShadowStartTime" class="form-control" value="${activity.startTime}">
        </div>
        <div class="form-group">
            <label>활동 내용</label>
            <input type="text" id="editShadowActivity" class="form-control" value="${escapeHtml(activity.activity)}">
        </div>
        <div class="form-group">
            <label>위치</label>
            <input type="text" id="editShadowLocation" class="form-control" value="${escapeHtml(activity.location)}">
        </div>
        <div class="form-group">
            <label>사용 도구/기기</label>
            <input type="text" id="editShadowTools" class="form-control" value="${escapeHtml(activity.tools)}">
        </div>
    `;

    const modal = ModalManager.create(
        '활동 수정',
        content,
        [
            {
                text: '저장',
                class: 'btn-primary',
                onclick: `saveShadowActivityEdit('${activityId}'); ModalManager.close(this.closest('.modal-overlay'));`
            },
            {
                text: '취소',
                class: 'btn-secondary',
                onclick: `ModalManager.close(this.closest('.modal-overlay'))`
            }
        ]
    );
}

/**
 * 수정된 쉐도우 활동 저장
 */
function saveShadowActivityEdit(activityId) {
    const startTime = document.getElementById('editShadowStartTime').value;
    const activity = document.getElementById('editShadowActivity').value;
    const location = document.getElementById('editShadowLocation').value;
    const tools = document.getElementById('editShadowTools').value;

    if (!startTime || !activity.trim()) {
        showError('시작 시간과 활동 내용을 입력해주세요.');
        return;
    }

    const updatedData = {
        startTime: startTime,
        activity: activity.trim(),
        location: location.trim(),
        tools: tools.trim()
    };

    const result = updateData('shadowTracking', activityId, updatedData);
    
    if (result) {
        updateShadowTimeline();
        updateStats();
        showSaveStatus('활동이 수정되었습니다.');
    } else {
        showError('활동 수정에 실패했습니다.');
    }
}

/**
 * 쉐도우 활동 삭제
 */
function deleteShadowActivity(activityId) {
    confirmDialog('이 활동을 삭제하시겠습니까?', () => {
        const result = removeData('shadowTracking', activityId);
        
        if (result) {
            updateShadowTimeline();
            updateStats();
            showSaveStatus('활동이 삭제되었습니다.');
        } else {
            showError('활동 삭제에 실패했습니다.');
        }
    });
}

/**
 * 여정 지도 내보내기
 */
function exportJourneyMap(journeyData) {
    const activities = getData('shadowTracking');
    
    const exportData = {
        exportDate: getCurrentTimestamp(),
        type: 'journey_map',
        summary: journeyData,
        activities: activities
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `journey_map_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showSaveStatus('여정 지도가 내보내졌습니다.');
}

/**
 * 활동 검색
 */
function searchShadowActivities(query) {
    const activities = getData('shadowTracking');
    
    if (!query.trim()) {
        updateShadowTimeline();
        return;
    }
    
    const filtered = activities.filter(activity => 
        activity.activity.toLowerCase().includes(query.toLowerCase()) ||
        activity.location.toLowerCase().includes(query.toLowerCase()) ||
        activity.tools.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredShadowActivities(filtered);
}

/**
 * 필터된 활동 표시
 */
function displayFilteredShadowActivities(activities) {
    const timeline = document.getElementById('shadowTimeline');
    if (!timeline) return;

    timeline.innerHTML = '';

    if (isEmpty(activities)) {
        timeline.appendChild(renderEmptyState('검색 결과가 없습니다.'));
        return;
    }

    const sortedActivities = safeSortByDate(activities, 'startTime', false);

    sortedActivities.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-time">${formatDateKorean(item.startTime)}</div>
            <div class="timeline-activity">
                <strong>${escapeHtml(item.activity)}</strong>
                ${item.location ? `<div style="font-size: 12px; color: #7f8c8d; margin-top: 3px;">📍 ${escapeHtml(item.location)}</div>` : ''}
                ${item.tools ? `<div style="font-size: 11px; color: #95a5a6; margin-top: 2px;">🛠️ ${escapeHtml(item.tools)}</div>` : ''}
            </div>
        `;
        timeline.appendChild(timelineItem);
    });
}

/**
 * 시간대별 활동 분석
 */
function analyzeTimePatterns() {
    const activities = getData('shadowTracking');
    
    if (isEmpty(activities)) {
        showError('분석할 활동 데이터가 없습니다.');
        return;
    }

    const timeAnalysis = performTimeAnalysis(activities);
    
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>⏰ 시간 패턴 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>가장 활발한 시간:</strong> ${timeAnalysis.peakHour}시<br>
                <strong>활동 집중 시간대:</strong> ${timeAnalysis.activeHours.join(', ')}시<br>
                <strong>평균 활동 간격:</strong> ${timeAnalysis.averageInterval}분
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📊 시간대별 활동량</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateHourlyChart(timeAnalysis.hourlyDistribution)}
            </div>
        </div>
        
        <div>
            <h4>📈 요일별 패턴</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateDayOfWeekChart(timeAnalysis.dayOfWeekPattern)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '시간 패턴 분석',
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
 * 시간 패턴 분석 수행
 */
function performTimeAnalysis(activities) {
    const hourlyDistribution = calculateHourDistribution(activities);
    
    // 요일별 분석
    const dayOfWeekCounts = {};
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    activities.forEach(activity => {
        if (activity.startTime) {
            const dayOfWeek = new Date(activity.startTime).getDay();
            const dayName = dayNames[dayOfWeek];
            dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + 1;
        }
    });
    
    // 활동 집중 시간대 (평균 이상의 활동이 있는 시간)
    const avgActivity = Object.values(hourlyDistribution.distribution).reduce((a, b) => a + b, 0) / 24;
    const activeHours = Object.entries(hourlyDistribution.distribution)
        .filter(([, count]) => count > avgActivity)
        .map(([hour]) => parseInt(hour))
        .sort((a, b) => a - b);
    
    // 평균 활동 간격 계산
    const sortedActivities = safeSortByDate(activities, 'startTime', true);
    let totalInterval = 0;
    let intervalCount = 0;
    
    for (let i = 1; i < sortedActivities.length; i++) {
        const prev = new Date(sortedActivities[i-1].startTime);
        const curr = new Date(sortedActivities[i].startTime);
        const interval = (curr - prev) / (1000 * 60); // 분 단위
        
        if (interval < 24 * 60) { // 24시간 이내의 간격만 계산
            totalInterval += interval;
            intervalCount++;
        }
    }
    
    const averageInterval = intervalCount > 0 ? Math.round(totalInterval / intervalCount) : 0;
    
    return {
        hourlyDistribution,
        peakHour: hourlyDistribution.peak,
        activeHours,
        averageInterval,
        dayOfWeekPattern: dayOfWeekCounts
    };
}

/**
 * 요일별 차트 생성
 */
function generateDayOfWeekChart(dayOfWeekPattern) {
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const maxCount = Math.max(...Object.values(dayOfWeekPattern), 1);
    
    return dayNames.map(day => {
        const count = dayOfWeekPattern[day] || 0;
        const height = Math.max((count / maxCount) * 100, 10);
        
        return `
            <div style="display: inline-block; width: 40px; margin: 5px; text-align: center;">
                <div style="
                    height: ${height}px; 
                    background: ${count > 0 ? '#667eea' : '#e9ecef'}; 
                    border-radius: 4px;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: end;
                    justify-content: center;
                    color: white;
                    font-size: 10px;
                " title="${day}요일: ${count}회">${count || ''}</div>
                <div style="font-size: 12px; color: #6c757d;">${day}</div>
            </div>
        `;
    }).join('');
}