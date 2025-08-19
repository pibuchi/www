// 사용자 액션 모듈
export function initUserActions() {
    const mypageBtn = document.querySelector('.user-action-btn.mypage');
    const logoutBtn = document.querySelector('.user-action-btn.logout');
    
    if (mypageBtn) {
        mypageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 마이페이지 기능 구현
            alert('마이페이지로 이동합니다.');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 로그아웃 기능 구현
            if (confirm('정말 로그아웃 하시겠습니까?')) {
                alert('로그아웃되었습니다.');
            }
        });
    }
}
