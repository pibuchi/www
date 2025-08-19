// =========================
// 아이디에이션 모듈 (수정된 버전)
// =========================

/**
 * 아이디어 저장
 */
function saveIdea() {
    try {
        const title = document.getElementById('ideaTitle')?.value || '';
        const description = document.getElementById('ideaDescription')?.value || '';
        const category = document.getElementById('ideaCategory')?.value || '';
        const priority = document.getElementById('ideaPriority')?.value || '보통';

        if (!title.trim()) {
            showError('아이디어 제목을 입력해주세요.');
            return;
        }

        if (!description.trim()) {
            showError('아이디어 설명을 입력해주세요.');
            return;
        }

        const data = {
            title: title.trim(),
            description: description.trim(),
            category: category || '미분류',
            priority: priority
        };

        console.log('아이디어 저장 시도:', data);
        
        const savedIdea = addIdea(data);
        
        if (savedIdea) {
            console.log('아이디어 저장 성공:', savedIdea);
            
            // UI 업데이트
            if (typeof updateStats === 'function') {
                updateStats();
            }
            if (typeof updateAllLists === 'function') {
                updateAllLists();
            }
            updateIdeaStats();
            
            showSaveStatus('아이디어가 저장되었습니다');
            clearIdeaForm();
            
            return savedIdea;
        } else {
            throw new Error('아이디어 저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('아이디어 저장 중 오류:', error);
        showError('아이디어 저장 중 오류가 발생했습니다: ' + error.message);
    }
}

/**
 * 아이디어 폼 초기화
 */
function clearIdeaForm() {
    try {
        clearFormData(['ideaTitle', 'ideaDescription']);
        
        const categorySelect = document.getElementById('ideaCategory');
        const prioritySelect = document.getElementById('ideaPriority');
        
        if (categorySelect) categorySelect.selectedIndex = 0;
        if (prioritySelect) prioritySelect.selectedIndex = 0;
    } catch (error) {
        console.error('아이디어 폼 초기화 중 오류:', error);
    }
}

/**
 * 아이디어 목록 업데이트
 */
function updateIdeaList() {
    try {
        const container = document.getElementById('ideaList');
        if (!container) return;

        const ideas = getData('ideas') || [];
        container.innerHTML = '';

        if (isEmpty(ideas)) {
            container.appendChild(renderEmptyState('아직 아이디어가 없습니다.'));
            return;
        }

        const sortedIdeas = safeSortByDate(ideas, 'timestamp', false);

        sortedIdeas.forEach(idea => {
            try {
                const item = renderIdeaItem(idea);
                if (item) {
                    container.appendChild(item);
                }
            } catch (itemError) {
                console.error('아이디어 아이템 렌더링 중 오류:', itemError);
            }
        });
    } catch (error) {
        console.error('아이디어 목록 업데이트 중 오류:', error);
    }
}

/**
 * 아이디어 아이템 렌더링
 */
function renderIdeaItem(idea) {
    try {
        if (!idea || !idea.id) {
            console.warn('유효하지 않은 아이디어 데이터:', idea);
            return null;
        }

        const item = document.createElement('div');
        item.className = 'idea-item';
        item.setAttribute('data-id', idea.id);
        
        // 우선순위에 따른 스타일
        const priorityColors = {
            '높음': '#dc3545',
            '보통': '#ffc107',
            '낮음': '#28a745'
        };
        
        const priorityColor = priorityColors[idea.priority] || '#6c757d';
        const title = escapeHtml(idea.title || '제목 없음');
        const category = escapeHtml(idea.category || '미분류');
        const description = escapeHtml(idea.description || '설명 없음');
        const priority = escapeHtml(idea.priority || '보통');
        const timestamp = idea.timestamp ? formatDateKorean(idea.timestamp) : '날짜 없음';
        
        item.innerHTML = `
            <div class="idea-header">
                <h4>${title}</h4>
                <span class="idea-category" style="background: ${priorityColor}; color: white;">
                    ${category}
                </span>
            </div>
            <div class="idea-description">${description}</div>
            <div class="idea-meta">
                <span>${timestamp}</span>
                • 우선순위: <span style="color: ${priorityColor}; font-weight: bold;">${priority}</span>
            </div>
            <div class="idea-actions" style="margin-top: 10px; text-align: right;">
                <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px;" 
                        onclick="editIdea('${idea.id}')">수정</button>
                <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-left: 5px;" 
                        onclick="duplicateIdea('${idea.id}')">복제</button>
                <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-left: 5px;" 
                        onclick="deleteIdea('${idea.id}')">삭제</button>
            </div>
        `;
        
        return item;
    } catch (error) {
        console.error('아이디어 아이템 렌더링 중 오류:', error);
        return null;
    }
}

/**
 * 아이디어 통계 업데이트
 */
function updateIdeaStats() {
    try {
        const ideas = getData('ideas') || [];
        const totalIdeas = ideas.length;
        const highPriorityIdeas = ideas.filter(idea => idea.priority === '높음').length;
        
        if (elementExists('totalIdeas')) {
            document.getElementById('totalIdeas').textContent = totalIdeas;
        }
        if (elementExists('highPriorityIdeas')) {
            document.getElementById('highPriorityIdeas').textContent = highPriorityIdeas;
        }
    } catch (error) {
        console.error('아이디어 통계 업데이트 중 오류:', error);
    }
}

/**
 * 아이디어 카테고리별 분류
 */
function categorizeIdeas() {
    try {
        const ideas = getData('ideas') || [];
        
        if (isEmpty(ideas)) {
            showError('분류할 아이디어가 없습니다.');
            return;
        }
        
        const categorizedData = performIdeaCategorization(ideas);
        
        const content = `
            <div style="margin-bottom: 20px;">
                <h4>📊 카테고리별 분포</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generateCategoryDistributionChart(categorizedData.categoryDistribution)}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>⭐ 우선순위별 분포</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generatePriorityDistributionChart(categorizedData.priorityDistribution)}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>🔥 상위 카테고리</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generateTopCategoriesList(categorizedData.topCategories)}
                </div>
            </div>
            
            <div>
                <h4>💡 추천 아이디어</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generateRecommendedIdeas(categorizedData.recommendedIdeas)}
                </div>
            </div>
        `;

        const modal = ModalManager.create(
            '아이디어 카테고리 분석',
            content,
            [
                {
                    text: '상세 분석',
                    class: 'btn-primary',
                    onclick: `ModalManager.close(this.closest('.modal-overlay')); performDetailedIdeaAnalysis();`
                },
                {
                    text: '닫기',
                    class: 'btn-secondary',
                    onclick: `ModalManager.close(this.closest('.modal-overlay'))`
                }
            ]
        );
        
        showSaveStatus('아이디어가 카테고리별로 분류되었습니다.');
    } catch (error) {
        console.error('아이디어 분류 중 오류:', error);
        showError('아이디어 분류 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 카테고리화 수행
 */
function performIdeaCategorization(ideas) {
    try {
        const categoryDistribution = {};
        const priorityDistribution = {};
        
        ideas.forEach(idea => {
            if (idea) {
                const category = idea.category || '미분류';
                const priority = idea.priority || '보통';
                
                categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
                priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
            }
        });
        
        // 상위 카테고리
        const topCategories = Object.entries(categoryDistribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        // 추천 아이디어 (높은 우선순위)
        const recommendedIdeas = ideas
            .filter(idea => idea && idea.priority === '높음')
            .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
            .slice(0, 3);
        
        return {
            categoryDistribution,
            priorityDistribution,
            topCategories,
            recommendedIdeas
        };
    } catch (error) {
        console.error('아이디어 카테고리화 중 오류:', error);
        return {
            categoryDistribution: {},
            priorityDistribution: {},
            topCategories: [],
            recommendedIdeas: []
        };
    }
}

/**
 * 카테고리 분포 차트 생성
 */
function generateCategoryDistributionChart(distribution) {
    try {
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        
        if (total === 0) return '<em>데이터가 없습니다.</em>';
        
        return Object.entries(distribution)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => {
                const percentage = Math.round((count / total) * 100);
                return `
                    <div style="display: flex; align-items: center; margin: 8px 0;">
                        <span style="width: 120px; font-size: 0.9rem;">${escapeHtml(category)}:</span>
                        <div style="flex: 1; background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 0 10px;">
                            <div style="background: #667eea; height: 20px; width: ${percentage}%; transition: width 0.3s ease;"></div>
                        </div>
                        <span style="font-size: 0.9rem;">${count}개 (${percentage}%)</span>
                    </div>
                `;
            }).join('');
    } catch (error) {
        console.error('카테고리 차트 생성 중 오류:', error);
        return '<em>차트 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 우선순위 분포 차트 생성
 */
function generatePriorityDistributionChart(distribution) {
    try {
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        const priorityColors = {
            '높음': '#dc3545',
            '보통': '#ffc107',
            '낮음': '#28a745'
        };
        
        if (total === 0) return '<em>데이터가 없습니다.</em>';
        
        return Object.entries(distribution)
            .map(([priority, count]) => {
                const percentage = Math.round((count / total) * 100);
                const color = priorityColors[priority] || '#6c757d';
                
                return `
                    <div style="display: flex; align-items: center; margin: 8px 0;">
                        <span style="width: 80px; font-size: 0.9rem; color: ${color}; font-weight: bold;">${priority}:</span>
                        <div style="flex: 1; background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 0 10px;">
                            <div style="background: ${color}; height: 20px; width: ${percentage}%; transition: width 0.3s ease;"></div>
                        </div>
                        <span style="font-size: 0.9rem;">${count}개 (${percentage}%)</span>
                    </div>
                `;
            }).join('');
    } catch (error) {
        console.error('우선순위 차트 생성 중 오류:', error);
        return '<em>차트 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 상위 카테고리 목록 생성
 */
function generateTopCategoriesList(topCategories) {
    try {
        if (!topCategories || topCategories.length === 0) {
            return '<em>데이터가 없습니다.</em>';
        }
        
        return topCategories.map(([category, count], index) => 
            `<div style="margin: 8px 0; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #667eea;">
                <strong>${index + 1}. ${escapeHtml(category)}</strong> - ${count}개 아이디어
            </div>`
        ).join('');
    } catch (error) {
        console.error('상위 카테고리 목록 생성 중 오류:', error);
        return '<em>목록 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 추천 아이디어 생성
 */
function generateRecommendedIdeas(recommendedIdeas) {
    try {
        if (!recommendedIdeas || recommendedIdeas.length === 0) {
            return '<em>높은 우선순위의 아이디어가 없습니다.</em>';
        }
        
        return recommendedIdeas.map(idea => 
            `<div style="margin: 10px 0; padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #dc3545;">
                <strong>${escapeHtml(idea.title || '제목 없음')}</strong><br>
                <small style="color: #6c757d;">${escapeHtml(truncateText(idea.description || '', 80))}</small>
            </div>`
        ).join('');
    } catch (error) {
        console.error('추천 아이디어 생성 중 오류:', error);
        return '<em>추천 아이디어 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 아이디어 수정
 */
function editIdea(ideaId) {
    try {
        const ideas = getData('ideas') || [];
        const idea = ideas.find(item => item && item.id === ideaId);
        
        if (!idea) {
            showError('아이디어를 찾을 수 없습니다.');
            return;
        }

        const content = `
            <div class="form-group">
                <label>아이디어 제목</label>
                <input type="text" id="editIdeaTitle" class="form-control" value="${escapeHtml(idea.title || '')}">
            </div>
            <div class="form-group">
                <label>상세 설명</label>
                <textarea id="editIdeaDescription" class="form-control" rows="4">${escapeHtml(idea.description || '')}</textarea>
            </div>
            <div class="form-group">
                <label>카테고리</label>
                <select id="editIdeaCategory" class="form-control">
                    <option value="">카테고리 선택</option>
                    <option value="문제점 발견" ${idea.category === '문제점 발견' ? 'selected' : ''}>문제점 발견</option>
                    <option value="개선 아이디어" ${idea.category === '개선 아이디어' ? 'selected' : ''}>개선 아이디어</option>
                    <option value="새로운 기회" ${idea.category === '새로운 기회' ? 'selected' : ''}>새로운 기회</option>
                    <option value="사용자 니즈" ${idea.category === '사용자 니즈' ? 'selected' : ''}>사용자 니즈</option>
                    <option value="기타" ${idea.category === '기타' ? 'selected' : ''}>기타</option>
                </select>
            </div>
            <div class="form-group">
                <label>우선순위</label>
                <select id="editIdeaPriority" class="form-control">
                    <option value="높음" ${idea.priority === '높음' ? 'selected' : ''}>높음</option>
                    <option value="보통" ${idea.priority === '보통' ? 'selected' : ''}>보통</option>
                    <option value="낮음" ${idea.priority === '낮음' ? 'selected' : ''}>낮음</option>
                </select>
            </div>
        `;

        const modal = ModalManager.create(
            '아이디어 수정',
            content,
            [
                {
                    text: '저장',
                    class: 'btn-primary',
                    onclick: `saveIdeaEdit('${ideaId}'); ModalManager.close(this.closest('.modal-overlay'));`
                },
                {
                    text: '취소',
                    class: 'btn-secondary',
                    onclick: `ModalManager.close(this.closest('.modal-overlay'))`
                }
            ]
        );
    } catch (error) {
        console.error('아이디어 수정 중 오류:', error);
        showError('아이디어 수정 중 오류가 발생했습니다.');
    }
}

/**
 * 수정된 아이디어 저장
 */
function saveIdeaEdit(ideaId) {
    try {
        const title = document.getElementById('editIdeaTitle')?.value || '';
        const description = document.getElementById('editIdeaDescription')?.value || '';
        const category = document.getElementById('editIdeaCategory')?.value || '';
        const priority = document.getElementById('editIdeaPriority')?.value || '보통';

        if (!title.trim() || !description.trim()) {
            showError('제목과 설명을 모두 입력해주세요.');
            return;
        }

        const updatedData = {
            title: title.trim(),
            description: description.trim(),
            category: category || '미분류',
            priority: priority
        };

        const result = updateData('ideas', ideaId, updatedData);
        
        if (result) {
            updateIdeaList();
            updateIdeaStats();
            showSaveStatus('아이디어가 수정되었습니다.');
        } else {
            showError('아이디어 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('아이디어 수정 저장 중 오류:', error);
        showError('아이디어 수정 저장 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 복제
 */
function duplicateIdea(ideaId) {
    try {
        const ideas = getData('ideas') || [];
        const idea = ideas.find(item => item && item.id === ideaId);
        
        if (!idea) {
            showError('아이디어를 찾을 수 없습니다.');
            return;
        }

        const duplicatedIdea = {
            title: (idea.title || '제목 없음') + ' (복사본)',
            description: idea.description || '',
            category: idea.category || '미분류',
            priority: idea.priority || '보통'
        };

        const savedIdea = addIdea(duplicatedIdea);
        if (savedIdea) {
            updateIdeaList();
            updateIdeaStats();
            showSaveStatus('아이디어가 복제되었습니다.');
        }
    } catch (error) {
        console.error('아이디어 복제 중 오류:', error);
        showError('아이디어 복제 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 삭제
 */
function deleteIdea(ideaId) {
    try {
        confirmDialog('이 아이디어를 삭제하시겠습니까?', () => {
            const result = removeData('ideas', ideaId);
            
            if (result) {
                updateIdeaList();
                updateIdeaStats();
                showSaveStatus('아이디어가 삭제되었습니다.');
            } else {
                showError('아이디어 삭제에 실패했습니다.');
            }
        });
    } catch (error) {
        console.error('아이디어 삭제 중 오류:', error);
        showError('아이디어 삭제 중 오류가 발생했습니다.');
    }
}

/**
 * 상세 아이디어 분석
 */
function performDetailedIdeaAnalysis() {
    try {
        const ideas = getData('ideas') || [];
        
        if (isEmpty(ideas)) {
            showError('분석할 아이디어가 없습니다.');
            return;
        }

        const detailedAnalysis = performAdvancedIdeaAnalysis(ideas);
        
        const content = `
            <div style="margin-bottom: 20px;">
                <h4>📊 종합 분석</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <strong>총 아이디어:</strong> ${ideas.length}개<br>
                    <strong>평균 설명 길이:</strong> ${detailedAnalysis.avgDescriptionLength}자<br>
                    <strong>가장 활발한 카테고리:</strong> ${detailedAnalysis.mostActiveCategory}<br>
                    <strong>아이디어 생성 빈도:</strong> ${detailedAnalysis.creationFrequency}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>💭 키워드 분석</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generateIdeaKeywordCloud(detailedAnalysis.topKeywords)}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>📈 시간별 패턴</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generateIdeaTimePattern(detailedAnalysis.timePattern)}
                </div>
            </div>
            
            <div>
                <h4>🎯 실행 계획 제안</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${generateActionPlan(detailedAnalysis.actionPlan)}
                </div>
            </div>
        `;

        const modal = ModalManager.create(
            '아이디어 상세 분석',
            content,
            [
                {
                    text: '분석 리포트 내보내기',
                    class: 'btn-primary',
                    onclick: `exportIdeaAnalysis(${JSON.stringify(detailedAnalysis).replace(/"/g, '&quot;')}); ModalManager.close(this.closest('.modal-overlay'));`
                },
                {
                    text: '닫기',
                    class: 'btn-secondary',
                    onclick: `ModalManager.close(this.closest('.modal-overlay'))`
                }
            ]
        );
    } catch (error) {
        console.error('상세 아이디어 분석 중 오류:', error);
        showError('상세 아이디어 분석 중 오류가 발생했습니다.');
    }
}

/**
 * 고급 아이디어 분석 수행
 */
function performAdvancedIdeaAnalysis(ideas) {
    try {
        // 평균 설명 길이
        const descriptions = ideas.map(idea => idea.description || '').filter(desc => desc);
        const avgDescriptionLength = descriptions.length > 0 ? 
            Math.round(descriptions.reduce((sum, desc) => sum + desc.length, 0) / descriptions.length) : 0;
        
        // 가장 활발한 카테고리
        const categoryCounts = {};
        ideas.forEach(idea => {
            if (idea) {
                const category = idea.category || '미분류';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });
        
        const mostActiveCategory = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || '없음';
        
        // 생성 빈도 계산
        const validIdeas = ideas.filter(idea => idea && idea.timestamp);
        const dates = validIdeas.map(idea => new Date(idea.timestamp).toDateString());
        const uniqueDates = [...new Set(dates)];
        const creationFrequency = uniqueDates.length > 0 ? 
            `일평균 ${(validIdeas.length / uniqueDates.length).toFixed(1)}개` : '데이터 부족';
        
        // 키워드 분석
        const allText = ideas.map(idea => 
            (idea?.title || '') + ' ' + (idea?.description || '')
        ).join(' ').toLowerCase();
        
        const words = allText.match(/[가-힣]{2,}/g) || [];
        const keywordCounts = {};
        
        words.forEach(word => {
            if (word && word.length >= 2) {
                keywordCounts[word] = (keywordCounts[word] || 0) + 1;
            }
        });
        
        const topKeywords = Object.entries(keywordCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20);
        
        // 시간 패턴 분석
        const hourCounts = {};
        validIdeas.forEach(idea => {
            try {
                const hour = new Date(idea.timestamp).getHours();
                if (!isNaN(hour)) {
                    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                }
            } catch (e) {
                console.warn('시간 파싱 오류:', idea.timestamp);
            }
        });
        
        // 실행 계획 생성
        const highPriorityIdeas = ideas.filter(idea => idea && idea.priority === '높음');
        const actionPlan = generateIdeaActionPlan(highPriorityIdeas, categoryCounts);
        
        return {
            avgDescriptionLength,
            mostActiveCategory,
            creationFrequency,
            topKeywords,
            timePattern: hourCounts,
            actionPlan
        };
    } catch (error) {
        console.error('고급 아이디어 분석 중 오류:', error);
        return {
            avgDescriptionLength: 0,
            mostActiveCategory: '분석 실패',
            creationFrequency: '계산 불가',
            topKeywords: [],
            timePattern: {},
            actionPlan: '<em>분석 중 오류가 발생했습니다.</em>'
        };
    }
}

/**
 * 아이디어 키워드 클라우드 생성
 */
function generateIdeaKeywordCloud(topKeywords) {
    try {
        if (!topKeywords || topKeywords.length === 0) {
            return '<em>키워드가 없습니다.</em>';
        }
        
        const maxCount = topKeywords[0]?.[1] || 1;
        
        return topKeywords.map(([keyword, count]) => {
            const size = Math.max(0.8, (count / maxCount) * 1.8);
            const opacity = Math.max(0.6, count / maxCount);
            
            return `
                <span style="
                    display: inline-block; 
                    margin: 4px; 
                    padding: 6px 12px; 
                    background: rgba(102, 126, 234, ${opacity}); 
                    color: white; 
                    border-radius: 15px; 
                    font-size: ${size}rem;
                    font-weight: 500;
                ">${escapeHtml(keyword)} (${count})</span>
            `;
        }).join('');
    } catch (error) {
        console.error('키워드 클라우드 생성 중 오류:', error);
        return '<em>키워드 클라우드 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 아이디어 시간 패턴 생성
 */
function generateIdeaTimePattern(timePattern) {
    try {
        const hours = Array.from({length: 24}, (_, i) => i);
        const maxCount = Math.max(...Object.values(timePattern), 1);
        
        return `
            <div style="display: flex; align-items: end; height: 80px; gap: 2px;">
                ${hours.map(hour => {
                    const count = timePattern[hour] || 0;
                    const height = Math.max((count / maxCount) * 60, 3);
                    const isActive = count > 0;
                    
                    return `
                        <div style="
                            width: 12px; 
                            height: ${height}px; 
                            background: ${isActive ? '#667eea' : '#e9ecef'}; 
                            border-radius: 2px;
                            margin-bottom: 5px;
                        " title="${hour}시: ${count}개"></div>
                    `;
                }).join('')}
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #6c757d;">
                시간대별 아이디어 생성 패턴 (0시 ~ 23시)
            </div>
        `;
    } catch (error) {
        console.error('시간 패턴 생성 중 오류:', error);
        return '<em>시간 패턴 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 실행 계획 생성
 */
function generateActionPlan(actionPlan) {
    try {
        if (typeof actionPlan === 'string') {
            return actionPlan;
        }
        return '<em>실행 계획을 생성할 수 없습니다.</em>';
    } catch (error) {
        console.error('실행 계획 생성 중 오류:', error);
        return '<em>실행 계획 생성 중 오류가 발생했습니다.</em>';
    }
}

/**
 * 아이디어 실행 계획 생성 함수
 */
function generateIdeaActionPlan(highPriorityIdeas, categoryCounts) {
    try {
        const suggestions = [];
        
        if (highPriorityIdeas && highPriorityIdeas.length > 0) {
            suggestions.push(`우선 실행할 아이디어 ${highPriorityIdeas.length}개가 있습니다.`);
            const latestIdea = highPriorityIdeas.find(idea => idea && idea.title);
            if (latestIdea) {
                suggestions.push(`가장 최근의 높은 우선순위 아이디어: "${latestIdea.title}"`);
            }
        } else {
            suggestions.push('높은 우선순위로 설정된 아이디어가 없습니다. 우선순위를 재검토해보세요.');
        }
        
        if (categoryCounts && Object.keys(categoryCounts).length > 0) {
            const topCategory = Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0];
            if (topCategory) {
                suggestions.push(`"${topCategory[0]}" 카테고리에 집중하여 ${topCategory[1]}개의 아이디어를 발전시켜보세요.`);
            }
        }
        
        if (categoryCounts && Object.keys(categoryCounts).length > 3) {
            suggestions.push('다양한 카테고리의 아이디어가 있으니 분야별로 우선순위를 정하는 것을 추천합니다.');
        }
        
        return suggestions.map(suggestion => 
            `<div style="margin: 8px 0; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #28a745;">
                • ${escapeHtml(suggestion)}
            </div>`
        ).join('');
    } catch (error) {
        console.error('아이디어 실행 계획 생성 중 오류:', error);
        return '<div style="margin: 8px 0; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #dc3545;">• 실행 계획 생성 중 오류가 발생했습니다.</div>';
    }
}

/**
 * 아이디어 분석 내보내기
 */
function exportIdeaAnalysis(analysisData) {
    try {
        const ideas = getData('ideas') || [];
        
        const reportData = {
            exportDate: getCurrentTimestamp(),
            type: 'idea_analysis_report',
            analysis: typeof analysisData === 'string' ? JSON.parse(analysisData) : analysisData,
            ideas: ideas
        };
        
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `idea_analysis_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSaveStatus('아이디어 분석 리포트가 내보내졌습니다.');
    } catch (error) {
        console.error('아이디어 분석 내보내기 중 오류:', error);
        showError('아이디어 분석 내보내기 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 검색
 */
function searchIdeas(query) {
    try {
        const ideas = getData('ideas') || [];
        
        if (!query || !query.trim()) {
            updateIdeaList();
            return;
        }
        
        const searchTerm = query.toLowerCase();
        const filtered = ideas.filter(idea => {
            if (!idea) return false;
            
            const title = (idea.title || '').toLowerCase();
            const description = (idea.description || '').toLowerCase();
            const category = (idea.category || '').toLowerCase();
            
            return title.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   category.includes(searchTerm);
        });
        
        displayFilteredIdeas(filtered);
    } catch (error) {
        console.error('아이디어 검색 중 오류:', error);
        showError('아이디어 검색 중 오류가 발생했습니다.');
    }
}

/**
 * 필터된 아이디어 표시
 */
function displayFilteredIdeas(ideas) {
    try {
        const container = document.getElementById('ideaList');
        if (!container) return;

        container.innerHTML = '';

        if (!ideas || ideas.length === 0) {
            container.appendChild(renderEmptyState('검색 결과가 없습니다.'));
            return;
        }

        const sortedIdeas = safeSortByDate(ideas, 'timestamp', false);

        sortedIdeas.forEach(idea => {
            try {
                if (idea) {
                    const item = renderIdeaItem(idea);
                    if (item) {
                        container.appendChild(item);
                    }
                }
            } catch (itemError) {
                console.error('필터된 아이디어 아이템 렌더링 중 오류:', itemError);
            }
        });
    } catch (error) {
        console.error('필터된 아이디어 표시 중 오류:', error);
    }
}

/**
 * 아이디어 우선순위별 필터링
 */
function filterIdeasByPriority(priority) {
    try {
        const ideas = getData('ideas') || [];
        
        if (!priority || priority === 'all') {
            updateIdeaList();
            return;
        }
        
        const filtered = ideas.filter(idea => idea && idea.priority === priority);
        displayFilteredIdeas(filtered);
    } catch (error) {
        console.error('우선순위별 필터링 중 오류:', error);
        showError('우선순위별 필터링 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 카테고리별 필터링
 */
function filterIdeasByCategory(category) {
    try {
        const ideas = getData('ideas') || [];
        
        if (!category || category === 'all') {
            updateIdeaList();
            return;
        }
        
        const filtered = ideas.filter(idea => idea && idea.category === category);
        displayFilteredIdeas(filtered);
    } catch (error) {
        console.error('카테고리별 필터링 중 오류:', error);
        showError('카테고리별 필터링 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 통계 요약
 */
function getIdeaStatsSummary() {
    try {
        const ideas = getData('ideas') || [];
        
        const summary = {
            total: ideas.length,
            categories: {},
            priorities: {},
            recentCount: 0
        };
        
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        ideas.forEach(idea => {
            if (idea) {
                // 카테고리별 집계
                const category = idea.category || '미분류';
                summary.categories[category] = (summary.categories[category] || 0) + 1;
                
                // 우선순위별 집계
                const priority = idea.priority || '보통';
                summary.priorities[priority] = (summary.priorities[priority] || 0) + 1;
                
                // 최근 1주일 내 아이디어 집계
                if (idea.timestamp) {
                    try {
                        const ideaDate = new Date(idea.timestamp);
                        if (ideaDate >= weekAgo) {
                            summary.recentCount++;
                        }
                    } catch (dateError) {
                        console.warn('날짜 파싱 오류:', idea.timestamp);
                    }
                }
            }
        });
        
        return summary;
    } catch (error) {
        console.error('아이디어 통계 요약 중 오류:', error);
        return {
            total: 0,
            categories: {},
            priorities: {},
            recentCount: 0
        };
    }
}

/**
 * 아이디어 내보내기
 */
function exportIdeas() {
    try {
        const ideas = getData('ideas') || [];
        
        if (ideas.length === 0) {
            showError('내보낼 아이디어가 없습니다.');
            return;
        }
        
        const exportData = {
            exportDate: getCurrentTimestamp(),
            type: 'ideas',
            count: ideas.length,
            summary: getIdeaStatsSummary(),
            data: ideas
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ideas_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSaveStatus('아이디어 데이터가 내보내졌습니다.');
    } catch (error) {
        console.error('아이디어 내보내기 중 오류:', error);
        showError('아이디어 내보내기 중 오류가 발생했습니다.');
    }
}

/**
 * 아이디어 데이터 가져오기
 */
function importIdeas(fileData) {
    try {
        console.log('아이디어 가져오기 시작:', fileData);
        
        if (!fileData) {
            throw new Error('파일 데이터가 제공되지 않았습니다.');
        }
        
        let importedData;
        try {
            importedData = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
        } catch (parseError) {
            throw new Error('JSON 파싱에 실패했습니다: ' + parseError.message);
        }
        
        console.log('파싱된 데이터:', importedData);
        
        if (!importedData) {
            throw new Error('가져온 데이터가 비어있습니다.');
        }
        
        // 데이터 구조 확인
        let ideasToImport = [];
        
        if (importedData.data && Array.isArray(importedData.data)) {
            // 표준 내보내기 형식
            ideasToImport = importedData.data;
        } else if (Array.isArray(importedData)) {
            // 직접 배열 형식
            ideasToImport = importedData;
        } else if (importedData.ideas && Array.isArray(importedData.ideas)) {
            // ideas 속성이 있는 경우
            ideasToImport = importedData.ideas;
        } else {
            throw new Error('유효한 아이디어 데이터 형식을 찾을 수 없습니다.');
        }
        
        console.log('가져올 아이디어들:', ideasToImport);
        
        if (!Array.isArray(ideasToImport) || ideasToImport.length === 0) {
            throw new Error('가져올 아이디어가 없습니다.');
        }
        
        // 유효한 아이디어만 필터링
        const validIdeas = ideasToImport.filter(idea => {
            if (!idea || typeof idea !== 'object') {
                console.warn('유효하지 않은 아이디어 객체:', idea);
                return false;
            }
            
            if (!idea.title || !idea.description) {
                console.warn('제목 또는 설명이 없는 아이디어:', idea);
                return false;
            }
            
            return true;
        });
        
        console.log('유효한 아이디어들:', validIdeas);
        
        if (validIdeas.length === 0) {
            throw new Error('유효한 아이디어가 없습니다. 제목과 설명이 모두 필요합니다.');
        }
        
        // 각 아이디어를 개별적으로 추가
        let successCount = 0;
        let failCount = 0;
        
        for (const idea of validIdeas) {
            try {
                // 새로운 ID와 타임스탬프로 아이디어 생성
                const ideaData = {
                    title: idea.title,
                    description: idea.description,
                    category: idea.category || '미분류',
                    priority: idea.priority || '보통'
                };
                
                console.log('아이디어 추가 시도:', ideaData);
                
                const savedIdea = addIdea(ideaData);
                if (savedIdea) {
                    successCount++;
                    console.log('아이디어 추가 성공:', savedIdea);
                } else {
                    failCount++;
                    console.warn('아이디어 추가 실패:', ideaData);
                }
            } catch (addError) {
                failCount++;
                console.error('개별 아이디어 추가 중 오류:', addError, idea);
            }
        }
        
        // UI 업데이트
        try {
            updateIdeaList();
            updateIdeaStats();
            
            if (typeof updateStats === 'function') {
                updateStats();
            }
        } catch (uiError) {
            console.warn('UI 업데이트 중 오류:', uiError);
        }
        
        // 결과 메시지
        if (successCount > 0) {
            let message = `${successCount}개의 아이디어를 성공적으로 가져왔습니다.`;
            if (failCount > 0) {
                message += ` (${failCount}개 실패)`;
            }
            showSaveStatus(message);
            return true;
        } else {
            throw new Error('모든 아이디어 가져오기에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('아이디어 가져오기 중 오류:', error);
        showError('아이디어 가져오기 중 오류가 발생했습니다: ' + error.message);
        return false;
    }
}

/**
 * 파일에서 아이디어 가져오기
 */
function importIdeasFromFile() {
    try {
        // 파일 입력 요소 생성
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (!file) {
                showError('파일이 선택되지 않았습니다.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const fileContent = e.target.result;
                    console.log('파일 내용:', fileContent);
                    
                    const success = importIdeas(fileContent);
                    if (success) {
                        console.log('파일에서 아이디어 가져오기 성공');
                    }
                } catch (readerError) {
                    console.error('파일 읽기 중 오류:', readerError);
                    showError('파일 읽기 중 오류가 발생했습니다: ' + readerError.message);
                }
            };
            
            reader.onerror = function() {
                showError('파일 읽기에 실패했습니다.');
            };
            
            reader.readAsText(file);
        };
        
        // 파일 선택 대화상자 열기
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
        
    } catch (error) {
        console.error('파일 가져오기 설정 중 오류:', error);
        showError('파일 가져오기 설정 중 오류가 발생했습니다.');
    }
}

/**
 * 샘플 아이디어 생성 (테스트용)
 */
function generateSampleIdeas() {
    try {
        const sampleIdeas = [
            {
                title: "사용자 인터페이스 개선",
                description: "더 직관적이고 사용하기 쉬운 인터페이스 디자인을 통해 사용자 경험을 향상시키는 방안",
                category: "개선 아이디어",
                priority: "높음"
            },
            {
                title: "데이터 백업 시스템",
                description: "사용자 데이터의 안전한 백업과 복구 시스템 구축",
                category: "새로운 기회",
                priority: "보통"
            },
            {
                title: "모바일 최적화",
                description: "모바일 기기에서의 사용성을 개선하기 위한 반응형 디자인 적용",
                category: "사용자 니즈",
                priority: "높음"
            }
        ];
        
        let successCount = 0;
        
        sampleIdeas.forEach(idea => {
            try {
                const savedIdea = addIdea(idea);
                if (savedIdea) {
                    successCount++;
                }
            } catch (error) {
                console.warn('샘플 아이디어 추가 실패:', error);
            }
        });
        
        if (successCount > 0) {
            updateIdeaList();
            updateIdeaStats();
            if (typeof updateStats === 'function') {
                updateStats();
            }
            showSaveStatus(`${successCount}개의 샘플 아이디어가 추가되었습니다.`);
            return true;
        } else {
            throw new Error('샘플 아이디어 추가에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('샘플 아이디어 생성 중 오류:', error);
        showError('샘플 아이디어 생성 중 오류가 발생했습니다.');
        return false;
    }
}