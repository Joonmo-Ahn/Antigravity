document.addEventListener('DOMContentLoaded', () => {
    /** 
     * 1. 초기 메뉴 데이터 설정
     * 아이콘, 이름, 현재 투표수(기본 0)를 포함하는 배열
     */
    const menus = [
        { id: 'hamburger', name: '햄버거', icon: '🍔', votes: 0 },
        { id: 'pork-cutlet', name: '돈까스', icon: '🥩', votes: 0 },
        { id: 'chinese', name: '중국요리', icon: '🍜', votes: 0 },
        { id: 'mahachai', name: '마하차이', icon: '🥘', votes: 0 },
        { id: 'subway', name: '서브웨이', icon: '🥪', votes: 0 }
    ];

    /** 
     * 구글 시트 데이터 노출용 URL (CSV 포맷)
     * 이 URL은 시트의 데이터를 읽어오는 용도로 사용됩니다.
     */
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ycEuAkzXEjtxI520Xm4lJZLCz4Tcwrpe79Jccvq-irA/export?format=csv';

    // 투표 상태 관리를 위한 변수
    let selectedMenuId = null; // 현재 선택된 메뉴 ID
    let hasVoted = false;      // 이미 투표했는지 여부

    // 주요 DOM 엘리먼트 참조
    const menuCards = document.querySelectorAll('.menu-card');
    const voteBtn = document.getElementById('voteBtn');
    const resultList = document.getElementById('resultList');
    const totalVotesEl = document.getElementById('totalVotes');

    /**
     * 2. 데이터 동기화 함수
     * 구글 시트의 CSV 데이터를 가져와 현재 메뉴의 투표수를 업데이트함
     */
    async function syncDataWithSheet() {
        try {
            const response = await fetch(SHEET_URL);
            if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');

            const csvText = await response.text();
            // 줄바꿈으로 나누고 콤마루 구분하여 행/열 파싱
            const rows = csvText.trim().split(/\r?\n/).map(row => row.split(','));

            // 헤더 정보 제외 (Timestamp, Menu, Voter 가정)
            const votesData = rows.slice(1);

            // 투표수 초기화 후 다시 계산
            menus.forEach(menu => menu.votes = 0);

            // 파싱된 CSV 데이터를 순회하며 각 메뉴의 득표수 합산
            votesData.forEach(row => {
                const menuName = row[1]?.trim(); // 2번째 컬럼이 메뉴 이름
                if (!menuName) return;

                const targetMenu = menus.find(m => m.name === menuName);
                if (targetMenu) {
                    targetMenu.votes += 1;
                }
            });

            // 계산된 결과로 UI 업데이트
            updateResults();
        } catch (error) {
            console.error('Fetch error:', error);
            // 에러 시 현재 표시 중인 결과 유지
            updateResults();
        }
    }

    /**
     * 3. 결과 UI 업데이트 함수
     * @param {boolean} animate - 결과 바 애니메이션 효과 적용 여부
     */
    function updateResults(animate = false) {
        const totalVotes = menus.reduce((sum, menu) => sum + menu.votes, 0);
        totalVotesEl.innerText = totalVotes.toLocaleString();

        resultList.innerHTML = '';

        menus.forEach(menu => {
            // 득표율 계산
            const percentage = totalVotes > 0 ? (menu.votes / totalVotes * 100).toFixed(1) : 0;

            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-label">
                    <span>${menu.icon} ${menu.name}</span>
                    <span>${menu.votes}표 (${percentage}%)</span>
                </div>
                <div class="result-bar-container">
                    <div class="result-bar" data-width="${percentage}" style="width: ${animate ? '0%' : percentage + '%'}"></div>
                </div>
            `;
            resultList.appendChild(resultItem);
        });

        // 애니메이션 효과가 필요한 경우(투표 직후 등) 지연 실행
        if (animate) {
            setTimeout(() => {
                const bars = document.querySelectorAll('.result-bar');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
            }, 50);
        }
    }

    /**
     * 4. 메뉴 카드 클릭 (선택) 로직
     */
    menuCards.forEach(card => {
        card.addEventListener('click', () => {
            if (hasVoted) return; // 이미 투표했다면 반응하지 않음

            // 선택 스타일 토글링
            menuCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedMenuId = card.dataset.menu;
            voteBtn.disabled = false; // 메뉴 선택 시 투표 버튼 활성화
        });
    });

    /**
     * 5. 투표하기 버튼 클릭 (기록) 로직
     * Vercel API 또는 로컬 Express API인 /api/vote를 호출함
     */
    voteBtn.addEventListener('click', async () => {
        if (!selectedMenuId || hasVoted) return;

        const targetMenu = menus.find(m => m.id === selectedMenuId);
        if (!targetMenu) return;

        // 낙관적 UI 업데이트 (사용자의 즉각적인 피드백을 위해 서버 확인 전 UI 선반영)
        targetMenu.votes += 1;
        hasVoted = true;

        // 투표 중 상태 표시
        voteBtn.innerText = '투표 기록 중...';
        voteBtn.disabled = true;
        voteBtn.style.background = '#2EC4B6';

        // 메뉴 카드 비활성화 시각 효과
        menuCards.forEach(card => {
            card.style.cursor = 'default';
            if (card.dataset.menu !== selectedMenuId) {
                card.style.opacity = '0.5';
            }
        });

        // 결과 영역으로 스크롤 이동
        updateResults(true);
        document.getElementById('resultsArea').scrollIntoView({ behavior: 'smooth', block: 'start' });

        try {
            // API 서버로 투표 데이터 전송 (POST)
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menuName: targetMenu.name })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '투표 실패');
            }

            voteBtn.innerText = '투표 완료!';
            // 서버 기록 완료 후 1초 뒤에 다시 시트 데이터와 동기화 (최신 정합성 유지)
            setTimeout(syncDataWithSheet, 1000);

        } catch (error) {
            console.error('API Error:', error);
            alert('기록 중 오류: ' + error.message + '\n서버 설정 및 환경 변수를 확인하세요.');

            // 오류 발생 시 낙관적 업데이트 롤백 (원래 상태로 복구)
            targetMenu.votes -= 1;
            hasVoted = false;
            voteBtn.innerText = '투표하기';
            voteBtn.disabled = false;
            voteBtn.style.background = '';

            menuCards.forEach(card => {
                card.style.cursor = 'pointer';
                card.style.opacity = '1';
                card.classList.remove('selected');
            });
            selectedMenuId = null;
            updateResults(false);
        }
    });

    // 6. 초기 실행 및 주기적 업데이트
    syncDataWithSheet(); // 페이지 로드 시 즉시 데이터 동기화
    setInterval(syncDataWithSheet, 30000); // 30초마다 자동으로 실시간 동기화
});
