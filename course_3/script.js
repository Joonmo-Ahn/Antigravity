/**
 * MBTI Personality Test - Course 3
 */

document.addEventListener('DOMContentLoaded', () => {
    // 16개 질문 (지표별 4개)
    const allQuestions = [
        { q: "주말에 약속이 없다면?", a: "나가지 않고 에너지를 충전한다", b: "친구들과 만나 즐겁게 보낸다", type: "EI", ansA: "I", ansB: "E" },
        { q: "새로운 사람들과의 모임에서 나는?", a: "익숙해질 때까지 지켜본다", b: "먼저 인사를 건네며 주도한다", type: "EI", ansA: "I", ansB: "E" },
        { q: "시끄러운 축제 현장에 다녀오면 내 상태는?", a: "기운이 다 빠져 혼자 있어야 한다", b: "오히려 새로운 에너지를 활기차게 얻는다", type: "EI", ansA: "I", ansB: "E" },
        { q: "처음 보는 사람에게 나는 보통 어떤 사람인가?", a: "조용하고 신중해 보이는 사람", b: "말이 많고 사교성이 좋아 보이는 사람", type: "EI", ansA: "I", ansB: "E" },

        { q: "어떤 일을 할 때 더 편안한 방식은?", a: "주어진 사실과 디테일에 집중하기", b: "창의적인 아이디어를 구상하기", type: "SN", ansA: "S", ansB: "N" },
        { q: "영화를 본 뒤에 내가 더 잘 기억하는 것은?", a: "주인공의 옷차림이나 소품 등 디테일", b: "영화가 전하려는 숨겨진 의미나 영감", type: "SN", ansA: "S", ansB: "N" },
        { q: "낯선 길을 찾을 때 내 스타일은?", a: "이정표나 큰 건물 위주로 기억한다", b: "전반적인 지도의 방향 위주로 기억한다", type: "SN", ansA: "S", ansB: "N" },
        { q: "사과를 보면 떠오르는 생각은?", a: "빨갛다, 아삭하다, 비타민C, 맛있다", b: "백설공주, 중력, 스티브 잡스, 로고", type: "SN", ansA: "S", ansB: "N" },

        { q: "친구가 속상한 일을 털어놓을 때 나는?", a: "왜 그런 상황이 생겼는지 따져본다", b: "많이 힘들었겠다고 위로를 먼저 한다", type: "TF", ansA: "T", ansB: "F" },
        { q: "의사결정을 내릴 때 내가 더 중요하게 생각하는 것은?", a: "객관적인 논리적 근거와 효율성", b: "주변 사람들과의 관계와 화합", type: "TF", ansA: "T", ansB: "F" },
        { q: "물건을 살 때 내가 더 중요하게 고려하는 기준은?", a: "제품의 스펙과 가성비", b: "디자인과 내가 느끼는 만족감", type: "TF", ansA: "T", ansB: "F" },
        { q: "잘못된 행동을 한 친구에게 해주고 싶은 말은?", a: "너의 행동이 논리적으로 왜 틀렸는지", b: "너의 행동 때문에 상대방이 상처받았는지", type: "TF", ansA: "T", ansB: "F" },

        { q: "여행 갈 때 일정을 짜는 나의 방식은?", a: "시간 단위로 계획을 꼼꼼하게 세운다", b: "큰 틀만 잡고 상황에 따라 자유롭게 움직인다", type: "JP", ansA: "J", ansB: "P" },
        { q: "마감 기한이 있는 과제를 할 때 나는?", a: "여유 있게 미리 끝내두는 편이다", b: "마지막 순간에 몰입해서 끝내는 편이다", type: "JP", ansA: "J", ansB: "P" },
        { q: "내 책상 위나 방 안을 어떻게 관리하는가?", a: "항상 제자리에 깔끔하게 정돈하는 편", b: "그때그때 편한 대로 어지럽혀져 있는 편", type: "JP", ansA: "J", ansB: "P" },
        { q: "약속 장소에 나가는 나의 습관은?", a: "보통 정해진 시간보다 5분 일찍 도착함", b: "딱 맞춰서 가거나 가끔 조금 늦기도 함", type: "JP", ansA: "J", ansB: "P" }
    ];

    // MBTI 결과별 정보 및 Sprite 좌표
    const mbtiResults = {
        "ENTJ": { title: "대담한 통솔자", desc: "분석적이고 결단력이 뛰어나며 대담한 리더 스타일입니다.", x: 0, y: 0 },
        "ENTP": { title: "뜨거운 논쟁을 즐기는 변론가", desc: "박식하고 상상력이 풍부하며 늘 새로운 도전을 즐기는 스타일입니다.", x: 1, y: 0 },
        "ENFJ": { title: "정의로운 사회운동가", desc: "사람들을 이끄는 카리스마와 따뜻한 마음을 가진 리더입니다.", x: 2, y: 0 },
        "ENFP": { title: "재기발랄한 활동가", desc: "자유롭고 창의적인 에너지가 넘치는 분위기 메이커입니다.", x: 3, y: 0 },
        "ESTJ": { title: "엄격한 관리자", desc: "질서와 규칙을 중시하며 업무를 효율적으로 관리하는 전문가입니다.", x: 0, y: 1 },
        "ESTP": { title: "모험을 즐기는 사업가", desc: "에너지가 넘치고 실천력이 뛰어나며 문제를 즉흥적으로 해결합니다.", x: 1, y: 1 },
        "ESFJ": { title: "사교적인 외교관", desc: "친화력이 뛰어나고 주변 사람들을 세심하게 챙기는 수호자입니다.", x: 2, y: 1 },
        "ESFP": { title: "자유로운 영혼의 연예인", desc: "낙천적이고 사람들을 즐겁게 만드는 탁월한 연예인 기질이 있습니다.", x: 3, y: 1 },
        "INTJ": { title: "용의주도한 전략가", desc: "독립적이고 분석적이며 목표 달성을 위해 철저히 계획하는 전략가입니다.", x: 0, y: 2 },
        "INTP": { title: "논리적인 사색가", desc: "끊임없이 탐구하고 질문하며 새로운 아이디어를 논리적으로 분석합니다.", x: 1, y: 2 },
        "INFJ": { title: "선의의 옹호자", desc: "이상주의적이고 통찰력이 뛰어나며 조용히 세상을 바꾸는 사람입니다.", x: 2, y: 2 },
        "INFP": { title: "열정적인 중재자", desc: "공감 능력이 뛰어나고 부드러우며 자신만의 신념을 위해 노력합니다.", x: 3, y: 2 },
        "ISTJ": { title: "청렴결백한 논리주의자", desc: "현실적이고 신중하며 철저하게 책임감을 다하는 완벽주의자입니다.", x: 0, y: 3 },
        "ISTP": { title: "만능 재주꾼", desc: "필요한 도구를 숙련되게 다루며 실용적인 해결책을 찾는 관찰자입니다.", x: 1, y: 3 },
        "ISFJ": { title: "용감한 수호자", desc: "차분하고 다정하며 소중한 이들을 위해 헌신하는 조용하지만 강한 분입니다.", x: 2, y: 3 },
        "ISFP": { title: "호기심 많은 예술가", desc: "따뜻하고 감각적이며 매 순간을 예술적으로 살아가는 영혼입니다.", x: 3, y: 3 }
    };

    let questionsPool = [];
    let currentIdx = 0;
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    // DOM 요소
    const onboardingSection = document.getElementById('onboardingSection');
    const questionSection = document.getElementById('questionSection');
    const resultSection = document.getElementById('resultSection');
    const startBtn = document.getElementById('startBtn');
    const retryBtn = document.getElementById('retryBtn');
    const qNumber = document.getElementById('qNumber');
    const qTitle = document.getElementById('qTitle');
    const choiceA = document.getElementById('choiceA');
    const choiceB = document.getElementById('choiceB');
    const progressBar = document.getElementById('progressBar');
    const resultMbti = document.getElementById('resultMbti');
    const resultTitle = document.getElementById('resultTitle');
    const resultDesc = document.getElementById('resultDesc');
    const resultImage = document.getElementById('resultImage');

    // 2. 테스트 초기화 및 시작
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            currentIdx = 0;
            Object.keys(scores).forEach(key => scores[key] = 0);
            
            // 지표별 2개씩 총 8개 랜덤 선택
            questionsPool = [
                ...getRandomSubarray(allQuestions.filter(q => q.type === "EI"), 2),
                ...getRandomSubarray(allQuestions.filter(q => q.type === "SN"), 2),
                ...getRandomSubarray(allQuestions.filter(q => q.type === "TF"), 2),
                ...getRandomSubarray(allQuestions.filter(q => q.type === "JP"), 2)
            ].sort(() => Math.random() - 0.5); // 전체 섞기

            onboardingSection.style.display = 'none';
            resultSection.style.display = 'none';
            questionSection.style.display = 'block';
            renderQuestion();
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            resultSection.style.display = 'none';
            onboardingSection.style.display = 'block';
        });
    }

    // 3. 렌더링 함수
    function renderQuestion() {
        const currentQ = questionsPool[currentIdx];
        qNumber.innerText = `Q${currentIdx + 1}`;
        qTitle.innerText = currentQ.q;
        
        // 선택지 랜덤 정렬
        const isFlipped = Math.random() > 0.5;
        if (isFlipped) {
            choiceA.innerText = currentQ.b;
            choiceA.dataset.ans = currentQ.ansB;
            choiceB.innerText = currentQ.a;
            choiceB.dataset.ans = currentQ.ansA;
        } else {
            choiceA.innerText = currentQ.a;
            choiceA.dataset.ans = currentQ.ansA;
            choiceB.innerText = currentQ.b;
            choiceB.dataset.ans = currentQ.ansB;
        }
        
        const progress = ((currentIdx + 1) / questionsPool.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // 4. 선택 처리
    function handleChoice(selection) {
        const ans = selection === 'A' ? choiceA.dataset.ans : choiceB.dataset.ans;
        scores[ans]++;

        currentIdx++;
        if (currentIdx < questionsPool.length) {
            renderQuestion();
        } else {
            showResult();
        }
    }

    choiceA.addEventListener('click', () => handleChoice('A'));
    choiceB.addEventListener('click', () => handleChoice('B'));

    // 5. 결과 계산 및 표시
    function showResult() {
        questionSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        const mbti = 
            (scores.E >= scores.I ? 'E' : 'I') +
            (scores.S >= scores.N ? 'S' : 'N') +
            (scores.T >= scores.F ? 'T' : 'F') +
            (scores.J >= scores.P ? 'J' : 'P');
            
        const resultInfo = mbtiResults[mbti];
        if (resultInfo) {
            resultMbti.innerText = mbti;
            resultTitle.innerText = resultInfo.title;
            resultDesc.innerText = resultInfo.desc;
            
            // Sprite 위치 계산 (4x4 그리드, 각 칸은 150px)
            const posX = resultInfo.x * -150;
            const posY = resultInfo.y * -150;
            resultImage.style.backgroundPosition = `${posX}px ${posY}px`;
        }
    }

    // 배열 무작위 추출 유틸리티
    function getRandomSubarray(arr, size) {
        return arr.sort(() => 0.5 - Math.random()).slice(0, size);
    }
});
