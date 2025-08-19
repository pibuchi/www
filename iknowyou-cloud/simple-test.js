const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>iknowyou.cloud - 테스트</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; }
            .success { background: #28a745; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌐 iknowyou.cloud</h1>
            <div class="success">
                ✅ 서버가 정상적으로 실행되고 있습니다!
            </div>
            <p><strong>서버 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            <p><strong>요청 URL:</strong> ${req.url}</p>
            <p><strong>요청 메서드:</strong> ${req.method}</p>
            <hr>
            <h3>🔧 테스트 링크</h3>
            <p><a href="/health" style="color: white;">헬스체크: /health</a></p>
            <p><a href="/api/health" style="color: white;">API 헬스체크: /api/health</a></p>
            <p><a href="/ai/health" style="color: white;">AI 헬스체크: /ai/health</a></p>
        </div>
    </body>
    </html>
    `;
    
    res.end(html);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 시작되었습니다!`);
    console.log(`📱 접속: http://localhost:${PORT}`);
    console.log(`🌐 DuckDNS: http://pibuchi.duckdns.org:${PORT}`);
});

process.on('SIGINT', () => {
    console.log('\n🛑 서버 종료...');
    server.close();
    process.exit(0);
}); 
