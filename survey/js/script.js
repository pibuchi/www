document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const checkboxes = document.querySelectorAll('input[name="difficult_tasks[]"]');
    const prioritySelects = ['priority1', 'priority2', 'priority3'];
    
    // 체크박스 개수 제한 (최대 3개)
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="difficult_tasks[]"]:checked').length;
            if (checkedCount > 3) {
                this.checked = false;
                alert('최대 3개까지만 선택할 수 있습니다.');
            }
        });
    });
    
    // 우선순위 중복 선택 방지
    prioritySelects.forEach((selectId, index) => {
        document.getElementById(selectId).addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue) {
                // 다른 select에서 같은 값이 선택되어 있다면 해제
                prioritySelects.forEach((otherId, otherIndex) => {
                    if (index !== otherIndex) {
                        const otherSelect = document.getElementById(otherId);
                        if (otherSelect.value === selectedValue) {
                            otherSelect.value = '';
                        }
                    }
                });
            }
        });
    });
    
    // 폼 제출 전 유효성 검사
    form.addEventListener('submit', function(e) {
        const checkedTasks = document.querySelectorAll('input[name="difficult_tasks[]"]:checked').length;
        if (checkedTasks === 0) {
            e.preventDefault();
            alert('질문 2번에서 최소 1개 이상 선택해주세요.');
            return;
        }
        
        const priorities = prioritySelects.map(id => document.getElementById(id).value);
        const uniquePriorities = [...new Set(priorities.filter(p => p))];
        if (uniquePriorities.length !== 3) {
            e.preventDefault();
            alert('질문 5번에서 1, 2, 3순위를 모두 다르게 선택해주세요.');
            return;
        }
    });
});