// ================================
// 📁 crawler.js 파일 (별도 파일!)
// backend 폴더에 저장하세요!
// ================================

const puppeteer = require('puppeteer');

async function crawlWebsite(config) {
    const { url, keywords = [], maxResults = 10 } = config;
    
    console.log('🌐 브라우저 시작 중...');
    
    // 브라우저 실행 옵션
    const browser = await puppeteer.launch({
        headless: false,  // 브라우저 창이 보이게 (디버깅용)
        slowMo: 50,      // 동작을 천천히 (50ms 지연)
        defaultViewport: {
            width: 1280,
            height: 800
        },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ]
    });
    
    const page = await browser.newPage();
    
    // User-Agent 설정 (봇으로 인식되지 않도록)
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    
    try {
        console.log(`📖 페이지 방문 중: ${url}`);
        
        // 페이지 방문 (타임아웃 30초)
        await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('🔍 데이터 추출 중...');
        
        // 페이지에서 데이터 추출
        const data = await page.evaluate((maxResults, keywords) => {
            const results = [];
            
            // 다양한 요소들에서 텍스트 추출
            const selectors = [
                'p',        // 문단
                'div',      // 일반 컨테이너
                'span',     // 인라인 텍스트
                'h1, h2, h3, h4, h5, h6',  // 제목들
                'article',  // 기사 내용
                'section',  // 섹션
                'li',       // 목록 항목
                'td',       // 테이블 셀
                '.content', // 일반적인 컨텐츠 클래스
                '.text',    // 텍스트 클래스
                '.post',    // 포스트 클래스
                '.comment'  // 댓글 클래스
            ];
            
            // 모든 선택자에 대해 요소 찾기
            const allElements = [];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                allElements.push(...Array.from(elements));
            });
            
            // 중복 제거 (같은 요소가 여러 선택자에 매칭될 수 있음)
            const uniqueElements = Array.from(new Set(allElements));
            
            for (let i = 0; i < uniqueElements.length && results.length < maxResults; i++) {
                const element = uniqueElements[i];
                const text = element.textContent?.trim();
                
                // 텍스트 필터링
                if (text && 
                    text.length >= 10 &&     // 최소 10글자
                    text.length <= 1000 &&   // 최대 1000글자
                    !text.includes('javascript:') &&  // 자바스크립트 코드 제외
                    !text.includes('function(') &&    // 함수 코드 제외
                    !/^[\s\n\t]*$/.test(text)        // 공백만 있는 텍스트 제외
                ) {
                    
                    // 키워드 필터링 (키워드가 있는 경우)
                    let includeItem = true;
                    if (keywords && keywords.length > 0) {
                        includeItem = keywords.some(keyword => 
                            text.toLowerCase().includes(keyword.toLowerCase())
                        );
                    }
                    
                    if (includeItem) {
                        results.push({
                            text: text,
                            tag: element.tagName?.toLowerCase(),
                            className: element.className || '',
                            id: element.id || '',
                            length: text.length,
                            timestamp: new Date().toISOString(),
                            url: window.location.href
                        });
                    }
                }
            }
            
            return results;
        }, maxResults, keywords);
        
        console.log(`✅ ${data.length}개 데이터 추출 완료!`);
        
        // 브라우저 종료
        await browser.close();
        
        return data;
        
    } catch (error) {
        console.error('❌ 크롤링 중 오류 발생:', error.message);
        await browser.close();
        throw new Error(`크롤링 실패: ${error.message}`);
    }
}

module.exports = { 
    crawlWebsite
};