// =========================
// 데이터 관리자 (수정된 버전)
// =========================

// 전역 데이터 저장소
let researchData = {
    observations: [],
    interviews: [],
    shadowTracking: [],
    photoDiaries: [],
    ideas: [],
    webcrawling: []
};

/**
 * 데이터를 저장소에 저장
 */
function saveDataToStorage() {
    try {
        // 브라우저 환경에서는 메모리에만 저장
        window.ethnographyData = JSON.parse(JSON.stringify(researchData));
        console.log('데이터가 저장되었습니다:', researchData);
        
        // 추가 저장 로직이 필요한 경우 여기에 구현
        // 예: 서버 API 호출, IndexedDB 저장 등
        
        return true;
    } catch (error) {
        console.error('데이터 저장 중 오류:', error);
        showError('데이터 저장 중 오류가 발생했습니다.');
        return false;
    }
}

/**
 * 저장소에서 데이터 로드
 */
function loadDataFromStorage() {
    try {
        if (window.ethnographyData) {
            researchData = JSON.parse(JSON.stringify(window.ethnographyData));
            console.log('데이터가 로드되었습니다:', researchData);
        }
        
        // 데이터 구조 검증 및 초기화
        if (!researchData.observations) researchData.observations = [];
        if (!researchData.interviews) researchData.interviews = [];
        if (!researchData.shadowTracking) researchData.shadowTracking = [];
        if (!researchData.photoDiaries) researchData.photoDiaries = [];
        if (!researchData.ideas) researchData.ideas = [];
        if (!researchData.webcrawling) researchData.webcrawling = [];
        
        return true;
    } catch (error) {
        console.error('데이터 로드 중 오류:', error);
        showError('데이터 로드 중 오류가 발생했습니다.');
        
        // 오류 시 기본 구조로 초기화
        researchData = {
            observations: [],
            interviews: [],
            shadowTracking: [],
            photoDiaries: [],
            ideas: [],
            webcrawling: []
        };
        return false;
    }
}

/**
 * 관찰조사 데이터 추가
 */
function addObservation(data) {
    try {
        if (!data) {
            throw new Error('데이터가 제공되지 않았습니다.');
        }

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
        const saveResult = saveDataToStorage();
        
        if (saveResult) {
            return observation;
        } else {
            throw new Error('저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('관찰조사 데이터 추가 중 오류:', error);
        showError('관찰조사 데이터 추가 중 오류가 발생했습니다.');
        return null;
    }
}

/**
 * 인터뷰 데이터 추가
 */
function addInterview(data) {
    try {
        if (!data) {
            throw new Error('데이터가 제공되지 않았습니다.');
        }

        const interview = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            ...data
        };
        
        // 배열 초기화 확인
        if (!Array.isArray(researchData.interviews)) {
            researchData.interviews = [];
        }
        
        researchData.interviews.push(interview);
        const saveResult = saveDataToStorage();
        
        if (saveResult) {
            return interview;
        } else {
            throw new Error('저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('인터뷰 데이터 추가 중 오류:', error);
        showError('인터뷰 데이터 추가 중 오류가 발생했습니다.');
        return null;
    }
}

/**
 * 쉐도우 트래킹 데이터 추가
 */
function addShadowData(data) {
    try {
        if (!data) {
            throw new Error('데이터가 제공되지 않았습니다.');
        }

        const activity = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            ...data
        };
        
        // 배열 초기화 확인
        if (!Array.isArray(researchData.shadowTracking)) {
            researchData.shadowTracking = [];
        }
        
        researchData.shadowTracking.push(activity);
        const saveResult = saveDataToStorage();
        
        if (saveResult) {
            return activity;
        } else {
            throw new Error('저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('쉐도우 트래킹 데이터 추가 중 오류:', error);
        showError('쉐도우 트래킹 데이터 추가 중 오류가 발생했습니다.');
        return null;
    }
}

/**
 * 포토다이어리 데이터 추가
 */
function addPhotoDiary(data) {
    try {
        if (!data) {
            throw new Error('데이터가 제공되지 않았습니다.');
        }

        const diary = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            ...data
        };
        
        // 배열 초기화 확인
        if (!Array.isArray(researchData.photoDiaries)) {
            researchData.photoDiaries = [];
        }
        
        researchData.photoDiaries.push(diary);
        const saveResult = saveDataToStorage();
        
        if (saveResult) {
            return diary;
        } else {
            throw new Error('저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('포토다이어리 데이터 추가 중 오류:', error);
        showError('포토다이어리 데이터 추가 중 오류가 발생했습니다.');
        return null;
    }
}

/**
 * 아이디어 데이터 추가
 */
function addIdea(data) {
    try {
        if (!data) {
            throw new Error('데이터가 제공되지 않았습니다.');
        }

        // 필수 필드 검증
        if (!data.title || !data.description) {
            throw new Error('제목과 설명은 필수 항목입니다.');
        }

        const idea = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            title: data.title,
            description: data.description,
            category: data.category || '미분류',
            priority: data.priority || '보통'
        };
        
        // 배열 초기화 확인
        if (!Array.isArray(researchData.ideas)) {
            researchData.ideas = [];
        }
        
        researchData.ideas.push(idea);
        const saveResult = saveDataToStorage();
        
        if (saveResult) {
            console.log('아이디어가 성공적으로 추가되었습니다:', idea);
            return idea;
        } else {
            throw new Error('저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('아이디어 데이터 추가 중 오류:', error);
        showError('아이디어 데이터 추가 중 오류가 발생했습니다: ' + error.message);
        return null;
    }
}

/**
 * 데이터 삭제
 */
function removeData(type, id) {
    try {
        if (!type || !id) {
            throw new Error('타입과 ID가 필요합니다.');
        }

        if (!researchData[type] || !Array.isArray(researchData[type])) {
            throw new Error(`유효하지 않은 데이터 타입: ${type}`);
        }

        const index = researchData[type].findIndex(item => item && item.id === id);
        if (index > -1) {
            researchData[type].splice(index, 1);
            const saveResult = saveDataToStorage();
            return saveResult;
        }
        
        throw new Error('삭제할 데이터를 찾을 수 없습니다.');
    } catch (error) {
        console.error('데이터 삭제 중 오류:', error);
        showError('데이터 삭제 중 오류가 발생했습니다: ' + error.message);
        return false;
    }
}

/**
 * 데이터 수정
 */
function updateData(type, id, newData) {
    try {
        if (!type || !id || !newData) {
            throw new Error('타입, ID, 새 데이터가 모두 필요합니다.');
        }

        if (!researchData[type] || !Array.isArray(researchData[type])) {
            throw new Error(`유효하지 않은 데이터 타입: ${type}`);
        }

        const index = researchData[type].findIndex(item => item && item.id === id);
        if (index > -1) {
            researchData[type][index] = {
                ...researchData[type][index],
                ...newData,
                updatedAt: getCurrentTimestamp()
            };
            
            const saveResult = saveDataToStorage();
            if (saveResult) {
                return researchData[type][index];
            } else {
                throw new Error('저장에 실패했습니다.');
            }
        }
        
        throw new Error('수정할 데이터를 찾을 수 없습니다.');
    } catch (error) {
        console.error('데이터 수정 중 오류:', error);
        showError('데이터 수정 중 오류가 발생했습니다: ' + error.message);
        return null;
    }
}

/**
 * 특정 타입의 모든 데이터 가져오기
 */
function getData(type, sortBy = 'timestamp', ascending = false) {
    try {
        if (!type) {
            console.warn('데이터 타입이 지정되지 않았습니다.');
            return [];
        }

        if (!researchData[type]) {
            console.warn(`존재하지 않는 데이터 타입: ${type}`);
            return [];
        }

        if (!Array.isArray(researchData[type])) {
            console.warn(`${type}이 배열이 아닙니다. 초기화합니다.`);
            researchData[type] = [];
            return [];
        }
        
        // 유효한 데이터만 필터링
        const validData = researchData[type].filter(item => item && item.id);
        
        return safeSortByDate(validData, sortBy, ascending);
    } catch (error) {
        console.error('데이터 조회 중 오류:', error);
        return [];
    }
}

/**
 * 전체 데이터 통계
 */
function getDataStats() {
    try {
        const stats = {
            totalObservations: 0,
            totalInterviews: 0,
            totalShadowActivities: 0,
            totalPhotoDiaries: 0,
            totalIdeas: 0,
            totalWebcrawling: 0,
            totalDataPoints: 0
        };

        // 각 데이터 타입별 카운트
        if (Array.isArray(researchData.observations)) {
            stats.totalObservations = researchData.observations.length;
        }
        if (Array.isArray(researchData.interviews)) {
            stats.totalInterviews = researchData.interviews.length;
        }
        if (Array.isArray(researchData.shadowTracking)) {
            stats.totalShadowActivities = researchData.shadowTracking.length;
        }
        if (Array.isArray(researchData.photoDiaries)) {
            stats.totalPhotoDiaries = researchData.photoDiaries.length;
        }
        if (Array.isArray(researchData.ideas)) {
            stats.totalIdeas = researchData.ideas.length;
        }
        if (Array.isArray(researchData.webcrawling)) {
            stats.totalWebcrawling = researchData.webcrawling.length;
        }

        // 전체 데이터 포인트 계산
        stats.totalDataPoints = stats.totalObservations + stats.totalInterviews + 
                               stats.totalShadowActivities + stats.totalPhotoDiaries + 
                               stats.totalIdeas + stats.totalWebcrawling;

        return stats;
    } catch (error) {
        console.error('데이터 통계 계산 중 오류:', error);
        return {
            totalObservations: 0,
            totalInterviews: 0,
            totalShadowActivities: 0,
            totalPhotoDiaries: 0,
            totalIdeas: 0,
            totalWebcrawling: 0,
            totalDataPoints: 0
        };
    }
}

/**
 * 데이터 검색
 */
function searchData(query, types = null) {
    try {
        if (!query || !query.trim()) {
            return [];
        }

        const searchTypes = types || ['observations', 'interviews', 'shadowTracking', 'photoDiaries', 'ideas', 'webcrawling'];
        const results = [];
        const searchTerm = query.toLowerCase();
        
        searchTypes.forEach(type => {
            if (researchData[type] && Array.isArray(researchData[type])) {
                const filtered = researchData[type].filter(item => {
                    if (!item) return false;
                    
                    try {
                        const searchFields = Object.values(item).join(' ').toLowerCase();
                        return searchFields.includes(searchTerm);
                    } catch (e) {
                        console.warn('검색 중 아이템 처리 오류:', e);
                        return false;
                    }
                });
                
                results.push(...filtered.map(item => ({ ...item, type })));
            }
        });
        
        return results;
    } catch (error) {
        console.error('데이터 검색 중 오류:', error);
        return [];
    }
}

/**
 * 데이터 내보내기
 */
function exportAllData() {
    try {
        const exportData = {
            exportDate: getCurrentTimestamp(),
            version: '1.0',
            summary: getDataStats(),
            data: {
                observations: researchData.observations || [],
                interviews: researchData.interviews || [],
                shadowTracking: researchData.shadowTracking || [],
                photoDiaries: researchData.photoDiaries || [],
                ideas: researchData.ideas || [],
                webcrawling: researchData.webcrawling || []
            }
        };
        
        return exportData;
    } catch (error) {
        console.error('데이터 내보내기 중 오류:', error);
        throw error;
    }
}

/**
 * 데이터 가져오기
 */
function importData(jsonData) {
    try {
        console.log('데이터 가져오기 시작:', typeof jsonData);
        
        if (!jsonData) {
            throw new Error('데이터가 제공되지 않았습니다.');
        }
        
        let importedData;
        try {
            importedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        } catch (parseError) {
            throw new Error('JSON 파싱 실패: ' + parseError.message);
        }
        
        if (!importedData || typeof importedData !== 'object') {
            throw new Error('유효하지 않은 데이터 형식입니다.');
        }
        
        console.log('가져온 데이터 구조:', Object.keys(importedData));
        
        if (!importedData.data) {
            throw new Error('데이터 섹션을 찾을 수 없습니다.');
        }
        
        let importCount = 0;
        let errorCount = 0;
        
        // 각 데이터 타입별로 안전하게 병합
        const dataTypes = ['observations', 'interviews', 'shadowTracking', 'photoDiaries', 'ideas', 'webcrawling'];
        
        dataTypes.forEach(type => {
            try {
                if (importedData.data[type] && Array.isArray(importedData.data[type])) {
                    console.log(`${type} 데이터 가져오는 중...`);
                    
                    // 유효한 데이터만 필터링
                    const validItems = importedData.data[type].filter(item => {
                        if (!item || typeof item !== 'object') {
                            console.warn(`유효하지 않은 ${type} 아이템:`, item);
                            return false;
                        }
                        
                        // 필수 필드 검증 (타입별로 다름)
                        if (type === 'ideas') {
                            return item.title && item.description;
                        } else if (type === 'observations') {
                            return item.notes;
                        } else if (type === 'interviews') {
                            return item.transcript;
                        } else {
                            return item.id; // 기본적으로 ID만 확인
                        }
                    });
                    
                    console.log(`${type}에서 ${validItems.length}개의 유효한 아이템 발견`);
                    
                    if (validItems.length > 0) {
                        // 기존 데이터와 병합
                        if (!Array.isArray(researchData[type])) {
                            researchData[type] = [];
                        }
                        
                        // 중복 ID 제거
                        const existingIds = new Set(researchData[type].map(item => item.id).filter(id => id));
                        const newItems = validItems.filter(item => !existingIds.has(item.id));
                        
                        // 새 ID 할당 (ID가 없거나 중복인 경우)
                        newItems.forEach(item => {
                            if (!item.id || existingIds.has(item.id)) {
                                item.id = generateId();
                            }
                            if (!item.timestamp) {
                                item.timestamp = getCurrentTimestamp();
                            }
                        });
                        
                        researchData[type] = [...researchData[type], ...newItems];
                        importCount += newItems.length;
                        
                        console.log(`${type}에 ${newItems.length}개 아이템 추가됨`);
                    }
                } else {
                    console.log(`${type} 데이터가 없거나 배열이 아님`);
                }
            } catch (typeError) {
                console.error(`${type} 데이터 처리 중 오류:`, typeError);
                errorCount++;
            }
        });
        
        if (importCount > 0) {
            const saveResult = saveDataToStorage();
            if (saveResult) {
                let message = `${importCount}개의 데이터를 성공적으로 가져왔습니다.`;
                if (errorCount > 0) {
                    message += ` (${errorCount}개 타입에서 오류 발생)`;
                }
                showSaveStatus(message);
                
                // UI 업데이트
                if (typeof updateStats === 'function') updateStats();
                if (typeof updateAllLists === 'function') updateAllLists();
                
                return true;
            } else {
                throw new Error('데이터 저장에 실패했습니다.');
            }
        } else {
            throw new Error('가져올 수 있는 유효한 데이터가 없습니다.');
        }
        
    } catch (error) {
        console.error('데이터 가져오기 중 오류:', error);
        showError('데이터 가져오기 중 오류가 발생했습니다: ' + error.message);
        return false;
    }
}

/**
 * 데이터 초기화
 */
function clearAllData() {
    try {
        const confirmed = confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
        
        if (confirmed) {
            researchData = {
                observations: [],
                interviews: [],
                shadowTracking: [],
                photoDiaries: [],
                ideas: [],
                webcrawling: []
            };
            
            const saveResult = saveDataToStorage();
            if (saveResult) {
                showSaveStatus('모든 데이터가 초기화되었습니다.');
                // UI 업데이트
                if (typeof updateStats === 'function') updateStats();
                if (typeof updateAllLists === 'function') updateAllLists();
            }
            return saveResult;
        }
        
        return false;
    } catch (error) {
        console.error('데이터 초기화 중 오류:', error);
        showError('데이터 초기화 중 오류가 발생했습니다.');
        return false;
    }
}

/**
 * 백업 생성
 */
function createBackup() {
    try {
        const backup = {
            backupDate: getCurrentTimestamp(),
            data: JSON.parse(JSON.stringify(researchData))
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ethnography_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSaveStatus('백업이 생성되었습니다.');
        return true;
    } catch (error) {
        console.error('백업 생성 중 오류:', error);
        showError('백업 생성 중 오류가 발생했습니다.');
        return false;
    }
}

/**
 * 데이터 유효성 검증
 */
function validateData() {
    try {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // 기본 구조 검증
        const requiredTypes = ['observations', 'interviews', 'shadowTracking', 'photoDiaries', 'ideas', 'webcrawling'];
        
        requiredTypes.forEach(type => {
            if (!researchData[type]) {
                researchData[type] = [];
                validation.warnings.push(`${type} 배열이 초기화되었습니다.`);
            } else if (!Array.isArray(researchData[type])) {
                researchData[type] = [];
                validation.warnings.push(`${type}이 배열이 아니어서 초기화되었습니다.`);
            }
        });

        // 데이터 무결성 검증
        requiredTypes.forEach(type => {
            const invalidItems = researchData[type].filter(item => 
                !item || !item.id || !item.timestamp
            );
            
            if (invalidItems.length > 0) {
                validation.errors.push(`${type}에 ${invalidItems.length}개의 무효한 항목이 있습니다.`);
                validation.isValid = false;
            }
        });

        return validation;
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
 * 데이터 복구
 */
function repairData() {
    try {
        const validation = validateData();
        
        if (!validation.isValid) {
            // 무효한 데이터 제거
            Object.keys(researchData).forEach(type => {
                if (Array.isArray(researchData[type])) {
                    researchData[type] = researchData[type].filter(item => 
                        item && item.id && item.timestamp
                    );
                }
            });
            
            const saveResult = saveDataToStorage();
            if (saveResult) {
                showSaveStatus('데이터가 복구되었습니다.');
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('데이터 복구 중 오류:', error);
        showError('데이터 복구 중 오류가 발생했습니다.');
        return false;
    }
}