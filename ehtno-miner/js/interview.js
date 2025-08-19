// =========================
// 심층인터뷰 모듈
// =========================

/**
 * 인터뷰 데이터 저장
 */
function saveInterview() {
    const guide = document.getElementById('interviewGuide').value;
    const transcript = document.getElementById('interviewTranscript').value;
    const participant = document.getElementById('interviewParticipant').value;
    const themes = document.getElementById('interviewThemes').value;

    if (!transcript.trim()) {
        showError('인터뷰 전사 내용을 입력해주세요.');
        return;
    }

    if (!participant.trim()) {
        showError('참여자 정보를 입력해주세요.');
        return;
    }

    const data = {
        guide: guide.trim(),
        transcript: transcript.trim(),
        participant: participant.trim(),
        themes: themes.trim()
    };

    const savedInterview = addInterview(data);
    updateStats();
    updateAllLists();
    showSaveStatus('인터뷰가 저장되었습니다');
    clearInterviewForm();
    
    return savedInterview;
}

/**
 * 인터뷰 폼 초기화
 */
function clearInterviewForm() {
    clearFormData([
        'interviewTranscript', 
        'interviewGuide', 
        'interviewParticipant', 
        'interviewThemes'
    ]);
}

/**
 * 인터뷰 목록 업데이트
 */
function updateInterviewList() {
    const container = document.getElementById('interviewList');
    if (!container) return;

    const interviews = getData('interviews');
    container.innerHTML = '';

    if (isEmpty(interviews)) {
        container.appendChild(renderEmptyState('아직 인터뷰 기록이 없습니다.'));
        return;
    }

    interviews.slice(0, 3).forEach(interview => {
        const item = renderListItem(interview, 'interviews');
        
        // 인터뷰 전용 액션 버튼 추가
        const actionButtons = document.createElement('div');
        actionButtons.className = 'interview-actions';
        actionButtons.style.cssText = 'margin-top: 10px; text-align: right;';
        actionButtons.innerHTML = `
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-left: 5px;" 
                    onclick="viewInterviewDetails('${interview.id}')">상세보기</button>
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-left: 5px;" 
                    onclick="analyzeInterview('${interview.id}')">주제분석</button>
        `;
        
        item.appendChild(actionButtons);
        container.appendChild(item);
    });
}

/**
 * 인터뷰 상세보기
 */
function viewInterviewDetails(interviewId) {
    const interviews = getData('interviews');
    const interview = interviews.find(item => item.id === interviewId);
    
    if (!interview) {
        showError('인터뷰를 찾을 수 없습니다.');
        return;
    }

    const content = `
        <div style="margin-bottom: 20px;">
            <h4>👤 참여자 정보</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>참여자:</strong> ${escapeHtml(interview.participant)}<br>
                <strong>인터뷰 일시:</strong> ${formatDateKorean(interview.timestamp)}
            </div>
        </div>
        
        ${interview.guide ? `
        <div style="margin-bottom: 20px;">
            <h4>❓ 인터뷰 가이드</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
                ${escapeHtml(interview.guide)}
            </div>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
            <h4>📝 전사 내용</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap; max-height: 300px; overflow-y: auto;">
                ${escapeHtml(interview.transcript)}
            </div>
        </div>
        
        ${interview.themes ? `
        <div style="margin-bottom: 20px;">
            <h4>🔍 주요 주제</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${escapeHtml(interview.themes)}
            </div>
        </div>
        ` : ''}
    `;

    const modal = ModalManager.create(
        '인터뷰 상세 정보',
        content,
        [
            {
                text: '주제 분석',
                class: 'btn-primary',
                onclick: `ModalManager.close(this.closest('.modal-overlay')); analyzeInterview('${interviewId}');`
            },
            {
                text: '닫기',
                class: 'btn-secondary',
                onclick: `ModalManager.close(this.closest('.modal-overlay'))`
            }
        ]
    );
}

/**
 * 개별 인터뷰 주제 분석
 */
function analyzeInterview(interviewId) {
    const interviews = getData('interviews');
    const interview = interviews.find(item => item.id === interviewId);
    
    if (!interview) {
        showError('인터뷰를 찾을 수 없습니다.');
        return;
    }

    const analysis = performThematicAnalysis(interview.transcript);
    
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>📊 주제 분석 결과</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>참여자:</strong> ${escapeHtml(interview.participant)}<br>
                <strong>전사 길이:</strong> ${interview.transcript.length}자<br>
                <strong>발견된 주제:</strong> ${analysis.themes.length}개
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>🏷️ 주요 주제들</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${analysis.themes.map(theme => 
                    `<span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 15px; margin: 3px; display: inline-block; font-size: 0.9rem;">
                        ${escapeHtml(theme)}
                    </span>`
                ).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>💭 키워드 빈도</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${Object.entries(analysis.keywords)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([keyword, count]) => 
                        `<div style="margin: 5px 0;"><strong>${escapeHtml(keyword)}:</strong> ${count}회</div>`
                    ).join('')}
            </div>
        </div>
        
        <div>
            <h4>📈 감정 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateEmotionAnalysis(analysis.sentiment)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '인터뷰 주제 분석',
        content,
        [
            {
                text: '분석 결과 저장',
                class: 'btn-primary',
                onclick: `saveAnalysisResult('${interviewId}', ${JSON.stringify(analysis).replace(/"/g, '&quot;')}); ModalManager.close(this.closest('.modal-overlay'));`
            },
            {
                text: '닫기',
                class: 'btn-secondary',
                onclick: `ModalManager.close(this.closest('.modal-overlay'))`
            }
        ]
    );
}

/**
 * 주제 분석 수행
 */
function performThematicAnalysis(transcript) {
    const text = transcript.toLowerCase();
    
    // 주요 주제 키워드 그룹
    const themeKeywords = {
        '기술 사용': ['기술', '스마트폰', '앱', '인터넷', '디지털', '온라인'],
        '감정 상태': ['기쁘', '슬프', '화나', '스트레스', '행복', '불안', '편안'],
        '인간관계': ['가족', '친구', '동료', '관계', '소통', '대화'],
        '일상 활동': ['일', '공부', '운동', '식사', '잠', '휴식'],
        '장소 이동': ['집', '회사', '학교', '카페', '이동', '교통'],
        '문제점': ['문제', '어려움', '불편', '힘들', '개선', '필요'],
        '만족도': ['좋', '만족', '편리', '유용', '도움', '효과']
    };
    
    // 주제별 매칭
    const themes = [];
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
        const matches = keywords.filter(keyword => text.includes(keyword));
        if (matches.length > 0) {
            themes.push(theme);
        }
    });
    
    // 키워드 빈도 분석
    const words = text.match(/[가-힣]{2,}/g) || [];
    const keywords = {};
    words.forEach(word => {
        if (word.length >= 2) {
            keywords[word] = (keywords[word] || 0) + 1;
        }
    });
    
    // 감정 분석 (간단한 규칙 기반)
    const positiveWords = ['좋', '만족', '행복', '편리', '유용', '도움'];
    const negativeWords = ['나쁘', '불만', '불편', '어려움', '문제', '힘들'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    let sentiment = '중립';
    if (positiveCount > negativeCount) sentiment = '긍정';
    else if (negativeCount > positiveCount) sentiment = '부정';
    
    return {
        themes,
        keywords,
        sentiment: {
            overall: sentiment,
            positive: positiveCount,
            negative: negativeCount
        }
    };
}

/**
 * 감정 분석 결과 생성
 */
function generateEmotionAnalysis(sentiment) {
    const total = sentiment.positive + sentiment.negative;
    const positivePercent = total > 0 ? Math.round((sentiment.positive / total) * 100) : 0;
    const negativePercent = total > 0 ? Math.round((sentiment.negative / total) * 100) : 0;
    
    return `
        <div style="margin-bottom: 10px;"><strong>전체 감정:</strong> ${sentiment.overall}</div>
        <div style="margin-bottom: 10px;">
            <div style="background: #e9ecef; border-radius: 10px; overflow: hidden;">
                <div style="background: #28a745; height: 20px; width: ${positivePercent}%; display: inline-block;"></div>
                <div style="background: #dc3545; height: 20px; width: ${negativePercent}%; display: inline-block;"></div>
            </div>
        </div>
        <div style="font-size: 0.9rem;">
            긍정적 표현: ${sentiment.positive}개 (${positivePercent}%) | 
            부정적 표현: ${sentiment.negative}개 (${negativePercent}%)
        </div>
    `;
}

/**
 * 분석 결과 저장
 */
function saveAnalysisResult(interviewId, analysis) {
    const interviews = getData('interviews');
    const interview = interviews.find(item => item.id === interviewId);
    
    if (interview) {
        interview.analysis = analysis;
        interview.analyzedAt = getCurrentTimestamp();
        
        updateData('interviews', interviewId, interview);
        showSaveStatus('분석 결과가 저장되었습니다.');
    }
}

/**
 * 전체 인터뷰 비교 분석
 */
function compareAllInterviews() {
    const interviews = getData('interviews');
    
    if (interviews.length < 2) {
        showError('비교 분석을 위해서는 최소 2개의 인터뷰가 필요합니다.');
        return;
    }

    const allThemes = {};
    const allKeywords = {};
    const sentiments = [];
    
    interviews.forEach(interview => {
        const analysis = performThematicAnalysis(interview.transcript);
        
        // 주제 집계
        analysis.themes.forEach(theme => {
            allThemes[theme] = (allThemes[theme] || 0) + 1;
        });
        
        // 키워드 집계
        Object.entries(analysis.keywords).forEach(([keyword, count]) => {
            allKeywords[keyword] = (allKeywords[keyword] || 0) + count;
        });
        
        // 감정 집계
        sentiments.push(analysis.sentiment.overall);
    });
    
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>📊 전체 인터뷰 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>총 인터뷰:</strong> ${interviews.length}건<br>
                <strong>발견된 주제:</strong> ${Object.keys(allThemes).length}개<br>
                <strong>총 키워드:</strong> ${Object.keys(allKeywords).length}개
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>🏷️ 공통 주제 (2회 이상 언급)</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${Object.entries(allThemes)
                    .filter(([,count]) => count >= 2)
                    .sort(([,a], [,b]) => b - a)
                    .map(([theme, count]) => 
                        `<span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 15px; margin: 3px; display: inline-block;">
                            ${escapeHtml(theme)} (${count})
                        </span>`
                    ).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>💭 상위 키워드</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${Object.entries(allKeywords)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 20)
                    .map(([keyword, count]) => 
                        `<div style="margin: 3px 0;">${escapeHtml(keyword)}: ${count}회</div>`
                    ).join('')}
            </div>
        </div>
        
        <div>
            <h4>😊 감정 분포</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateSentimentDistribution(sentiments)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '전체 인터뷰 비교 분석',
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
 * 감정 분포 생성
 */
function generateSentimentDistribution(sentiments) {
    const counts = sentiments.reduce((acc, sentiment) => {
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
    }, {});
    
    const total = sentiments.length;
    
    return Object.entries(counts)
        .map(([sentiment, count]) => {
            const percent = Math.round((count / total) * 100);
            return `<div style="margin: 5px 0;">${sentiment}: ${count}건 (${percent}%)</div>`;
        }).join('');
}

/**
 * 인터뷰 데이터 내보내기
 */
function exportInterviews() {
    const interviews = getData('interviews');
    
    if (isEmpty(interviews)) {
        showError('내보낼 인터뷰 데이터가 없습니다.');
        return;
    }
    
    const exportData = {
        exportDate: getCurrentTimestamp(),
        type: 'interviews',
        count: interviews.length,
        data: interviews
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `interviews_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showSaveStatus('인터뷰 데이터가 내보내졌습니다.');
}