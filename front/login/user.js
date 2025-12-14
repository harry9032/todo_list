// 비밀번호 수정 모드
function editPassword() {
  const pwInput = document.getElementById('userPw');
  const toggleBtn = document.querySelector('.pw-toggle');
  
  if (pwInput.readOnly) {
    pwInput.readOnly = false;
    pwInput.type = 'password';
    pwInput.value = '';
    pwInput.placeholder = '새 비밀번호를 입력하세요';
    toggleBtn.textContent = '✓';
    toggleBtn.setAttribute('onclick', 'savePassword()');
  }
}

// 비밀번호 저장
function savePassword() {
  const pwInput = document.getElementById('userPw');
  const toggleBtn = document.querySelector('.pw-toggle');
  
  if (pwInput.value.length < 4) {
    alert('비밀번호는 최소 4자 이상이어야 합니다.');
    return;
  }
  
  // 여기에 실제 비밀번호 저장 로직 추가
  pwInput.readOnly = true;
  pwInput.type = 'text';
  pwInput.value = '********';
  toggleBtn.textContent = '✏️';
  toggleBtn.setAttribute('onclick', 'editPassword()');
  
  alert('비밀번호가 변경되었습니다.');
}

// 닉네임 저장
function saveNickname() {
  const nicknameInput = document.getElementById('userNickname');
  
  if (!nicknameInput.value.trim()) {
    alert('닉네임을 입력해주세요.');
    return;
  }
  
  // 여기에 실제 닉네임 저장 로직 추가
  alert('닉네임이 변경되었습니다.');
}

// 회원정보 저장
function saveUserInfo() {
  const email = document.getElementById('userEmail').value;
  const phone = document.getElementById('userPhone').value;
  
  // 여기에 실제 정보 저장 로직 추가
  alert('회원정보가 저장되었습니다.');
}

// 고정시간 저장
function saveTimeSettings() {
  const sleepStart = document.getElementById('sleepStart').value;
  const sleepEnd = document.getElementById('sleepEnd').value;
  const workStart = document.getElementById('workStart').value;
  const workEnd = document.getElementById('workEnd').value;
  
  // 여기에 실제 시간 설정 저장 로직 추가
  alert('고정시간이 저장되었습니다.');
}

// 계정 삭제
function deleteAccount() {
  if (confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    if (confirm('계정 삭제를 최종 확인합니다. 계속하시겠습니까?')) {
      // 여기에 실제 계정 삭제 로직 추가
      alert('계정이 삭제되었습니다.');
      // 로그인 페이지로 리다이렉트
      // window.location.href = 'index.html';
    }
  }
}

