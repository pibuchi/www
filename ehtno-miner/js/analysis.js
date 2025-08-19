// =========================
// 통합 분석 모듈 (수정된 버전)
// =========================

/**
 * 통합 분석 보고서 생성
 */
function generateIntegratedReport() {
    try {
        const stats = getDataStats();
        const totalData = stats.totalDataPoints;

        if (totalData === 0) {
            showError('분석할 데이터가 없습니다.');
            return;
        }

        const analysisResult = performTriangulationAnalysis();
        
        // 통계 업데이트
        updateIntegratedAnalysisStats(analysisResult);
        
        // 보고서 콘텐츠 생성
        const reportContent = generateReportContent(analysisResult);
        
        const reportContainer = document.getElementById('integratedReport');
        const reportContentElement = document.getElementById('reportContent');
        
        if (reportContentElement && reportContainer) {
            reportContentElement.innerHTML = reportContent;
            reportContainer.style.display = 'block';
        }
        
        showSaveStatus('통합 분석 보고서가 생성되었습니다.');
    } catch (error) {
        console.error('통합 분석 중 오류:', error);
        showError('통합 분석 중 오류가 발생했습니다.');
    }
}

/**
 * 삼각측정법 분석 수행
 */
function performTriangulationAnalysis() {
    try {
        const observations = getData('observations') || [];
        const interviews = getData('interviews') || [];
        const shadowTracking = getData('shadowTracking') || [];
        const photoDiaries = getData('photoDiaries') || [];
        const ideas = getData('ideas') || [];
        
        // 공통 주제 분석
        const commonThemes = findCommonThemes({
            observations,
            interviews,
            shadowTracking,
            photoDiaries,
            ideas
        });
        
        // 데이터 일관성 분석
        const consistency = calculateDataConsistency({
            observations,
            interviews,
            shadowTracking,
            photoDiaries,
            ideas
        });
        
        // 시간적 패턴 분석
        const temporalPatterns = analyzeTemporalPatterns({
            observations,
            interviews,
            shadowTracking,
            photoDiaries,
            ideas
        });
        
        // 인사이트 도출
        const insights = generateResearchInsights({
            observations,
            interviews,
            shadowTracking,
            photoDiaries,
            ideas,
            commonThemes,
            consistency,
            temporalPatterns
        });
        
        // 연구 진행도 계산
        const progress = calculateResearchProgress({
            observations,
            interviews,
            shadowTracking,
            photoDiaries,
            ideas
        });
        
        return {
            commonThemes,
            consistency,
            temporalPatterns,
            insights,
            progress,
            dataStats: getDataStats()
        };
    } catch (error) {
        console.error('삼각측정법 분석 중 오류:', error);
        throw error;
    }
}

/**
 * 공통 주제 찾기
 */
function findCommonThemes(datasets) {
    try {
        const themes = {
            locations: {},
            activities: {},
            emotions: {},
            keywords: {},
            timePatterns: {}
        };
        
        // 관찰조사에서 장소와 태그 추출
        if (datasets.observations && Array.isArray(datasets.observations)) {
            datasets.observations.forEach(obs => {
                if (obs.location) {
                    themes.locations[obs.location] = (themes.locations[obs.location] || 0) + 1;
                }
                if (obs.tags && Array.isArray(obs.tags)) {
                    obs.tags.forEach(tag => {
                        if (tag) {
                            themes.keywords[tag] = (themes.keywords[tag] || 0) + 1;
                        }
                    });
                }
            });
        }
        
        // 쉐도우 트래킹에서 활동과 장소 추출
        if (datasets.shadowTracking && Array.isArray(datasets.shadowTracking)) {
            datasets.shadowTracking.forEach(activity => {
                if (activity.location) {
                    themes.locations[activity.location] = (themes.locations[activity.location] || 0) + 1;
                }
                if (activity.activity) {
                    const activityType = safeategorizeActivity(activity.activity);
                    themes.activities[activityType] = (themes.activities[activityType] || 0) + 1;
                }
            });
        }
        
        // 포토다이어리에서 감정 추출
        if (datasets.photoDiaries && Array.isArray(datasets.photoDiaries)) {
            datasets.photoDiaries.forEach(diary => {
                if (diary.emotion) {
                    themes.emotions[diary.emotion] = (themes.emotions[diary.emotion] || 0) + 1;
                }
            });
        }
        
        // 인터뷰에서 키워드 추출
        if (datasets.interviews && Array.isArray(datasets.interviews)) {
            datasets.interviews.forEach(interview => {
                if (interview.themes) {
                    const words = interview.themes.toLowerCase().split(/[,\s]+/);
                    words.forEach(word => {
                        if (word && word.length > 1) {
                            themes.keywords[word] = (themes.keywords[word] || 0) + 1;
                        }
                    });
                }
            });
        }
        
        // 상위 주제만 반환
        return {
            topLocations: Object.entries(themes.locations).sort(([,a], [,b]) => b - a).slice(0, 5),
            topActivities: Object.entries(themes.activities).sort(([,a], [,b]) => b - a).slice(0, 5),
            topEmotions: Object.entries(themes.emotions).sort(([,a], [,b]) => b - a).slice(0, 3),
            topKeywords: Object.entries(themes.keywords).sort(([,a], [,b]) => b - a).slice(0, 10)
        };
    } catch (error) {
        console.error('공통 주제 분석 중 오류:', error);
        return {
            topLocations: [],
            topActivities: [],
            topEmotions: [],
            topKeywords: []
        };
    }
}

/**
 * 안전한 활동 분류 함수
 */
function safeategorizeActivity(activityText) {
    if (!activityText || typeof activityText !== 'string') {
        return '기타';
    }
    
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
 * 데이터 일관성 계산
 */
function calculateDataConsistency(datasets) {
    try {
        const consistencyMetrics = {
            locationConsistency: 0,
            timeConsistency: 0,
            themeConsistency: 0,
            overall: 0
        };
        
        // 장소 일관성
        const obsLocations = new Set();
        const shadowLocations = new Set();
        
        if (datasets.observations && Array.isArray(datasets.observations)) {
            datasets.observations.forEach(obs => {
                if (obs.location) obsLocations.add(obs.location);
            });
        }
        
        if (datasets.shadowTracking && Array.isArray(datasets.shadowTracking)) {
            datasets.shadowTracking.forEach(act => {
                if (act.location) shadowLocations.add(act.location);
            });
        }
        
        if (obsLocations.size > 0 && shadowLocations.size > 0) {
            const intersection = new Set([...obsLocations].filter(x => shadowLocations.has(x)));
            consistencyMetrics.locationConsistency = Math.round((intersection.size / Math.max(obsLocations.size, shadowLocations.size)) * 100);
        }
        
        // 시간 일관성
        const allTimes = [];
        
        if (datasets.observations && Array.isArray(datasets.observations)) {
            datasets.observations.forEach(obs => {
                if (obs.time || obs.timestamp) {
                    allTimes.push(obs.time || obs.timestamp);
                }
            });
        }
        
        if (datasets.shadowTracking && Array.isArray(datasets.shadowTracking)) {
            datasets.shadowTracking.forEach(act => {
                if (act.startTime) allTimes.push(act.startTime);
            });
        }
        
        if (datasets.photoDiaries && Array.isArray(datasets.photoDiaries)) {
            datasets.photoDiaries.forEach(diary => {
                if (diary.timestamp) allTimes.push(diary.timestamp);
            });
        }
        
        if (datasets.interviews && Array.isArray(datasets.interviews)) {
            datasets.interviews.forEach(interview => {
                if (interview.timestamp) allTimes.push(interview.timestamp);
            });
        }
        
        if (allTimes.length > 1) {
            const hourDistribution = {};
            allTimes.forEach(time => {
                try {
                    const hour = new Date(time).getHours();
                    if (!isNaN(hour)) {
                        hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;
                    }
                } catch (e) {
                    console.warn('시간 파싱 오류:', time);
                }
            });
            
            const consistentHours = Object.values(hourDistribution).filter(count => count > 1).length;
            consistencyMetrics.timeConsistency = Math.round((consistentHours / 24) * 100);
        }
        
        // 주제 일관성
        const allKeywords = [];
        
        if (datasets.observations && Array.isArray(datasets.observations)) {
            datasets.observations.forEach(obs => {
                if (obs.tags && Array.isArray(obs.tags)) {
                    allKeywords.push(...obs.tags);
                }
            });
        }
        
        if (datasets.interviews && Array.isArray(datasets.interviews)) {
            datasets.interviews.forEach(interview => {
                if (interview.themes) {
                    const themes = interview.themes.split(/[,\s]+/);
                    allKeywords.push(...themes);
                }
            });
        }
        
        if (allKeywords.length > 0) {
            const keywordCounts = {};
            allKeywords.forEach(keyword => {
                if (keyword) {
                    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
                }
            });
            
            const repeatedKeywords = Object.values(keywordCounts).filter(count => count > 1).length;
            const totalKeywords = Object.keys(keywordCounts).length;
            if (totalKeywords > 0) {
                consistencyMetrics.themeConsistency = Math.round((repeatedKeywords / totalKeywords) * 100);
            }
        }
        
        // 전체 일관성
        const metrics = [consistencyMetrics.locationConsistency, consistencyMetrics.timeConsistency, consistencyMetrics.themeConsistency];
        const validMetrics = metrics.filter(metric => metric > 0);
        consistencyMetrics.overall = validMetrics.length > 0 ? Math.round(validMetrics.reduce((a, b) => a + b, 0) / validMetrics.length) : 0;
        
        return consistencyMetrics;
    } catch (error) {
        console.error('데이터 일관성 계산 중 오류:', error);
        return {
            locationConsistency: 0,
            timeConsistency: 0,
            themeConsistency: 0,
            overall: 0
        };
    }
}

/**
 * 시간적 패턴 분석
 */
function analyzeTemporalPatterns(datasets) {
    try {
        const patterns = {
            dataCollectionTrend: [],
            hourlyDistribution: {},
            weeklyDistribution: {},
            dataGaps: []
        };
        
        // 모든 데이터의 타임스탬프 수집
        const allData = [];
        
        if (datasets.observations && Array.isArray(datasets.observations)) {
            allData.push(...datasets.observations.map(item => ({ ...item, type: 'observation' })));
        }
        
        if (datasets.interviews && Array.isArray(datasets.interviews)) {
            allData.push(...datasets.interviews.map(item => ({ ...item, type: 'interview' })));
        }
        
        if (datasets.shadowTracking && Array.isArray(datasets.shadowTracking)) {
            allData.push(...datasets.shadowTracking.map(item => ({ ...item, type: 'shadowTracking' })));
        }
        
        if (datasets.photoDiaries && Array.isArray(datasets.photoDiaries)) {
            allData.push(...datasets.photoDiaries.map(item => ({ ...item, type: 'photoDiary' })));
        }
        
        if (datasets.ideas && Array.isArray(datasets.ideas)) {
            allData.push(...datasets.ideas.map(item => ({ ...item, type: 'idea' })));
        }
        
        // 날짜별 데이터 수집 트렌드
        const dailyCounts = {};
        allData.forEach(item => {
            try {
                const date = new Date(item.timestamp).toDateString();
                dailyCounts[date] = (dailyCounts[date] || 0) + 1;
            } catch (e) {
                console.warn('날짜 파싱 오류:', item.timestamp);
            }
        });
        
        patterns.dataCollectionTrend = Object.entries(dailyCounts)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, count]) => ({ date, count }));
        
        // 시간별 분포
        allData.forEach(item => {
            try {
                const hour = new Date(item.timestamp).getHours();
                if (!isNaN(hour)) {
                    patterns.hourlyDistribution[hour] = (patterns.hourlyDistribution[hour] || 0) + 1;
                }
            } catch (e) {
                console.warn('시간 파싱 오류:', item.timestamp);
            }
        });
        
        // 요일별 분포
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        allData.forEach(item => {
            try {
                const dayOfWeek = dayNames[new Date(item.timestamp).getDay()];
                if (dayOfWeek) {
                    patterns.weeklyDistribution[dayOfWeek] = (patterns.weeklyDistribution[dayOfWeek] || 0) + 1;
                }
            } catch (e) {
                console.warn('요일 파싱 오류:', item.timestamp);
            }
        });
        
        // 데이터 수집 간격 분석
        if (patterns.dataCollectionTrend.length > 1) {
            const dates = patterns.dataCollectionTrend.map(item => new Date(item.date));
            const gaps = [];
            
            for (let i = 1; i < dates.length; i++) {
                const daysDiff = Math.floor((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24));
                if (daysDiff > 3) {
                    gaps.push({
                        from: dates[i-1].toDateString(),
                        to: dates[i].toDateString(),
                        days: daysDiff
                    });
                }
            }
            patterns.dataGaps = gaps;
        }
        
        return patterns;
    } catch (error) {
        console.error('시간적 패턴 분석 중 오류:', error);
        return {
            dataCollectionTrend: [],
            hourlyDistribution: {},
            weeklyDistribution: {},
            dataGaps: []
        };
    }
}

/**
 * 연구 인사이트 생성
 */
function generateResearchInsights(data) {
    try {
        const insights = [];
        
        // 데이터 수집 패턴 인사이트
        const totalData = data.dataStats ? data.dataStats.totalDataPoints : 0;
        if (totalData > 50) {
            insights.push({
                type: 'positive',
                category: '데이터 수집',
                message: `총 ${totalData}개의 풍부한 데이터가 수집되었습니다.`
            });
        } else if (totalData < 20 && totalData > 0) {
            insights.push({
                type: 'warning',
                category: '데이터 수집',
                message: '더 많은 데이터 수집이 필요합니다. 다양한 연구 기법을 활용해보세요.'
            });
        }
        
        // 연구 기법 균형성 인사이트
        if (data.dataStats) {
            const methodCounts = [
                data.dataStats.totalObservations || 0,
                data.dataStats.totalInterviews || 0,
                data.dataStats.totalShadowActivities || 0,
                data.dataStats.totalPhotoDiaries || 0,
                data.dataStats.totalIdeas || 0
            ];
            
            const maxMethod = Math.max(...methodCounts);
            const minMethod = Math.min(...methodCounts.filter(count => count > 0));
            
            if (maxMethod > 0 && minMethod > 0 && maxMethod > minMethod * 3) {
                insights.push({
                    type: 'info',
                    category: '연구 균형',
                    message: '특정 연구 기법에 치우쳐 있습니다. 다른 기법들도 균형있게 활용해보세요.'
                });
            } else if (methodCounts.filter(count => count > 0).length >= 3) {
                insights.push({
                    type: 'positive',
                    category: '연구 균형',
                    message: '다양한 연구 기법이 균형있게 활용되고 있습니다.'
                });
            }
        }
        
        // 일관성 인사이트
        if (data.consistency && data.consistency.overall > 70) {
            insights.push({
                type: 'positive',
                category: '데이터 일관성',
                message: `데이터 일관성이 ${data.consistency.overall}%로 높습니다. 신뢰도가 우수합니다.`
            });
        } else if (data.consistency && data.consistency.overall < 40 && data.consistency.overall > 0) {
            insights.push({
                type: 'warning',
                category: '데이터 일관성',
                message: '데이터 간 일관성이 낮습니다. 연구 설계를 재검토해보세요.'
            });
        }
        
        // 공통 주제 인사이트
        if (data.commonThemes && data.commonThemes.topKeywords && data.commonThemes.topKeywords.length > 0) {
            const topKeyword = data.commonThemes.topKeywords[0];
            insights.push({
                type: 'info',
                category: '주요 주제',
                message: `"${topKeyword[0]}"이(가) 가장 빈번하게 언급되는 주제입니다. (${topKeyword[1]}회)`
            });
        }
        
        // 시간적 패턴 인사이트
        if (data.temporalPatterns && data.temporalPatterns.dataGaps && data.temporalPatterns.dataGaps.length > 0) {
            insights.push({
                type: 'warning',
                category: '수집 패턴',
                message: `${data.temporalPatterns.dataGaps.length}개의 데이터 수집 공백 기간이 있습니다.`
            });
        }
        
        // 감정 패턴 인사이트
        if (data.commonThemes && data.commonThemes.topEmotions && data.commonThemes.topEmotions.length > 0) {
            const dominantEmotion = data.commonThemes.topEmotions[0];
            insights.push({
                type: 'info',
                category: '감정 패턴',
                message: `주요 감정 상태는 "${dominantEmotion[0]}"입니다. (${dominantEmotion[1]}회 기록)`
            });
        }
        
        return insights;
    } catch (error) {
        console.error('연구 인사이트 생성 중 오류:', error);
        return [];
    }
}

/**
 * 연구 진행도 계산
 */
function calculateResearchProgress(datasets) {
    try {
        const weights = {
            observations: 20,
            interviews: 25,
            shadowTracking: 20,
            photoDiaries: 15,
            ideas: 20
        };
        
        const targets = {
            observations: 10,
            interviews: 5,
            shadowTracking: 15,
            photoDiaries: 8,
            ideas: 10
        };
        
        let totalProgress = 0;
        let totalWeight = 0;
        
        Object.keys(weights).forEach(method => {
            const count = (datasets[method] && Array.isArray(datasets[method])) ? datasets[method].length : 0;
            const target = targets[method];
            const methodProgress = Math.min((count / target) * 100, 100);
            
            totalProgress += methodProgress * weights[method];
            totalWeight += weights[method];
        });
        
        return Math.round(totalProgress / totalWeight);
    } catch (error) {
        console.error('연구 진행도 계산 중 오류:', error);
        return 0;
    }
}

/**
 * 통합 분석 통계 업데이트
 */
function updateIntegratedAnalysisStats(analysisResult) {
    try {
        const stats = analysisResult.dataStats || {};
        
        if (elementExists('totalDataPoints')) {
            document.getElementById('totalDataPoints').textContent = stats.totalDataPoints || 0;
        }
        if (elementExists('dataConsistency')) {
            document.getElementById('dataConsistency').textContent = (analysisResult.consistency ? analysisResult.consistency.overall : 0) + '%';
        }
        if (elementExists('keyInsights')) {
            document.getElementById('keyInsights').textContent = (analysisResult.insights ? analysisResult.insights.length : 0);
        }
        if (elementExists('researchProgress')) {
            document.getElementById('researchProgress').textContent = (analysisResult.progress || 0) + '%';
        }
    } catch (error) {
        console.error('통계 업데이트 중 오류:', error);
    }
}

/**
 * 보고서 콘텐츠 생성
 */
function generateReportContent(analysisResult) {
    try {
        const stats = analysisResult.dataStats || {};
        
        return `
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <h5>📈 데이터 수집 현황</h5>
                <ul style="line-height: 1.8; margin-top: 15px;">
                    <li>관찰조사: ${stats.totalObservations || 0}건</li>
                    <li>심층인터뷰: ${stats.totalInterviews || 0}건</li>
                    <li>쉐도우 트래킹: ${stats.totalShadowActivities || 0}건</li>
                    <li>포토다이어리: ${stats.totalPhotoDiaries || 0}건</li>
                    <li>아이디어: ${stats.totalIdeas || 0}건</li>
                </ul>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <h5>🔍 주요 발견사항</h5>
                ${generateCommonThemesSection(analysisResult.commonThemes || {})}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <h5>📊 데이터 일관성 분석</h5>
                ${generateConsistencyAnalysis(analysisResult.consistency || {})}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <h5>💡 연구 인사이트</h5>
                ${generateInsightsSection(analysisResult.insights || [])}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <h5>📋 권장사항</h5>
                ${generateRecommendations(analysisResult)}
            </div>
        `;
    } catch (error) {
        console.error('보고서 콘텐츠 생성 중 오류:', error);
        return '<div>보고서 생성 중 오류가 발생했습니다.</div>';
    }
}

/**
 * 공통 주제 섹션 생성
 */
function generateCommonThemesSection(themes) {
    try {
        const topLocations = themes.topLocations || [];
        const topActivities = themes.topActivities || [];
        const topEmotions = themes.topEmotions || [];
        const topKeywords = themes.topKeywords || [];
        
        return `
            <div style="margin-bottom: 15px;">
                <h6>📍 주요 장소</h6>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    ${topLocations.length > 0 ? 
                        topLocations.map(([location, count]) => 
                            `<span style="display: inline-block; margin: 3px; padding: 4px 8px; background: #e9ecef; border-radius: 12px; font-size: 0.8rem;">
                                ${escapeHtml(location)} (${count})
                            </span>`
                        ).join('') : 
                        '<em>공통 장소가 발견되지 않았습니다.</em>'
                    }
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h6>🎯 주요 활동</h6>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    ${topActivities.length > 0 ? 
                        topActivities.map(([activity, count]) => 
                            `<span style="display: inline-block; margin: 3px; padding: 4px 8px; background: #e9ecef; border-radius: 12px; font-size: 0.8rem;">
                                ${escapeHtml(activity)} (${count})
                            </span>`
                        ).join('') : 
                        '<em>공통 활동이 발견되지 않았습니다.</em>'
                    }
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h6>😊 주요 감정</h6>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    ${topEmotions.length > 0 ? 
                        topEmotions.map(([emotion, count]) => 
                            `<span style="display: inline-block; margin: 3px; padding: 4px 8px; background: #e9ecef; border-radius: 12px; font-size: 0.8rem;">
                                ${escapeHtml(emotion)} (${count})
                            </span>`
                        ).join('') : 
                        '<em>감정 데이터가 부족합니다.</em>'
                    }
                </div>
            </div>
            
            <div>
                <h6>🔑 핵심 키워드</h6>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    ${topKeywords.length > 0 ? 
                        topKeywords.slice(0, 8).map(([keyword, count]) => 
                            `<span style="display: inline-block; margin: 3px; padding: 4px 8px; background: #667eea; color: white; border-radius: 12px; font-size: 0.8rem;">
                                ${escapeHtml(keyword)} (${count})
                            </span>`
                        ).join('') : 
                        '<em>공통 키워드가 발견되지 않았습니다.</em>'
                    }
                </div>
            </div>
        `;
    } catch (error) {
        console.error('공통 주제 섹션 생성 중 오류:', error);
        return '<em>주제 분석 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 일관성 분석 생성
 */
function generateConsistencyAnalysis(consistency) {
    try {
        const locationConsistency = consistency.locationConsistency || 0;
        const timeConsistency = consistency.timeConsistency || 0;
        const themeConsistency = consistency.themeConsistency || 0;
        const overall = consistency.overall || 0;
        
        return `
            <div style="margin-bottom: 10px;">
                <strong>장소 일관성:</strong> ${locationConsistency}%
                <div style="background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 5px 0;">
                    <div style="background: #28a745; height: 15px; width: ${locationConsistency}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <strong>시간 일관성:</strong> ${timeConsistency}%
                <div style="background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 5px 0;">
                    <div style="background: #ffc107; height: 15px; width: ${timeConsistency}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <strong>주제 일관성:</strong> ${themeConsistency}%
                <div style="background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 5px 0;">
                    <div style="background: #17a2b8; height: 15px; width: ${themeConsistency}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                <strong>전체 일관성: ${overall}%</strong><br>
                <small style="color: #6c757d;">
                    ${overall >= 70 ? '높은 일관성: 데이터가 상호 보완적입니다.' :
                      overall >= 40 ? '보통 일관성: 추가 검증이 필요합니다.' :
                      '낮은 일관성: 연구 설계를 재검토하세요.'}
                </small>
            </div>
        `;
    } catch (error) {
        console.error('일관성 분석 생성 중 오류:', error);
        return '<em>일관성 분석 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 인사이트 섹션 생성
 */
function generateInsightsSection(insights) {
    try {
        if (!insights || insights.length === 0) {
            return '<em>생성된 인사이트가 없습니다.</em>';
        }
        
        const typeIcons = {
            positive: '✅',
            warning: '⚠️',
            info: 'ℹ️',
            negative: '❌'
        };
        
        const typeColors = {
            positive: '#d4edda',
            warning: '#fff3cd',
            info: '#d1ecf1',
            negative: '#f8d7da'
        };
        
        const typeBorderColors = {
            positive: '#28a745',
            warning: '#ffc107',
            info: '#17a2b8',
            negative: '#dc3545'
        };
        
        return insights.map(insight => {
            const icon = typeIcons[insight.type] || 'ℹ️';
            const bgColor = typeColors[insight.type] || '#f8f9fa';
            const borderColor = typeBorderColors[insight.type] || '#6c757d';
            
            return `
                <div style="
                    margin: 10px 0; 
                    padding: 12px; 
                    background: ${bgColor}; 
                    border-radius: 6px; 
                    border-left: 4px solid ${borderColor};
                ">
                    <strong>${icon} ${escapeHtml(insight.category)}:</strong><br>
                    ${escapeHtml(insight.message)}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('인사이트 섹션 생성 중 오류:', error);
        return '<em>인사이트 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 권장사항 생성
 */
function generateRecommendations(analysisResult) {
    try {
        const recommendations = [];
        
        // 데이터 수집 균형성 권장사항
        const stats = analysisResult.dataStats || {};
        const methods = [
            { name: '관찰조사', count: stats.totalObservations || 0 },
            { name: '인터뷰', count: stats.totalInterviews || 0 },
            { name: '쉐도우 트래킹', count: stats.totalShadowActivities || 0 },
            { name: '포토다이어리', count: stats.totalPhotoDiaries || 0 },
            { name: '아이디어', count: stats.totalIdeas || 0 }
        ];
        
        const methodsWithData = methods.filter(method => method.count > 0);
        if (methodsWithData.length > 0) {
            const minMethod = methodsWithData.reduce((min, method) => method.count < min.count ? method : min);
            if (minMethod.count < 3) {
                recommendations.push(`${minMethod.name} 데이터 수집을 늘려 연구의 균형성을 높이세요.`);
            }
        }
        
        // 일관성 개선 권장사항
        const consistency = analysisResult.consistency || {};
        if (consistency.overall < 60) {
            recommendations.push('데이터 간 일관성이 낮습니다. 연구 질문과 방법론을 재검토하세요.');
            
            if (consistency.locationConsistency < 40) {
                recommendations.push('같은 장소에서 다양한 연구 기법을 활용하여 장소별 심층 분석을 시도하세요.');
            }
            
            if (consistency.themeConsistency < 40) {
                recommendations.push('일관된 주제와 키워드를 중심으로 데이터 수집을 집중하세요.');
            }
        }
        
        // 진행도 기반 권장사항
        const progress = analysisResult.progress || 0;
        if (progress < 50) {
            recommendations.push('연구 진행도가 낮습니다. 더 체계적인 데이터 수집 계획을 수립하세요.');
        }
        
        // 시간적 패턴 기반 권장사항
        const temporalPatterns = analysisResult.temporalPatterns || {};
        if (temporalPatterns.dataGaps && temporalPatterns.dataGaps.length > 2) {
            recommendations.push('정기적인 데이터 수집 일정을 만들어 연속성을 확보하세요.');
        }
        
        // 기본 권장사항
        if (recommendations.length === 0) {
            recommendations.push('현재까지 양질의 연구가 진행되고 있습니다. 지속적인 데이터 수집과 분석을 이어가세요.');
            recommendations.push('수집된 데이터를 바탕으로 심층 분석과 패턴 발견에 집중하세요.');
        }
        
        return recommendations.map(rec => 
            `<div style="margin: 8px 0; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #28a745;">
                • ${escapeHtml(rec)}
            </div>`
        ).join('');
    } catch (error) {
        console.error('권장사항 생성 중 오류:', error);
        return '<div style="margin: 8px 0; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #28a745;">• 권장사항 생성 중 오류가 발생했습니다.</div>';
    }
}

/**
 * 데이터 내보내기
 */
function exportData() {
    try {
        const exportData = exportAllData();
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ethnography_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSaveStatus('데이터가 성공적으로 내보내졌습니다.');
    } catch (error) {
        console.error('데이터 내보내기 중 오류:', error);
        showError('데이터 내보내기 중 오류가 발생했습니다.');
    }
}

/**
 * 상세 분석 리포트 생성
 */
function generateDetailedAnalysisReport() {
    try {
        const analysisResult = performTriangulationAnalysis();
        
        const reportData = {
            exportDate: getCurrentTimestamp(),
            type: 'detailed_analysis_report',
            analysis: analysisResult,
            rawData: {
                observations: getData('observations') || [],
                interviews: getData('interviews') || [],
                shadowTracking: getData('shadowTracking') || [],
                photoDiaries: getData('photoDiaries') || [],
                ideas: getData('ideas') || []
            }
        };
        
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `detailed_analysis_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSaveStatus('상세 분석 리포트가 생성되었습니다.');
    } catch (error) {
        console.error('상세 분석 리포트 생성 중 오류:', error);
        showError('상세 분석 리포트 생성 중 오류가 발생했습니다.');
    }
}

/**
 * 분석 데이터 검증
 */
function validateAnalysisData() {
    try {
        const observations = getData('observations') || [];
        const interviews = getData('interviews') || [];
        const shadowTracking = getData('shadowTracking') || [];
        const photoDiaries = getData('photoDiaries') || [];
        const ideas = getData('ideas') || [];
        
        const validationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };
        
        // 최소 데이터 요구사항 검증
        const totalData = observations.length + interviews.length + shadowTracking.length + photoDiaries.length + ideas.length;
        if (totalData < 5) {
            validationResult.warnings.push('분석을 위해서는 최소 5개 이상의 데이터가 필요합니다.');
        }
        
        // 데이터 타입별 검증
        if (observations.length === 0) {
            validationResult.warnings.push('관찰조사 데이터가 없습니다.');
        }
        
        if (interviews.length === 0) {
            validationResult.warnings.push('인터뷰 데이터가 없습니다.');
        }
        
        // 데이터 무결성 검증
        const allData = [...observations, ...interviews, ...shadowTracking, ...photoDiaries, ...ideas];
        const invalidData = allData.filter(item => !item.timestamp || !item.id);
        
        if (invalidData.length > 0) {
            validationResult.errors.push(`${invalidData.length}개의 데이터에 필수 정보가 누락되었습니다.`);
            validationResult.isValid = false;
        }
        
        return validationResult;
    } catch (error) {
        console.error('데이터 검증 중 오류:', error);
        return {
            isValid: false,
            errors: ['데이터 검증 중 오류가 발생했습니다.'],
            warnings: []
        };
    }
}

/**
 * 빠른 분석 실행
 */
function runQuickAnalysis() {
    try {
        const validation = validateAnalysisData();
        
        if (!validation.isValid) {
            showError('데이터 검증 실패: ' + validation.errors.join(', '));
            return;
        }
        
        if (validation.warnings.length > 0) {
            console.warn('분석 경고:', validation.warnings);
        }
        
        const stats = getDataStats();
        const quickResult = {
            totalData: stats.totalDataPoints,
            methodBalance: calculateMethodBalance(stats),
            dataQuality: calculateDataQuality(),
            timeSpan: calculateTimeSpan()
        };
        
        // 빠른 결과 표시
        showQuickAnalysisResult(quickResult);
        
    } catch (error) {
        console.error('빠른 분석 중 오류:', error);
        showError('빠른 분석 중 오류가 발생했습니다.');
    }
}

/**
 * 방법론 균형 계산
 */
function calculateMethodBalance(stats) {
    const methods = [
        stats.totalObservations || 0,
        stats.totalInterviews || 0,
        stats.totalShadowActivities || 0,
        stats.totalPhotoDiaries || 0,
        stats.totalIdeas || 0
    ];
    
    const nonZeroMethods = methods.filter(count => count > 0);
    if (nonZeroMethods.length === 0) return 0;
    
    const avg = nonZeroMethods.reduce((a, b) => a + b, 0) / nonZeroMethods.length;
    const variance = nonZeroMethods.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / nonZeroMethods.length;
    
    // 균형도를 0-100 스케일로 변환 (낮은 분산 = 높은 균형)
    return Math.max(0, 100 - (variance / avg) * 20);
}

/**
 * 데이터 품질 계산
 */
function calculateDataQuality() {
    try {
        const allData = [
            ...getData('observations'),
            ...getData('interviews'),
            ...getData('shadowTracking'),
            ...getData('photoDiaries'),
            ...getData('ideas')
        ];
        
        if (allData.length === 0) return 0;
        
        let qualityScore = 0;
        let totalFields = 0;
        
        allData.forEach(item => {
            const fields = Object.keys(item);
            const filledFields = fields.filter(key => 
                item[key] !== null && 
                item[key] !== undefined && 
                item[key] !== '' && 
                (Array.isArray(item[key]) ? item[key].length > 0 : true)
            );
            
            qualityScore += filledFields.length;
            totalFields += fields.length;
        });
        
        return totalFields > 0 ? Math.round((qualityScore / totalFields) * 100) : 0;
    } catch (error) {
        console.error('데이터 품질 계산 중 오류:', error);
        return 0;
    }
}

/**
 * 시간 범위 계산
 */
function calculateTimeSpan() {
    try {
        const allData = [
            ...getData('observations'),
            ...getData('interviews'),
            ...getData('shadowTracking'),
            ...getData('photoDiaries'),
            ...getData('ideas')
        ];
        
        if (allData.length === 0) return '데이터 없음';
        
        const timestamps = allData.map(item => new Date(item.timestamp)).filter(date => !isNaN(date));
        if (timestamps.length === 0) return '유효한 날짜 없음';
        
        const earliest = new Date(Math.min(...timestamps));
        const latest = new Date(Math.max(...timestamps));
        const daysDiff = Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) return '1일';
        return `${daysDiff + 1}일`;
    } catch (error) {
        console.error('시간 범위 계산 중 오류:', error);
        return '계산 오류';
    }
}

/**
 * 빠른 분석 결과 표시
 */
function showQuickAnalysisResult(result) {
    const content = `
        <div style="text-align: center; padding: 20px;">
            <h4>📊 빠른 분석 결과</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 2rem; color: #667eea; font-weight: bold;">${result.totalData}</div>
                    <div style="color: #6c757d;">총 데이터</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 2rem; color: #28a745; font-weight: bold;">${Math.round(result.methodBalance)}%</div>
                    <div style="color: #6c757d;">방법론 균형</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 2rem; color: #ffc107; font-weight: bold;">${result.dataQuality}%</div>
                    <div style="color: #6c757d;">데이터 품질</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 1.5rem; color: #17a2b8; font-weight: bold;">${result.timeSpan}</div>
                    <div style="color: #6c757d;">수집 기간</div>
                </div>
            </div>
        </div>
    `;

    const modal = ModalManager.create(
        '빠른 분석 결과',
        content,
        [
            {
                text: '상세 분석 실행',
                class: 'btn-primary',
                onclick: `ModalManager.close(this.closest('.modal-overlay')); generateIntegratedReport();`
            },
            {
                text: '닫기',
                class: 'btn-secondary',
                onclick: `ModalManager.close(this.closest('.modal-overlay'))`
            }
        ]
    );
}