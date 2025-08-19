// =========================
// 포토다이어리 모듈
// =========================

/**
 * 사진 업로드 처리
 */
function handlePhotoUpload(event) {
    const files = event.target.files;
    const photoGrid = document.getElementById('photoGrid');
    
    if (!photoGrid) return;

    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                photoItem.style.backgroundImage = `url(${e.target.result})`;
                photoItem.style.backgroundSize = 'cover';
                photoItem.style.backgroundPosition = 'center';
                photoItem.title = file.name;
                photoItem.setAttribute('data-filename', file.name);
                photoItem.setAttribute('data-filesize', file.size);
                
                // 삭제 버튼 추가
                const deleteBtn = document.createElement('div');
                deleteBtn.innerHTML = '×';
                deleteBtn.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    text-align: center;
                    line-height: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #e74c3c;
                    font-weight: bold;
                `;
                
                deleteBtn.onclick = function() {
                    photoItem.remove();
                };
                
                // 확대 보기 기능
                photoItem.onclick = function() {
                    showPhotoModal(e.target.result, file.name);
                };
                
                photoItem.appendChild(deleteBtn);
                photoGrid.appendChild(photoItem);
            };
            reader.readAsDataURL(file);
        } else {
            showError(`${file.name}은(는) 지원되지 않는 파일 형식입니다.`);
        }
    });
    
    // 파일 입력 초기화
    event.target.value = '';
}

/**
 * 사진 모달 표시
 */
function showPhotoModal(imageSrc, filename) {
    const content = `
        <div style="text-align: center;">
            <img src="${imageSrc}" style="max-width: 100%; max-height: 70vh; border-radius: 8px;" alt="${escapeHtml(filename)}">
            <div style="margin-top: 15px; color: #6c757d; font-size: 0.9rem;">
                ${escapeHtml(filename)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '사진 보기',
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
 * 포토다이어리 저장
 */
function savePhotoDiary() {
    const description = document.getElementById('photoDescription').value;
    const emotion = document.getElementById('photoEmotion').value;
    const context = document.getElementById('photoContext').value;
    const photoItems = document.querySelectorAll('#photoGrid .photo-item');

    if (!description.trim()) {
        showError('사진 설명을 입력해주세요.');
        return;
    }

    if (photoItems.length === 0) {
        showError('최소 한 장의 사진을 업로드해주세요.');
        return;
    }

    // 사진 정보 수집
    const photos = Array.from(photoItems).map(item => ({
        filename: item.getAttribute('data-filename'),
        filesize: parseInt(item.getAttribute('data-filesize')),
        backgroundImage: item.style.backgroundImage
    }));

    const data = {
        description: description.trim(),
        emotion: emotion,
        context: context.trim(),
        photoCount: photos.length,
        photos: photos
    };

    const savedDiary = addPhotoDiary(data);
    updateStats();
    updateAllLists();
    showSaveStatus('포토다이어리가 저장되었습니다');
    clearPhotoForm();
    
    return savedDiary;
}

/**
 * 포토다이어리 폼 초기화
 */
function clearPhotoForm() {
    clearFormData(['photoDescription', 'photoContext']);
    document.getElementById('photoEmotion').selectedIndex = 0;
    document.getElementById('photoGrid').innerHTML = '';
}

/**
 * 포토다이어리 목록 업데이트
 */
function updatePhotoDiaryList() {
    const container = document.getElementById('photoDiaryList');
    if (!container) return;

    const diaries = getData('photoDiaries');
    container.innerHTML = '';

    if (isEmpty(diaries)) {
        container.appendChild(renderEmptyState('아직 포토다이어리 기록이 없습니다.'));
        return;
    }

    const sortedDiaries = safeSortByDate(diaries, 'timestamp', false);

    sortedDiaries.slice(0, 5).forEach(diary => {
        const item = renderPhotoDiaryItem(diary);
        container.appendChild(item);
    });
}

/**
 * 포토다이어리 아이템 렌더링
 */
function renderPhotoDiaryItem(diary) {
    const item = document.createElement('div');
    item.className = 'idea-item photo-diary-item';
    item.setAttribute('data-id', diary.id);
    
    // 감정에 따른 이모지
    const emotionEmoji = {
        '매우 긍정적': '😊',
        '긍정적': '🙂',
        '중립적': '😐',
        '부정적': '🙁',
        '매우 부정적': '😢'
    };
    
    const emoji = emotionEmoji[diary.emotion] || '📷';
    
    item.innerHTML = `
        <div class="idea-header">
            <h4>${emoji} 포토다이어리</h4>
            <span class="idea-category">${diary.emotion || '감정 미기록'}</span>
        </div>
        <div class="photo-diary-photos" style="margin: 10px 0;">
            ${renderPhotoThumbnails(diary.photos || [])}
        </div>
        <div class="idea-description">${escapeHtml(diary.description)}</div>
        <div class="idea-meta">
            <span>${formatDateKorean(diary.timestamp)}</span>
            ${diary.context ? ` • ${escapeHtml(diary.context)}` : ''}
            • 사진 ${diary.photoCount || 0}장
        </div>
        <div class="photo-diary-actions" style="margin-top: 10px; text-align: right;">
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px;" 
                    onclick="viewPhotoDiaryDetails('${diary.id}')">상세보기</button>
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-left: 5px;" 
                    onclick="analyzePhotoDiary('${diary.id}')">감정분석</button>
        </div>
    `;
    
    return item;
}

/**
 * 사진 썸네일 렌더링
 */
function renderPhotoThumbnails(photos) {
    if (!photos || photos.length === 0) {
        return '<div style="color: #6c757d; font-style: italic;">사진 없음</div>';
    }
    
    return photos.slice(0, 3).map(photo => 
        `<div style="
            display: inline-block; 
            width: 40px; 
            height: 40px; 
            margin-right: 5px; 
            border-radius: 4px; 
            overflow: hidden;
            ${photo.backgroundImage ? `background: ${photo.backgroundImage};` : 'background: #e9ecef;'}
            background-size: cover; 
            background-position: center;
            cursor: pointer;
        " title="${escapeHtml(photo.filename || 'photo')}" 
           onclick="showPhotoModal('${photo.backgroundImage?.replace(/url\((['"])(.*?)\1\)/, '$2')}', '${escapeHtml(photo.filename || 'photo')}')"></div>`
    ).join('') + (photos.length > 3 ? `<span style="color: #6c757d; font-size: 0.8rem;">+${photos.length - 3}장 더</span>` : '');
}

/**
 * 포토다이어리 상세보기
 */
function viewPhotoDiaryDetails(diaryId) {
    const diaries = getData('photoDiaries');
    const diary = diaries.find(item => item.id === diaryId);
    
    if (!diary) {
        showError('포토다이어리를 찾을 수 없습니다.');
        return;
    }

    const content = `
        <div style="margin-bottom: 20px;">
            <h4>📷 사진들</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${renderFullPhotoGallery(diary.photos || [])}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📝 설명</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
                ${escapeHtml(diary.description)}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>😊 감정 상태</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${diary.emotion || '기록되지 않음'}
            </div>
        </div>
        
        ${diary.context ? `
        <div style="margin-bottom: 20px;">
            <h4>📍 맥락 정보</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${escapeHtml(diary.context)}
            </div>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
            <h4>⏰ 기록 시간</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${formatDateKorean(diary.timestamp)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '포토다이어리 상세',
        content,
        [
            {
                text: '감정 분석',
                class: 'btn-primary',
                onclick: `ModalManager.close(this.closest('.modal-overlay')); analyzePhotoDiary('${diaryId}');`
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
 * 전체 사진 갤러리 렌더링
 */
function renderFullPhotoGallery(photos) {
    if (!photos || photos.length === 0) {
        return '<div style="color: #6c757d; font-style: italic;">사진이 없습니다.</div>';
    }
    
    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;">
            ${photos.map(photo => 
                `<div style="
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    ${photo.backgroundImage ? `background: ${photo.backgroundImage};` : 'background: #e9ecef;'}
                    background-size: cover;
                    background-position: center;
                " title="${escapeHtml(photo.filename || 'photo')}" 
                   onclick="showPhotoModal('${photo.backgroundImage?.replace(/url\((['"])(.*?)\1\)/, '$2')}', '${escapeHtml(photo.filename || 'photo')}')"></div>`
            ).join('')}
        </div>
    `;
}

/**
 * 포토다이어리 감정 분석
 */
function analyzePhotoDiary(diaryId) {
    const diaries = getData('photoDiaries');
    const diary = diaries.find(item => item.id === diaryId);
    
    if (!diary) {
        showError('포토다이어리를 찾을 수 없습니다.');
        return;
    }

    const analysis = performEmotionAnalysis(diary);
    
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>😊 감정 분석 결과</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>기록된 감정:</strong> ${diary.emotion || '없음'}<br>
                <strong>텍스트 분석 감정:</strong> ${analysis.textEmotion}<br>
                <strong>감정 일치도:</strong> ${analysis.consistency}%<br>
                <strong>감정 강도:</strong> ${analysis.intensity}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📝 텍스트 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>긍정 키워드:</strong> ${analysis.positiveKeywords.join(', ') || '없음'}<br>
                <strong>부정 키워드:</strong> ${analysis.negativeKeywords.join(', ') || '없음'}<br>
                <strong>감정 키워드:</strong> ${analysis.emotionKeywords.join(', ') || '없음'}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📊 감정 점수</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateEmotionScoreChart(analysis.scores)}
            </div>
        </div>
        
        <div>
            <h4>💡 인사이트</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateEmotionInsights(analysis)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '포토다이어리 감정 분석',
        content,
        [
            {
                text: '분석 결과 저장',
                class: 'btn-primary',
                onclick: `saveEmotionAnalysis('${diaryId}', ${JSON.stringify(analysis).replace(/"/g, '&quot;')}); ModalManager.close(this.closest('.modal-overlay'));`
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
 * 감정 분석 수행
 */
function performEmotionAnalysis(diary) {
    const text = diary.description.toLowerCase();
    
    // 감정 키워드 정의
    const emotionKeywords = {
        positive: ['좋', '행복', '기쁘', '즐거', '만족', '편안', '평화', '사랑', '웃', '신나'],
        negative: ['나쁘', '슬프', '화나', '짜증', '스트레스', '우울', '불안', '힘들', '아프', '외로'],
        neutral: ['그냥', '보통', '평범', '일반', '무난', '괜찮']
    };
    
    // 키워드 매칭
    const positiveKeywords = emotionKeywords.positive.filter(keyword => text.includes(keyword));
    const negativeKeywords = emotionKeywords.negative.filter(keyword => text.includes(keyword));
    const neutralKeywords = emotionKeywords.neutral.filter(keyword => text.includes(keyword));
    
    // 감정 점수 계산
    const scores = {
        positive: positiveKeywords.length,
        negative: negativeKeywords.length,
        neutral: neutralKeywords.length
    };
    
    // 텍스트 기반 감정 판단
    let textEmotion = '중립';
    if (scores.positive > scores.negative) {
        textEmotion = scores.positive > 2 ? '매우 긍정적' : '긍정적';
    } else if (scores.negative > scores.positive) {
        textEmotion = scores.negative > 2 ? '매우 부정적' : '부정적';
    }
    
    // 일치도 계산
    const recordedEmotion = diary.emotion || '중립적';
    const consistency = calculateEmotionConsistency(recordedEmotion, textEmotion);
    
    // 감정 강도 계산
    const totalEmotionWords = scores.positive + scores.negative;
    const intensity = totalEmotionWords > 3 ? '강함' : totalEmotionWords > 1 ? '보통' : '약함';
    
    return {
        textEmotion,
        consistency,
        intensity,
        positiveKeywords,
        negativeKeywords,
        emotionKeywords: [...positiveKeywords, ...negativeKeywords, ...neutralKeywords],
        scores
    };
}

/**
 * 감정 일치도 계산
 */
function calculateEmotionConsistency(recorded, analyzed) {
    const emotionMap = {
        '매우 긍정적': 5,
        '긍정적': 4,
        '중립적': 3,
        '부정적': 2,
        '매우 부정적': 1
    };
    
    const recordedValue = emotionMap[recorded] || 3;
    const analyzedValue = emotionMap[analyzed] || 3;
    
    const difference = Math.abs(recordedValue - analyzedValue);
    const maxDifference = 4; // 최대 차이 (5-1)
    
    return Math.round((1 - difference / maxDifference) * 100);
}

/**
 * 감정 점수 차트 생성
 */
function generateEmotionScoreChart(scores) {
    const total = scores.positive + scores.negative + scores.neutral || 1;
    
    return `
        <div style="display: flex; gap: 10px; align-items: center;">
            <div style="flex: 1;">
                <div style="display: flex; margin-bottom: 5px;">
                    <span style="width: 80px; font-size: 0.9rem;">긍정:</span>
                    <div style="flex: 1; background: #e9ecef; border-radius: 10px; overflow: hidden;">
                        <div style="background: #28a745; height: 20px; width: ${(scores.positive / total) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                    <span style="margin-left: 10px; font-size: 0.9rem;">${scores.positive}</span>
                </div>
                <div style="display: flex; margin-bottom: 5px;">
                    <span style="width: 80px; font-size: 0.9rem;">부정:</span>
                    <div style="flex: 1; background: #e9ecef; border-radius: 10px; overflow: hidden;">
                        <div style="background: #dc3545; height: 20px; width: ${(scores.negative / total) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                    <span style="margin-left: 10px; font-size: 0.9rem;">${scores.negative}</span>
                </div>
                <div style="display: flex;">
                    <span style="width: 80px; font-size: 0.9rem;">중립:</span>
                    <div style="flex: 1; background: #e9ecef; border-radius: 10px; overflow: hidden;">
                        <div style="background: #6c757d; height: 20px; width: ${(scores.neutral / total) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                    <span style="margin-left: 10px; font-size: 0.9rem;">${scores.neutral}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 감정 인사이트 생성
 */
function generateEmotionInsights(analysis) {
    const insights = [];
    
    if (analysis.consistency >= 80) {
        insights.push('기록된 감정과 텍스트 분석 결과가 매우 일치합니다.');
    } else if (analysis.consistency >= 60) {
        insights.push('기록된 감정과 텍스트 분석 결과가 어느 정도 일치합니다.');
    } else {
        insights.push('기록된 감정과 텍스트에서 분석된 감정에 차이가 있습니다.');
    }
    
    if (analysis.intensity === '강함') {
        insights.push('텍스트에서 강한 감정 표현이 발견되었습니다.');
    } else if (analysis.intensity === '약함') {
        insights.push('텍스트에서 감정 표현이 다소 제한적입니다.');
    }
    
    if (analysis.positiveKeywords.length > analysis.negativeKeywords.length) {
        insights.push('전반적으로 긍정적인 경험으로 기록되었습니다.');
    } else if (analysis.negativeKeywords.length > analysis.positiveKeywords.length) {
        insights.push('일부 부정적인 경험이 포함되어 있습니다.');
    }
    
    return insights.map(insight => `<div style="margin: 5px 0;">• ${insight}</div>`).join('');
}

/**
 * 감정 분석 결과 저장
 */
function saveEmotionAnalysis(diaryId, analysis) {
    const diaries = getData('photoDiaries');
    const diary = diaries.find(item => item.id === diaryId);
    
    if (diary) {
        diary.emotionAnalysis = analysis;
        diary.analyzedAt = getCurrentTimestamp();
        
        updateData('photoDiaries', diaryId, diary);
        showSaveStatus('감정 분석 결과가 저장되었습니다.');
    }
}

/**
 * 전체 포토다이어리 감정 분석
 */
function analyzeAllPhotoDiaries() {
    const diaries = getData('photoDiaries');
    
    if (isEmpty(diaries)) {
        showError('분석할 포토다이어리가 없습니다.');
        return;
    }

    const overallAnalysis = performOverallEmotionAnalysis(diaries);
    
    const content = `
        <div style="margin-bottom: 20px;">
            <h4>📊 전체 감정 분석</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong>총 기록:</strong> ${diaries.length}건<br>
                <strong>주요 감정:</strong> ${overallAnalysis.dominantEmotion}<br>
                <strong>감정 변화:</strong> ${overallAnalysis.emotionTrend}<br>
                <strong>평균 감정 점수:</strong> ${overallAnalysis.averageScore}/5
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>😊 감정 분포</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateEmotionDistributionChart(overallAnalysis.emotionDistribution)}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>📈 시간별 감정 변화</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateEmotionTimelineChart(overallAnalysis.emotionTimeline)}
            </div>
        </div>
        
        <div>
            <h4>💭 주요 키워드</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${generateKeywordCloud(overallAnalysis.topKeywords)}
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '전체 포토다이어리 감정 분석',
        content,
        [
            {
                text: '분석 리포트 내보내기',
                class: 'btn-primary',
                onclick: `exportEmotionReport(${JSON.stringify(overallAnalysis).replace(/"/g, '&quot;')}); ModalManager.close(this.closest('.modal-overlay'));`
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
 * 전체 감정 분석 수행
 */
function performOverallEmotionAnalysis(diaries) {
    const emotionCounts = {};
    const emotionScores = [];
    const allKeywords = [];
    const emotionTimeline = [];
    
    // 감정 값 매핑
    const emotionValues = {
        '매우 부정적': 1,
        '부정적': 2,
        '중립적': 3,
        '긍정적': 4,
        '매우 긍정적': 5
    };
    
    diaries.forEach(diary => {
        // 감정 분포 계산
        const emotion = diary.emotion || '중립적';
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        
        // 감정 점수 수집
        emotionScores.push(emotionValues[emotion] || 3);
        
        // 타임라인 데이터
        emotionTimeline.push({
            date: diary.timestamp,
            emotion: emotion,
            score: emotionValues[emotion] || 3
        });
        
        // 키워드 수집
        if (diary.emotionAnalysis) {
            allKeywords.push(...diary.emotionAnalysis.emotionKeywords);
        }
    });
    
    // 주요 감정 계산
    const dominantEmotion = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '중립적';
    
    // 평균 감정 점수
    const averageScore = emotionScores.length > 0 ? 
        (emotionScores.reduce((a, b) => a + b, 0) / emotionScores.length).toFixed(1) : 3;
    
    // 감정 변화 트렌드
    const recentDiaries = diaries.slice(-5);
    const recentAverage = recentDiaries.length > 0 ?
        recentDiaries.reduce((sum, diary) => sum + (emotionValues[diary.emotion] || 3), 0) / recentDiaries.length : 3;
    
    let emotionTrend = '안정적';
    if (recentAverage > parseFloat(averageScore) + 0.5) {
        emotionTrend = '상승 중';
    } else if (recentAverage < parseFloat(averageScore) - 0.5) {
        emotionTrend = '하락 중';
    }
    
    // 상위 키워드
    const keywordCounts = {};
    allKeywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
    
    const topKeywords = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20);
    
    return {
        dominantEmotion,
        emotionTrend,
        averageScore,
        emotionDistribution: emotionCounts,
        emotionTimeline: emotionTimeline.sort((a, b) => new Date(a.date) - new Date(b.date)),
        topKeywords
    };
}

/**
 * 감정 분포 차트 생성
 */
function generateEmotionDistributionChart(distribution) {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    return Object.entries(distribution)
        .map(([emotion, count]) => {
            const percentage = Math.round((count / total) * 100);
            return `
                <div style="display: flex; align-items: center; margin: 5px 0;">
                    <span style="width: 100px; font-size: 0.9rem;">${emotion}:</span>
                    <div style="flex: 1; background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 0 10px;">
                        <div style="background: #667eea; height: 20px; width: ${percentage}%; transition: width 0.3s ease;"></div>
                    </div>
                    <span style="font-size: 0.9rem;">${count}건 (${percentage}%)</span>
                </div>
            `;
        }).join('');
}

/**
 * 감정 타임라인 차트 생성
 */
function generateEmotionTimelineChart(timeline) {
    if (timeline.length === 0) return '<em>데이터가 없습니다.</em>';
    
    const maxScore = 5;
    const minScore = 1;
    
    return `
        <div style="display: flex; align-items: end; height: 100px; gap: 2px; overflow-x: auto;">
            ${timeline.map(item => {
                const height = ((item.score - minScore) / (maxScore - minScore)) * 80 + 10;
                const color = item.score >= 4 ? '#28a745' : item.score >= 3 ? '#ffc107' : '#dc3545';
                
                return `
                    <div style="
                        width: 8px; 
                        height: ${height}px; 
                        background: ${color}; 
                        border-radius: 2px;
                        flex-shrink: 0;
                    " title="${formatDateKorean(item.date)}: ${item.emotion}"></div>
                `;
            }).join('')}
        </div>
        <div style="margin-top: 10px; font-size: 0.8rem; color: #6c757d;">
            시간 순서대로 감정 변화 (빨강: 부정, 노랑: 중립, 초록: 긍정)
        </div>
    `;
}

/**
 * 키워드 클라우드 생성
 */
function generateKeywordCloud(topKeywords) {
    if (topKeywords.length === 0) return '<em>키워드가 없습니다.</em>';
    
    const maxCount = topKeywords[0]?.[1] || 1;
    
    return topKeywords.map(([keyword, count]) => {
        const size = Math.max(0.8, (count / maxCount) * 1.5);
        return `
            <span style="
                display: inline-block; 
                margin: 3px; 
                padding: 4px 8px; 
                background: rgba(102, 126, 234, 0.1); 
                border-radius: 12px; 
                font-size: ${size}rem;
                color: #667eea;
            ">${escapeHtml(keyword)} (${count})</span>
        `;
    }).join('');
}

/**
 * 감정 분석 리포트 내보내기
 */
function exportEmotionReport(analysisData) {
    const diaries = getData('photoDiaries');
    
    const reportData = {
        exportDate: getCurrentTimestamp(),
        type: 'emotion_analysis_report',
        summary: analysisData,
        diaries: diaries
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showSaveStatus('감정 분석 리포트가 내보내졌습니다.');
}