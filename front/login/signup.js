// 회원가입 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  const pwInputs = document.querySelectorAll('#signupPw, #signupPwConfirm');
  const pwToggleBtns = document.querySelectorAll('.pw-toggle-btn');
  
  // 이메일 입력 관련 요소
  const emailPrefix = document.getElementById('emailPrefix');
  const emailDomain = document.getElementById('emailDomain');
  const emailDomainCustom = document.getElementById('emailDomainCustom');
  const signupId = document.getElementById('signupId');
  
  // 약관 동의 체크박스
  const agreeAll = document.getElementById('agreeAll');
  const termCheckboxes = document.querySelectorAll('.term-checkbox');
  const agreeAge = document.getElementById('agreeAge');
  const agreeTerms = document.getElementById('agreeTerms');
  const agreePrivacy = document.getElementById('agreePrivacy');
  
  // 이메일 도메인 선택 변경 이벤트
  emailDomain.addEventListener('change', function() {
    if (this.value === 'custom') {
      // 기타 선택 시 직접 입력 필드 표시
      emailDomainCustom.style.display = 'block';
      emailDomainCustom.required = true;
      emailDomainCustom.value = '';
      emailDomainCustom.focus();
      updateEmailValue();
    } else if (this.value === '') {
      // 선택 안 함
      emailDomainCustom.style.display = 'none';
      emailDomainCustom.required = false;
      signupId.value = '';
    } else {
      // 일반 도메인 선택
      emailDomainCustom.style.display = 'none';
      emailDomainCustom.required = false;
      updateEmailValue();
    }
  });
  
  // 이메일 앞부분 또는 도메인 변경 시 전체 이메일 업데이트
  emailPrefix.addEventListener('input', updateEmailValue);
  emailDomainCustom.addEventListener('input', updateEmailValue);
  
  // 전체 이메일 값 업데이트 함수
  function updateEmailValue() {
    const prefix = emailPrefix.value.trim();
    let domain = '';
    
    if (emailDomain.value === 'custom') {
      domain = emailDomainCustom.value.trim();
    } else if (emailDomain.value) {
      domain = emailDomain.value;
    }
    
    if (prefix && domain) {
      signupId.value = prefix + '@' + domain;
    } else {
      signupId.value = '';
    }
  }

  // 비밀번호 보기/숨기기 토글
  pwToggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const input = pwInputs[index];
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });

  // 비밀번호 확인 검증
  const pwConfirmInput = document.getElementById('signupPwConfirm');
  const pwInput = document.getElementById('signupPw');

  pwConfirmInput.addEventListener('input', function() {
    if (pwInput.value !== pwConfirmInput.value && pwConfirmInput.value !== '') {
      pwConfirmInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
      pwConfirmInput.style.borderColor = '#e53e3e';
    } else {
      pwConfirmInput.setCustomValidity('');
      pwConfirmInput.style.borderColor = '#e2e8f0';
    }
  });

  pwInput.addEventListener('input', function() {
    if (pwInput.value !== pwConfirmInput.value && pwConfirmInput.value !== '') {
      pwConfirmInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
      pwConfirmInput.style.borderColor = '#e53e3e';
    } else {
      pwConfirmInput.setCustomValidity('');
      pwConfirmInput.style.borderColor = '#e2e8f0';
    }
  });

  // 비밀번호 유효성 검증 (10자 이상, 영문, 숫자, 특수문자 포함)
  pwInput.addEventListener('blur', function() {
    const password = pwInput.value;
    const hasLength = password.length >= 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password && (!hasLength || !hasLetter || !hasNumber || !hasSpecial)) {
      pwInput.setCustomValidity('비밀번호는 10자 이상이면서 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
      pwInput.style.borderColor = '#e53e3e';
    } else {
      pwInput.setCustomValidity('');
      pwInput.style.borderColor = '#e2e8f0';
    }
  });

  // 모두 동의하기 기능
  agreeAll.addEventListener('change', function() {
    const isChecked = agreeAll.checked;
    termCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
  });

  // 개별 체크박스 변경 시 모두 동의 체크박스 상태 업데이트
  termCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const allChecked = Array.from(termCheckboxes).every(cb => cb.checked);
      agreeAll.checked = allChecked;
    });
  });

  // 폼 제출 처리
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 이메일 유효성 검증
    updateEmailValue();
    const emailValue = signupId.value;
    if (!emailValue || !emailValue.includes('@')) {
      alert('이메일을 올바르게 입력해주세요.');
      if (!emailPrefix.value) {
        emailPrefix.focus();
      } else if (emailDomain.value === 'custom' && !emailDomainCustom.value) {
        emailDomainCustom.focus();
      } else if (!emailDomain.value) {
        emailDomain.focus();
      }
      return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    // 필수 약관 동의 확인
    if (!agreeAge.checked || !agreeTerms.checked || !agreePrivacy.checked) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }

    // 비밀번호 확인
    if (pwInput.value !== pwConfirmInput.value) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 유효성 검증
    const password = pwInput.value;
    const hasLength = password.length >= 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasLength || !hasLetter || !hasNumber || !hasSpecial) {
      alert('비밀번호는 10자 이상이면서 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
      return;
    }
    
    const formData = {
      id: emailValue,
      password: pwInput.value,
      nickname: document.getElementById('signupNickname').value,
      email: emailValue  // ID가 이메일이므로 동일한 값 사용
    };

    // 여기에 실제 회원가입 API 호출 로직을 추가하세요
    console.log('회원가입 데이터:', formData);
    
    // 성공 메시지 (실제로는 서버 응답에 따라 처리)
    alert('회원가입이 완료되었습니다! 🎉');
    
    // 로그인 페이지로 이동
    // window.location.href = 'index.html';
  });

  // 소셜 로그인 버튼 클릭 이벤트
  const socialBtns = document.querySelectorAll('.social-btn');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const btnText = this.querySelector('.social-text').textContent;
      console.log(`${btnText} 클릭됨`);
      // 여기에 소셜 로그인 로직을 추가하세요
    });
  });
});

