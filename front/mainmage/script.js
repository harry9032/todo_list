// 전역 변수
let todos = [];
let fixedTimes = [];
let currentCondition = {
  value: 1.0,
  label: '보통'
};
let editingTodoId = null;

// 카테고리 색상 매핑
const categoryColors = {
  work: { bg: '#dbeafe', color: '#1e40af', label: '업무' },
  study: { bg: '#e9d5ff', color: '#6b21a8', label: '공부' },
  exercise: { bg: '#fce7f3', color: '#9f1239', label: '운동' },
  personal: { bg: '#d1fae5', color: '#065f46', label: '개인' },
  other: { bg: '#fef3c7', color: '#92400e', label: '기타' }
};

// DOM 요소
const todoList = document.getElementById('todoList');
const scheduleContainer = document.getElementById('scheduleContainer');
const availableTimeEl = document.getElementById('availableTime');
const overlay = document.getElementById('overlay');

// 팝업 요소
const conditionPopup = document.getElementById('conditionPopup');
const fixedTimePopup = document.getElementById('fixedTimePopup');
const todoPopup = document.getElementById('todoPopup');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  renderTodoList();
  renderFixedTimeList();
  renderSchedule();
  updateAvailableTime();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
  // 헤더 버튼
  document.getElementById('conditionBtn').addEventListener('click', () => openPopup(conditionPopup));
  document.getElementById('fixedTimeBtn').addEventListener('click', () => {
    renderFixedTimeList();
    openPopup(fixedTimePopup);
  });
  document.getElementById('addTodoBtn').addEventListener('click', () => {
    editingTodoId = null;
    document.getElementById('todoPopupTitle').textContent = '할 일 추가';
    document.getElementById('deleteTodo').style.display = 'none';
    resetTodoForm();
    openPopup(todoPopup);
  });

  // 팝업 닫기
  document.getElementById('closeConditionPopup').addEventListener('click', () => closePopup(conditionPopup));
  document.getElementById('closeFixedTimePopup').addEventListener('click', () => closePopup(fixedTimePopup));
  document.getElementById('closeTodoPopup').addEventListener('click', () => closePopup(todoPopup));

  // 컨디션 선택
  document.querySelectorAll('.condition-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.condition-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('saveCondition').addEventListener('click', saveCondition);
  document.getElementById('saveFixedTime').addEventListener('click', saveFixedTime);
  document.getElementById('cancelFixedTime').addEventListener('click', () => {
    resetFixedTimeForm();
    closePopup(fixedTimePopup);
  });
  document.getElementById('saveTodo').addEventListener('click', saveTodo);
  document.getElementById('cancelTodo').addEventListener('click', () => closePopup(todoPopup));
  document.getElementById('deleteTodo').addEventListener('click', deleteTodo);

  // 우선순위 설정
  document.getElementById('priorityBtn').addEventListener('click', enableDragAndDrop);

  // 오버레이 클릭
  overlay.addEventListener('click', () => {
    closeAllPopups();
  });
}

// 팝업 열기/닫기
function openPopup(popup) {
  popup.classList.add('active');
  overlay.classList.add('active');
}

function closePopup(popup) {
  popup.classList.remove('active');
  overlay.classList.remove('active');
}

function closeAllPopups() {
  closePopup(conditionPopup);
  closePopup(fixedTimePopup);
  closePopup(todoPopup);
}

// 컨디션 저장
function saveCondition() {
  const activeBtn = document.querySelector('.condition-btn.active');
  if (activeBtn) {
    currentCondition = {
      value: parseFloat(activeBtn.dataset.value),
      label: activeBtn.dataset.label
    };
    updateAvailableTime();
    renderSchedule();
    closePopup(conditionPopup);
  }
}

// 고정 시간 저장
function saveFixedTime() {
  const startTime = document.getElementById('fixedStartTime').value;
  const endTime = document.getElementById('fixedEndTime').value;
  const title = document.getElementById('fixedTimeTitle').value;

  if (!startTime || !endTime || !title) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  // 시간 계산 (하루를 넘어가는 경우 처리)
  const startHour = parseInt(startTime.split(':')[0]);
  const startMinute = parseInt(startTime.split(':')[1]);
  const endHour = parseInt(endTime.split(':')[0]);
  const endMinute = parseInt(endTime.split(':')[1]);
  
  let durationHours = 0;
  if (endHour > startHour || (endHour === startHour && endMinute > startMinute)) {
    // 같은 날 내 시간
    durationHours = endHour - startHour + (endMinute - startMinute) / 60;
  } else {
    // 다음날로 넘어가는 경우 (예: 22:00 ~ 06:00)
    durationHours = (24 - startHour - startMinute / 60) + (endHour + endMinute / 60);
  }

  // 총 고정 시간 계산
  const totalFixedHours = calculateTotalFixedHours();
  const newTotalFixedHours = totalFixedHours + durationHours;

  if (newTotalFixedHours > 24) {
    alert(`고정 시간이 24시간을 초과할 수 없습니다.\n현재: ${totalFixedHours.toFixed(1)}시간, 추가 후: ${newTotalFixedHours.toFixed(1)}시간`);
    return;
  }

  fixedTimes.push({
    id: Date.now(),
    start: startTime,
    end: endTime,
    title: title
  });

  fixedTimes.sort((a, b) => {
    const aStart = parseInt(a.start.split(':')[0]);
    const bStart = parseInt(b.start.split(':')[0]);
    return aStart - bStart;
  });
  
  resetFixedTimeForm();
  renderFixedTimeList();
  renderSchedule();
  updateAvailableTime();
}

// 고정 시간 삭제
function deleteFixedTime(id) {
  fixedTimes = fixedTimes.filter(ft => ft.id !== id);
  renderFixedTimeList();
  renderSchedule();
  updateAvailableTime();
}

// 고정 시간 목록 렌더링
function renderFixedTimeList() {
  const fixedTimeListEl = document.getElementById('fixedTimeList');
  if (!fixedTimeListEl) return;
  
  if (fixedTimes.length === 0) {
    fixedTimeListEl.innerHTML = '<p style="color: #999; font-size: 13px; margin-bottom: 16px;">등록된 고정 시간이 없습니다.</p>';
    return;
  }
  
  let html = '<div style="margin-bottom: 16px;"><strong style="font-size: 14px; display: block; margin-bottom: 8px;">등록된 고정 시간:</strong>';
  fixedTimes.forEach(ft => {
    const startHour = parseInt(ft.start.split(':')[0]);
    const startMinute = parseInt(ft.start.split(':')[1]);
    const endHour = parseInt(ft.end.split(':')[0]);
    const endMinute = parseInt(ft.end.split(':')[1]);
    
    let durationHours = 0;
    if (endHour > startHour || (endHour === startHour && endMinute > startMinute)) {
      durationHours = endHour - startHour + (endMinute - startMinute) / 60;
    } else {
      durationHours = (24 - startHour - startMinute / 60) + (endHour + endMinute / 60);
    }
    
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f6f7fb; border-radius: 6px; margin-bottom: 8px;">
        <div>
          <span style="font-weight: 600; font-size: 13px;">${ft.title}</span>
          <span style="color: #666; font-size: 12px; margin-left: 8px;">${ft.start} ~ ${ft.end}</span>
          <span style="color: #999; font-size: 11px; margin-left: 8px;">(${durationHours.toFixed(1)}시간)</span>
        </div>
        <button onclick="deleteFixedTime(${ft.id})" style="background: #fee2e2; color: #b91c1c; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">삭제</button>
      </div>
    `;
  });
  html += '</div>';
  fixedTimeListEl.innerHTML = html;
}

// 할 일 저장
function saveTodo() {
  const title = document.getElementById('todoTitle').value.trim();
  const category = document.getElementById('todoCategory').value;
  const duration = parseInt(document.getElementById('todoDuration').value);

  if (!title || !category || !duration) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  if (editingTodoId !== null) {
    // 수정
    const todo = todos.find(t => t.id === editingTodoId);
    if (todo) {
      todo.title = title;
      todo.category = category;
      todo.duration = duration;
    }
  } else {
    // 추가
    todos.push({
      id: Date.now(),
      title: title,
      category: category,
      duration: duration,
      completed: false,
      order: todos.length
    });
  }

  resetTodoForm();
  closePopup(todoPopup);
  renderTodoList();
  renderSchedule();
}

// 할 일 삭제
function deleteTodo() {
  if (editingTodoId !== null) {
    todos = todos.filter(t => t.id !== editingTodoId);
    resetTodoForm();
    closePopup(todoPopup);
    renderTodoList();
    renderSchedule();
  }
}

// 할 일 목록 렌더링
function renderTodoList() {
  todoList.innerHTML = '';
  
  const sortedTodos = [...todos].sort((a, b) => a.order - b.order);

  sortedTodos.forEach(todo => {
    const item = createTodoItem(todo);
    todoList.appendChild(item);
  });
}

// 할 일 아이템 생성
function createTodoItem(todo) {
  const item = document.createElement('div');
  item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  item.draggable = true;
  item.dataset.id = todo.id;

  const checkbox = document.createElement('div');
  checkbox.className = `todo-checkbox ${todo.completed ? 'checked' : ''}`;
  checkbox.addEventListener('click', () => toggleTodo(todo.id));

  const content = document.createElement('div');
  content.className = 'todo-content';

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.title;

  const category = document.createElement('span');
  category.className = `todo-category ${todo.category}`;
  category.textContent = categoryColors[todo.category]?.label || todo.category;

  content.appendChild(text);
  content.appendChild(category);

  const options = document.createElement('button');
  options.className = 'todo-options';
  options.addEventListener('click', (e) => {
    e.stopPropagation();
    editTodo(todo.id);
  });

  item.appendChild(checkbox);
  item.appendChild(content);
  item.appendChild(options);

  // 드래그 이벤트
  item.addEventListener('dragstart', handleDragStart);
  item.addEventListener('dragover', handleDragOver);
  item.addEventListener('drop', handleDrop);
  item.addEventListener('dragend', handleDragEnd);

  return item;
}

// 할 일 완료 토글
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodoList();
    renderSchedule();
  }
}

// 할 일 수정
function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    editingTodoId = id;
    document.getElementById('todoPopupTitle').textContent = '할 일 수정';
    document.getElementById('deleteTodo').style.display = 'inline-block';
    document.getElementById('todoTitle').value = todo.title;
    document.getElementById('todoCategory').value = todo.category;
    document.getElementById('todoDuration').value = todo.duration;
    openPopup(todoPopup);
  }
}

// 드래그 앤 드롭
let draggedElement = null;

function enableDragAndDrop() {
  document.querySelectorAll('.todo-item').forEach(item => {
    item.draggable = true;
  });
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  
  const afterElement = getDragAfterElement(todoList, e.clientY);
  const dragging = document.querySelector('.dragging');
  
  if (afterElement == null) {
    todoList.appendChild(dragging);
  } else {
    todoList.insertBefore(dragging, afterElement);
  }
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}

function handleDragEnd() {
  this.classList.remove('dragging');
  
  // 순서 업데이트
  const items = Array.from(todoList.querySelectorAll('.todo-item'));
  items.forEach((item, index) => {
    const id = parseInt(item.dataset.id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.order = index;
    }
  });
  
  draggedElement = null;
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 일정표 렌더링
function renderSchedule() {
  scheduleContainer.innerHTML = '';
  
  // 시간 슬롯 생성 (24시간)
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push({
      hour: i,
      type: 'available',
      content: null
    });
  }

  // 고정 시간 배정
  fixedTimes.forEach(ft => {
    const startHour = parseInt(ft.start.split(':')[0]);
    const startMinute = parseInt(ft.start.split(':')[1]);
    const endHour = parseInt(ft.end.split(':')[0]);
    const endMinute = parseInt(ft.end.split(':')[1]);
    
    // 시간 포맷팅 함수
    const formatTime = (hour, minute) => {
      const period = hour >= 12 ? '오후' : '오전';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${period} ${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };
    
    const startTimeStr = formatTime(startHour, startMinute);
    const endTimeStr = formatTime(endHour, endMinute);
    const displayText = `${ft.title} ~ ${endTimeStr}`;
    
    if (endHour > startHour || (endHour === startHour && endMinute > startMinute)) {
      // 같은 날 내 시간
      // 시작 시간 슬롯에만 제목 표시
      if (timeSlots[startHour]) {
        timeSlots[startHour] = {
          hour: startHour,
          type: 'fixed',
          content: displayText,
          fixedTime: ft,
          isStart: true
        };
      }
      
      // 중간 시간들은 물결 표시
      for (let h = startHour + 1; h < endHour; h++) {
        if (timeSlots[h]) {
          timeSlots[h] = {
            hour: h,
            type: 'fixed',
            content: '~',
            fixedTime: ft,
            isMiddle: true
          };
        }
      }
      
      // 종료 시간 슬롯
      if (endMinute > 0 && timeSlots[endHour]) {
        timeSlots[endHour] = {
          hour: endHour,
          type: 'fixed',
          content: '~',
          fixedTime: ft,
          isEnd: true
        };
      } else if (endHour !== startHour && timeSlots[endHour]) {
        timeSlots[endHour] = {
          hour: endHour,
          type: 'fixed',
          content: '~',
          fixedTime: ft,
          isEnd: true
        };
      }
    } else {
      // 다음날로 넘어가는 경우 (예: 22:00 ~ 06:00)
      // 시작 시간 슬롯에 제목 표시
      if (timeSlots[startHour]) {
        timeSlots[startHour] = {
          hour: startHour,
          type: 'fixed',
          content: displayText,
          fixedTime: ft,
          isStart: true
        };
      }
      
      // 시작 시간 이후부터 자정까지 물결 표시
      for (let h = startHour + 1; h < 24; h++) {
        if (timeSlots[h]) {
          timeSlots[h] = {
            hour: h,
            type: 'fixed',
            content: '~',
            fixedTime: ft,
            isMiddle: true
          };
        }
      }
      
      // 자정부터 종료 시간 전까지 물결 표시
      for (let h = 0; h < endHour; h++) {
        if (timeSlots[h]) {
          timeSlots[h] = {
            hour: h,
            type: 'fixed',
            content: '~',
            fixedTime: ft,
            isMiddle: true
          };
        }
      }
      
      // 종료 시간 슬롯
      if (endMinute > 0 && timeSlots[endHour]) {
        timeSlots[endHour] = {
          hour: endHour,
          type: 'fixed',
          content: '~',
          fixedTime: ft,
          isEnd: true
        };
      }
    }
  });

  // 사용 가능 시간 계산
  const availableHours = calculateAvailableHours();
  
  // 할 일 배정
  const uncompletedTodos = todos.filter(t => !t.completed).sort((a, b) => a.order - b.order);
  let currentHour = 0;
  
  uncompletedTodos.forEach(todo => {
    const durationHours = Math.ceil(todo.duration / 60);
    let assigned = false;
    
    for (let h = currentHour; h < 24 && !assigned; h++) {
      if (timeSlots[h].type === 'available' && h + durationHours <= availableHours) {
        for (let i = 0; i < durationHours && h + i < 24; i++) {
          if (timeSlots[h + i].type === 'available') {
            timeSlots[h + i] = {
              hour: h + i,
              type: 'todo',
              content: i === 0 ? todo : null,
              todo: todo
            };
            if (i === 0) {
              assigned = true;
              currentHour = h + durationHours;
            }
          }
        }
      }
    }
  });

  // 일정표 렌더링
  timeSlots.forEach((slot, index) => {
    const item = document.createElement('div');
    item.className = `schedule-item ${slot.type}`;
    
    const time = document.createElement('div');
    time.className = 'schedule-time';
    time.textContent = `${String(index).padStart(2, '0')}:00`;
    
    const content = document.createElement('div');
    content.className = 'schedule-content';
    
    if (slot.content) {
      const title = document.createElement('span');
      title.className = 'schedule-title';
      
      if (slot.todo) {
        // 할 일인 경우
        title.textContent = slot.content.title || slot.content;
        const category = document.createElement('span');
        category.className = `schedule-category ${slot.todo.category}`;
        category.style.background = categoryColors[slot.todo.category]?.bg || '#f3f4f6';
        category.style.color = categoryColors[slot.todo.category]?.color || '#666';
        category.textContent = categoryColors[slot.todo.category]?.label || slot.todo.category;
        content.appendChild(title);
        content.appendChild(category);
      } else {
        // 고정 시간인 경우
        title.textContent = slot.content;
        if (slot.isMiddle) {
          title.classList.add('middle');
        }
        content.appendChild(title);
      }
    }
    
    item.appendChild(time);
    item.appendChild(content);
    scheduleContainer.appendChild(item);
  });
}

// 총 고정 시간 계산
function calculateTotalFixedHours() {
  return fixedTimes.reduce((total, ft) => {
    const startHour = parseInt(ft.start.split(':')[0]);
    const startMinute = parseInt(ft.start.split(':')[1]);
    const endHour = parseInt(ft.end.split(':')[0]);
    const endMinute = parseInt(ft.end.split(':')[1]);
    
    let durationHours = 0;
    if (endHour > startHour || (endHour === startHour && endMinute > startMinute)) {
      // 같은 날 내 시간
      durationHours = endHour - startHour + (endMinute - startMinute) / 60;
    } else {
      // 다음날로 넘어가는 경우 (예: 22:00 ~ 06:00)
      durationHours = (24 - startHour - startMinute / 60) + (endHour + endMinute / 60);
    }
    
    return total + durationHours;
  }, 0);
}

// 사용 가능 시간 계산
function calculateAvailableHours() {
  const fixedHours = calculateTotalFixedHours();
  const availableHours = (24 - fixedHours) * currentCondition.value;
  return Math.max(0, Math.floor(availableHours));
}

// 사용 가능 시간 업데이트
function updateAvailableTime() {
  const hours = calculateAvailableHours();
  availableTimeEl.textContent = `${hours}시간`;
}

// 폼 리셋
function resetTodoForm() {
  document.getElementById('todoTitle').value = '';
  document.getElementById('todoCategory').value = '';
  document.getElementById('todoDuration').value = '';
}

function resetFixedTimeForm() {
  document.getElementById('fixedStartTime').value = '';
  document.getElementById('fixedEndTime').value = '';
  document.getElementById('fixedTimeTitle').value = '';
}

