document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (!menuToggle || !sidebar || !sidebarOverlay) return;

  // 메뉴 토글 함수
  const toggleSidebar = () => {
    const isHidden = sidebar.classList.contains("hidden");
    
    if (isHidden) {
      // 사이드바 표시
      sidebar.classList.remove("hidden");
      sidebarOverlay.classList.add("active");
    } else {
      // 사이드바 숨김
      sidebar.classList.add("hidden");
      sidebarOverlay.classList.remove("active");
    }
  };

  // 메뉴 아이콘 클릭 이벤트
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  // 오버레이 클릭 시 사이드바 닫기
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    sidebarOverlay.classList.remove("active");
  });

  // 사이드바 외부 클릭 시 닫기 (선택사항)
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      if (!sidebar.classList.contains("hidden")) {
        sidebar.classList.add("hidden");
        sidebarOverlay.classList.remove("active");
      }
    }
  });
});

