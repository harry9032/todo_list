document.addEventListener("DOMContentLoaded", () => {
  const pwInput = document.getElementById("userPw");
  const toggleBtn = document.querySelector(".pw-toggle");

  if (!pwInput || !toggleBtn) return;

  // 마우스를 누르고 있는 동안만 보이도록
  const showPassword = () => {
    pwInput.type = "text";
  };

  const hidePassword = () => {
    pwInput.type = "password";
  };

  // 마우스
  toggleBtn.addEventListener("mousedown", showPassword);
  toggleBtn.addEventListener("mouseup", hidePassword);
  toggleBtn.addEventListener("mouseleave", hidePassword);

  // 터치(모바일)
  toggleBtn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // 클릭 동시 발생 방지
    showPassword();
  });

  toggleBtn.addEventListener("touchend", hidePassword);
});
