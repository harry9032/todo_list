// ID/PW 찾기 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const findTabs = document.querySelectorAll('.find-tab');
  const findIdForm = document.getElementById('findIdForm');
  const findPwForm = document.getElementById('findPwForm');
  const findIdResult = document.getElementById('findIdResult');
  const findPwResult = document.getElementById('findPwResult');

  // 탭 전환 기능
  findTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // 모든 탭 비활성화
      findTabs.forEach(t => t.classList.remove('active'));
      // 클릭한 탭 활성화
      this.classList.add('active');
      
      // 폼 전환
      if (targetTab === 'find-id') {
        findIdForm.style.display = 'block';
        findPwForm.style.display = 'none';
        // 결과 영역 숨기기
        findIdResult.style.display = 'none';
        findPwResult.style.display = 'none';
      } else {
        findIdForm.style.display = 'none';
        findPwForm.style.display = 'block';
        // 결과 영역 숨기기
        findIdResult.style.display = 'none';
        findPwResult.style.display = 'none';
      }
    });
  });

  // ID 찾기 폼 제출
  const findIdFormElement = document.getElementById('findIdForm');
  findIdFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('findIdEmail').value;
    const nickname = document.getElementById('findIdNickname').value;
    
    // 여기에 실제 ID 찾기 API 호출 로직을 추가하세요
    // 예시: 서버에서 이메일과 닉네임으로 ID를 찾는 로직
    
    // 임시 데이터 (실제로는 서버 응답을 받아야 함)
    const foundId = 'user123'; // 실제로는 서버에서 받아온 ID
    
    // 결과 표시
    const resultText = findIdResult.querySelector('.result-text');
    resultText.textContent = `찾으신 ID는 "${foundId}" 입니다.`;
    findIdResult.style.display = 'block';
    
    // 성공 메시지
    console.log('ID 찾기 요청:', { email, nickname });
  });

  // PW 찾기 폼 제출
  const findPwFormElement = document.getElementById('findPwForm');
  findPwFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('findPwId').value;
    const email = document.getElementById('findPwEmail').value;
    const nickname = document.getElementById('findPwNickname').value;
    
    // 여기에 실제 PW 찾기 API 호출 로직을 추가하세요
    // 예시: 서버에서 ID, 이메일, 닉네임으로 비밀번호 재설정 링크를 보내는 로직
    
    // 결과 표시
    const resultText = findPwResult.querySelector('.result-text');
    resultText.textContent = `비밀번호 재설정 링크를 ${email}로 전송했습니다. 이메일을 확인해주세요.`;
    findPwResult.style.display = 'block';
    
    // 성공 메시지
    console.log('PW 찾기 요청:', { id, email, nickname });
  });
});

