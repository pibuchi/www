const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let filePath = '';
    
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'test-connection.html');
    } else if (req.url === '/health') {
        // 헬스체크 엔드포인트
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'iknowyou-test-server',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            message: '도메인 연결 테스트 서버가 정상 작동 중입니다!'
        }));
        return;
    } else if (req.url === '/api/health') {
        // API 서버 헬스체크 (모킹)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'iknowyou-api-server',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        }));
        return;
    } else if (req.url === '/ai/health') {
        // AI 서버 헬스체크 (모킹)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            pinecone_connected: true,
            version: '1.0.0',
            timestamp: new Date().toISOString()
        }));
        return;
    } else {
        filePath = path.join(__dirname, req.url);
    }
    
    // 파일 확장자에 따른 Content-Type 설정
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (ext) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    
    // 파일 읽기
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 파일을 찾을 수 없습니다</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - 서버 오류</h1>');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 iknowyou.cloud 테스트 서버가 포트 ${PORT}에서 시작되었습니다!`);
    console.log(`📱 접속 URL: http://localhost:${PORT}`);
    console.log(`🌐 DuckDNS 도메인: http://pibuchi.duckdns.org:${PORT}`);
    console.log(`🔧 헬스체크: http://localhost:${PORT}/health`);
    console.log(`⏰ 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 서버를 종료합니다...');
    server.close(() => {
        console.log('✅ 서버가 안전하게 종료되었습니다.');
        process.exit(0);
    });
}); 
