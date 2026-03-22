const axios = require('axios');

/**
 * 구글 시투 투표 API 핸들러 (Vercel 및 로컬 Express에서 사용 가능)
 * 이 버전은 Google Apps Script (Web App) URL을 호출하는 방식입니다.
 */
module.exports = async function handler(req, res) {
    // CORS 설정: 모든 도메인에서의 요청 허용 (로컬 테스트 및 보안 완화)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 브라우저의 사전 요청(Preflight) 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 오직 POST 요청만 처리함
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { menuName } = req.body;
        
        // 필수 데이터 검증
        if (!menuName) {
            return res.status(400).json({ message: '메뉴 이름이 필요합니다.' });
        }

        // 구글 Apps Script Web App URL 가져오기
        const scriptUrl = process.env.GOOGLE_WEB_APP_URL;

        if (!scriptUrl) {
            console.error('Missing Google Web App URL.');
            return res.status(500).json({ message: '서버 설정 오류: 구글 웹앱 URL이 없습니다.' });
        }

        // 구글 Apps Script로 데이터 전송 (POST)
        const response = await axios.post(scriptUrl, { menuName }, {
            headers: {
                // Apps Script 요청 시 Content-Type 지정
                'Content-Type': 'application/json' 
            }
        });

        // 성공 응답 반환 (Apps Script가 넘겨준 결과를 그대로 활용)
        if (response.data.success) {
            res.status(200).json({ success: true, message: '투표가 기록되었습니다.' });
        } else {
            throw new Error(response.data.error || '알 수 없는 에러');
        }

    } catch (error) {
        console.error('Error appending to sheet:', error.message);
        res.status(500).json({ message: '스프레드시트 기록 중 오류가 발생했습니다.', error: error.message });
    }
}
