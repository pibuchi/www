// =========================
// 웹크롤링 모듈
// =========================

// 크롤링 상태 관리
let crawlingState = {
    isRunning: false,
    progress: 0,
    collectedData: [],
    currentUrl: '',
    totalTargets: 0
};

/**
 * 웹크롤링 시작
 */
function startWebCrawling() {
    try {
        const url = document.getElementById('crawlUrl')?.value?.trim();
        const type = document.getElementById('crawlType')?.value || 'social_media';
        const keywords = document.getElementById('crawlKeywords')?.value?.trim();
        const maxResults = parseInt(document.getElementById('crawlMaxResults')?.value) || 100;

        if (!url) {
            showError('크롤링할 URL을 입력해주세요.');
            return;
        }

        if (!isValidUrl(url)) {
            showError('유효한 URL을 입력해주세요.');
            return;
        }

        // 크롤링 설정
        const crawlConfig = {
            url: url,
            type: type,
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
            maxResults: maxResults,
            startTime: getCurrentTimestamp()
        };

        console.log('크롤링 시작:', crawlConfig);

        // 크롤링 상태 초기화
        crawlingState = {
            isRunning: true,
            progress: 0,
            collectedData: [],
            currentUrl: url,
            totalTargets: maxResults
        };

        // UI 업데이트
        updateCrawlingUI();
        showCrawlingStatus('크롤링을 시작합니다...', 'running');

        // 시뮬레이션된 크롤링 실행 (실제 환경에서는 백엔드 API 호출)
        simulateCrawling(crawlConfig);

    } catch (error) {
        console.error('웹크롤링 시작 중 오류:', error);
        showError('웹크롤링 시작 중 오류가 발생했습니다.');
    }
}

/**
 * URL 유효성 검증
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * 크롤링 시뮬레이션 (데모용)
 */
function simulateCrawling(config) {
    const sampleData = generateSampleCrawlData(config);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
        if (currentIndex >= sampleData.length || !crawlingState.isRunning) {
            clearInterval(interval);
            completeCrawling();
            return;
        }

        // 데이터 추가
        const newData = sampleData[currentIndex];
        crawlingState.collectedData.push(newData);
        
        // 진행률 업데이트
        crawlingState.progress = Math.min(((currentIndex + 1) / config.maxResults) * 100, 100);
        
        // UI 업데이트
        updateCrawlingProgress();
        
        currentIndex++;
        
        // 진행 상황 표시
        if (currentIndex % 10 === 0) {
            showCrawlingStatus(`${currentIndex}개 데이터 수집 완료...`, 'running');
        }
        
    }, 200); // 200ms 간격으로 데이터 수집 시뮬레이션
}

/**
 * 샘플 크롤링 데이터 생성
 */
function generateSampleCrawlData(config) {
    const sampleTexts = [
        "에스노그라피 연구 방법론이 정말 흥미롭네요!",
        "사용자 조사를 통해 많은 인사이트를 얻었습니다.",
        "디지털 에스노그라피의 가능성을 탐구하고 있습니다.",
        "온라인 커뮤니티 문화 연구는 매우 중요한 분야입니다.",
        "소셜미디어 데이터 분석을 통한 사회 현상 이해",
        "질적 연구와 양적 연구의 융합이 필요한 시점입니다.",
        "사용자 경험 연구에서 에스노그라피의 역할",
        "디지털 네이티브 세대의 온라인 행동 패턴 분석",
        "크라우드소싱을 통한 집단지성 연구",
        "빅데이터와 에스노그라피의 만남"
    ];

    const sampleAuthors = ['user001', 'researcher_kim', 'student_park', 'prof_lee', 'analyst_choi'];
    const sampleSources = ['twitter.com', 'facebook.com', 'naver.com', 'reddit.com', 'medium.com'];
    
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < Math.min(config.maxResults, 50); i++) {
        const randomDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        data.push({
            id: generateId(),
            url: config.url,
            type: config.type,
            content: {
                text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
                author: sampleAuthors[Math.floor(Math.random() * sampleAuthors.length)],
                publishDate: randomDate.toISOString(),
                source: sampleSources[Math.floor(Math.random() * sampleSources.length)]
            },
            metrics: {
                likes: Math.floor(Math.random() * 100),
                shares: Math.floor(Math.random() * 50),
                comments: Math.floor(Math.random() * 30)
            },
            analysis: {
                sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
                keywords: extractKeywords(sampleTexts[i % sampleTexts.length]),
                language: 'ko'
            },
            timestamp: getCurrentTimestamp()
        });
    }
    
    return data;
}

/**
 * 키워드 추출 (간단한 버전)
 */
function extractKeywords(text) {
    const commonWords = ['이', '가', '를', '을', '에', '의', '와', '과', '는', '은', '로', '으로', '에서', '부터', '까지', '만', '도', '라서', '하고', '그리고', '하지만', '그러나'];
    const words = text.split(/\s+/)
        .map(word => word.replace(/[^\w가-힣]/g, ''))
        .filter(word => word.length >= 2 && !commonWords.includes(word));
    
    return [...new Set(words)].slice(0, 5);
}

/**
 * 크롤링 완료 처리
 */
function completeCrawling() {
    try {
        crawlingState.isRunning = false;
        crawlingState.progress = 100;
        
        // 데이터 저장
        const crawlResult = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            config: {
                url: crawlingState.currentUrl,
                type: document.getElementById('crawlType')?.value,
                keywords: document.getElementById('crawlKeywords')?.value
            },
            results: crawlingState.collectedData,
            summary: {
                totalCollected: crawlingState.collectedData.length,
                timeCompleted: getCurrentTimestamp()
            }
        };

        // 전역 데이터에 저장
        if (!Array.isArray(researchData.webcrawling)) {
            researchData.webcrawling = [];
        }
        
        researchData.webcrawling.push(crawlResult);
        saveDataToStorage();

        // UI 업데이트
        updateCrawlingProgress();
        showCrawlingStatus(`크롤링 완료! ${crawlingState.collectedData.length}개 데이터 수집됨`, 'completed');
        displayCrawledData();
        
        // 통계 업데이트
        if (typeof updateStats === 'function') {
            updateStats();
        }
        
        console.log('크롤링 완료:', crawlResult);
        
    } catch (error) {
        console.error('크롤링 완료 처리 중 오류:', error);
        showCrawlingStatus('크롤링 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 크롤링 UI 업데이트
 */
function updateCrawlingUI() {
    updateCrawlingProgress();
}

/**
 * 크롤링 진행률 업데이트
 */
function updateCrawlingProgress() {
    try {
        const progressElement = document.getElementById('crawlProgress');
        const countElement = document.getElementById('collectedCount');
        const progressBar = document.getElementById('progressBar');

        if (progressElement) {
            progressElement.textContent = Math.round(crawlingState.progress) + '%';
        }
        
        if (countElement) {
            countElement.textContent = crawlingState.collectedData.length;
        }
        
        if (progressBar) {
            progressBar.style.width = crawlingState.progress + '%';
        }
    } catch (error) {
        console.error('진행률 업데이트 중 오류:', error);
    }
}

/**
 * 크롤링 상태 메시지 표시
 */
function showCrawlingStatus(message, type) {
    const statusElement = document.getElementById('crawlStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `crawl-status ${type}`;
    } else {
        // 상태 표시 요소가 없으면 일반 알림으로 표시
        if (type === 'completed') {
            showSaveStatus(message);
        } else if (type === 'error') {
            showError(message);
        }
    }
}

/**
 * 수집된 데이터 표시
 */
function displayCrawledData() {
    try {
        const container = document.getElementById('crawledDataList');
        if (!container) return;

        container.innerHTML = '';

        if (crawlingState.collectedData.length === 0) {
            container.innerHTML = '<p>수집된 데이터가 없습니다.</p>';
            return;
        }

        crawlingState.collectedData.slice(0, 10).forEach(item => {
            const dataItem = document.createElement('div');
            dataItem.className = 'crawled-item';
            
            dataItem.innerHTML = `
                <div class="crawled-item-header">
                    <h4 class="crawled-item-title">${escapeHtml(item.content.author)}</h4>
                    <span class="crawled-item-source">${escapeHtml(item.content.source)}</span>
                </div>
                <div class="crawled-item-content">${escapeHtml(item.content.text)}</div>
                <div class="crawled-item-meta">
                    <span>❤️ ${item.metrics.likes}</span>
                    <span>🔄 ${item.metrics.shares}</span>
                    <span>💬 ${item.metrics.comments}</span>
                    <span>😊 ${item.analysis.sentiment}</span>
                    <span>${formatDateKorean(item.content.publishDate)}</span>
                </div>
            `;
            
            container.appendChild(dataItem);
        });

        if (crawlingState.collectedData.length > 10) {
            const moreInfo = document.createElement('div');
            moreInfo.style.cssText = 'text-align: center; padding: 15px; color: #6c757d; font-style: italic;';
            moreInfo.textContent = `외 ${crawlingState.collectedData.length - 10}개 더...`;
            container.appendChild(moreInfo);
        }
    } catch (error) {
        console.error('데이터 표시 중 오류:', error);
    }
}

/**
 * 크롤링 데이터 분석
 */
function analyzeCrawledData() {
    try {
        if (crawlingState.collectedData.length === 0) {
            showError('분석할 데이터가 없습니다. 먼저 크롤링을 실행해주세요.');
            return;
        }

        const analysis = performCrawlDataAnalysis(crawlingState.collectedData);
        
        // 분석 결과 표시
        displayAnalysisResults(analysis);
        showSaveStatus('데이터 분석이 완료되었습니다.');
        
    } catch (error) {
        console.error('데이터 분석 중 오류:', error);
        showError('데이터 분석 중 오류가 발생했습니다.');
    }
}

/**
 * 크롤링 데이터 분석 수행
 */
function performCrawlDataAnalysis(data) {
    try {
        const analysis = {
            keywords: {},
            sentiment: { positive: 0, neutral: 0, negative: 0 },
            timeline: {},
            sources: {},
            totalItems: data.length
        };

        data.forEach(item => {
            // 키워드 분석
            if (item.analysis && item.analysis.keywords) {
                item.analysis.keywords.forEach(keyword => {
                    analysis.keywords[keyword] = (analysis.keywords[keyword] || 0) + 1;
                });
            }

            // 감정 분석
            if (item.analysis && item.analysis.sentiment) {
                analysis.sentiment[item.analysis.sentiment]++;
            }

            // 시간대별 분석
            if (item.content && item.content.publishDate) {
                const date = new Date(item.content.publishDate).toDateString();
                analysis.timeline[date] = (analysis.timeline[date] || 0) + 1;
            }

            // 출처별 분석
            if (item.content && item.content.source) {
                analysis.sources[item.content.source] = (analysis.sources[item.content.source] || 0) + 1;
            }
        });

        return analysis;
    } catch (error) {
        console.error('분석 수행 중 오류:', error);
        return {
            keywords: {},
            sentiment: { positive: 0, neutral: 0, negative: 0 },
            timeline: {},
            sources: {},
            totalItems: 0
        };
    }
}

/**
 * 분석 결과 표시
 */
function displayAnalysisResults(analysis) {
    try {
        // 키워드 클라우드
        displayKeywordCloud(analysis.keywords);
        
        // 감정 분석 차트
        displaySentimentChart(analysis.sentiment);
        
        // 시간대별 차트
        displayTimelineChart(analysis.timeline);
        
        // 출처별 차트
        displaySourceChart(analysis.sources);
        
    } catch (error) {
        console.error('분석 결과 표시 중 오류:', error);
    }
}

/**
 * 키워드 클라우드 표시
 */
function displayKeywordCloud(keywords) {
    const container = document.getElementById('keywordCloud');
    if (!container) return;

    container.innerHTML = '';
    
    if (Object.keys(keywords).length === 0) {
        container.innerHTML = '<p>키워드 데이터가 없습니다.</p>';
        return;
    }

    const maxCount = Math.max(...Object.values(keywords));
    const sortedKeywords = Object.entries(keywords)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20);

    const cloudContainer = document.createElement('div');
    cloudContainer.className = 'keyword-cloud';

    sortedKeywords.forEach(([keyword, count]) => {
        const size = Math.max(0.8, (count / maxCount) * 2);
        const opacity = Math.max(0.6, count / maxCount);
        
        const keywordElement = document.createElement('span');
        keywordElement.className = 'keyword-item';
        keywordElement.textContent = `${keyword} (${count})`;
        keywordElement.style.fontSize = `${size}rem`;
        keywordElement.style.opacity = opacity;
        
        cloudContainer.appendChild(keywordElement);
    });

    container.appendChild(cloudContainer);
}

/**
 * 감정 분석 차트 표시
 */
function displaySentimentChart(sentiment) {
    const container = document.getElementById('sentimentChart');
    if (!container) return;

    const total = sentiment.positive + sentiment.neutral + sentiment.negative;
    if (total === 0) {
        container.innerHTML = '<p>감정 분석 데이터가 없습니다.</p>';
        return;
    }

    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'sentiment-chart';

    const sentiments = [
        { name: '긍정', value: sentiment.positive, class: 'sentiment-positive', emoji: '😊' },
        { name: '중립', value: sentiment.neutral, class: 'sentiment-neutral', emoji: '😐' },
        { name: '부정', value: sentiment.negative, class: 'sentiment-negative', emoji: '😞' }
    ];

    sentiments.forEach(item => {
        const percentage = Math.round((item.value / total) * 100);
        
        const sentimentItem = document.createElement('div');
        sentimentItem.className = 'sentiment-item';
        sentimentItem.innerHTML = `
            <div class="sentiment-circle ${item.class}">
                ${item.emoji}
            </div>
            <div>${item.name}</div>
            <div><strong>${item.value}개 (${percentage}%)</strong></div>
        `;
        
        chartContainer.appendChild(sentimentItem);
    });

    container.appendChild(chartContainer);
}

/**
 * 시간대별 차트 표시
 */
function displayTimelineChart(timeline) {
    const container = document.getElementById('timelineChart');
    if (!container) return;

    if (Object.keys(timeline).length === 0) {
        container.innerHTML = '<p>시간대별 데이터가 없습니다.</p>';
        return;
    }

    const sortedTimeline = Object.entries(timeline)
        .sort(([a], [b]) => new Date(a) - new Date(b));

    const maxCount = Math.max(...Object.values(timeline));
    
    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.cssText = 'padding: 20px;';
    
    const title = document.createElement('h4');
    title.textContent = '일별 데이터 수집량';
    title.style.marginBottom = '15px';
    chartContainer.appendChild(title);
    
    const chartArea = document.createElement('div');
    chartArea.style.cssText = 'display: flex; align-items: end; height: 150px; gap: 5px; overflow-x: auto;';
    
    sortedTimeline.forEach(([date, count]) => {
        const height = Math.max((count / maxCount) * 120, 10);
        const bar = document.createElement('div');
        bar.style.cssText = `
            min-width: 30px;
            height: ${height}px;
            background: #667eea;
            border-radius: 3px;
            position: relative;
            display: flex;
            align-items: end;
            justify-content: center;
            color: white;
            font-size: 0.8rem;
            font-weight: bold;
        `;
        bar.textContent = count;
        bar.title = `${new Date(date).toLocaleDateString()}: ${count}개`;
        
        chartArea.appendChild(bar);
    });
    
    chartContainer.appendChild(chartArea);
    container.appendChild(chartContainer);
}

/**
 * 출처별 차트 표시
 */
function displaySourceChart(sources) {
    const container = document.getElementById('sourceChart');
    if (!container) return;

    if (Object.keys(sources).length === 0) {
        container.innerHTML = '<p>출처별 데이터가 없습니다.</p>';
        return;
    }

    const total = Object.values(sources).reduce((a, b) => a + b, 0);
    const sortedSources = Object.entries(sources)
        .sort(([,a], [,b]) => b - a);

    container.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.cssText = 'padding: 20px;';
    
    const title = document.createElement('h4');
    title.textContent = '출처별 데이터 분포';
    title.style.marginBottom = '15px';
    chartContainer.appendChild(title);
    
    sortedSources.forEach(([source, count]) => {
        const percentage = Math.round((count / total) * 100);
        
        const sourceItem = document.createElement('div');
        sourceItem.style.cssText = 'margin: 10px 0;';
        sourceItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span><strong>${escapeHtml(source)}</strong></span>
                <span>${count}개 (${percentage}%)</span>
            </div>
            <div style="background: #e9ecef; border-radius: 10px; height: 20px; overflow: hidden;">
                <div style="background: #667eea; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
            </div>
        `;
        
        chartContainer.appendChild(sourceItem);
    });
    
    container.appendChild(chartContainer);
}

/**
 * 분석 탭 전환
 */
function showAnalysisTab(tabName) {
    try {
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 모든 탭 컨텐츠 숨김
        document.querySelectorAll('.analysis-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 선택된 탭 활성화
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        const selectedTab = document.getElementById(`${tabName}Tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    } catch (error) {
        console.error('탭 전환 중 오류:', error);
    }
}

/**
 * 웹크롤링 데이터 내보내기
 */
function exportWebCrawlingData() {
    try {
        const webcrawlingData = getData('webcrawling') || [];
        
        if (webcrawlingData.length === 0) {
            showError('내보낼 웹크롤링 데이터가 없습니다.');
            return;
        }
        
        const exportData = {
            exportDate: getCurrentTimestamp(),
            type: 'webcrawling',
            count: webcrawlingData.length,
            data: webcrawlingData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `webcrawling_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSaveStatus('웹크롤링 데이터가 내보내졌습니다.');
    } catch (error) {
        console.error('웹크롤링 데이터 내보내기 중 오류:', error);
        showError('웹크롤링 데이터 내보내기 중 오류가 발생했습니다.');
    }
}

/**
 * 크롤링 중지
 */
function stopCrawling() {
    try {
        crawlingState.isRunning = false;
        showCrawlingStatus('크롤링이 중지되었습니다.', 'completed');
        updateCrawlingProgress();
    } catch (error) {
        console.error('크롤링 중지 중 오류:', error);
    }
}