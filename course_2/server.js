/**
 * 로컬 개발 및 테스트를 위한 Express 서버 (server.js)
 * 이 서버는 정적 파일(HTML, CSS, JS)을 호스팅하고, 
 * 구글 시트 연동을 위한 API 요청을 프록시합니다.
 */
require('dotenv').config(); // .env 파일에서 환경 변수 로드
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const voteHandler = require('./api/vote'); // 기존 Vercel API 핸들러 재사용

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 교차 출처 리소스 공유 허용
app.use(bodyParser.json()); // JSON 형태의 요청 본문 파싱
app.use(express.static(path.join(__dirname, '/'))); // 현재 폴더의 정적 파일들을 웹에 노출

/**
 * 투표 기록을 위한 POST API 엔드포인트
 * 프론트엔드(script.js)에서 /api/vote로 요청을 보낼 때 실행됨
 */
app.post('/api/vote', async (req, res) => {
    try {
        // 기존 api/vote.js의 비즈니스 로직을 호출
        await voteHandler(req, res);
    } catch (error) {
        console.error('Local Server Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: '내부 서버 오류', error: error.message });
        }
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 로컬 테스트 서버가 실행 중입니다: http://localhost:${PORT}`);
    console.log(`📍 투표 API 경로: http://localhost:${PORT}/api/vote`);
});
