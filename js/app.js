/* ================================================================
   StreakDayscore · js/app.js
   github.com/Mihai-gitto/streakdayscore
   ================================================================ */
'use strict';

const ZONES = {
  spirituality: { col: 'var(--c-spirit)', bg: 'var(--c-spirit-bg)', textCol: 'var(--c-spirit-text)', label: 'Spirituality' },
  health:       { col: 'var(--c-sport)',  bg: 'var(--c-sport-bg)',  textCol: 'var(--c-sport-text)',  label: 'Health' },
  professional: { col: 'var(--c-pro)',    bg: 'var(--c-pro-bg)',    textCol: 'var(--c-pro-text)',    label: 'Professional' },
  family:       { col: 'var(--c-fam)',    bg: 'var(--c-fam-bg)',    textCol: 'var(--c-fam-text)',    label: 'Family' },
  other:        { col: 'var(--c-other)',  bg: 'var(--c-other-bg)',  textCol: 'var(--c-other-text)',  label: 'Other' },
};

const ZONE_TITLES = {
  all: 'All', spirituality: 'Spirituality', health: 'Health & Sport',
  professional: 'Professional', family: 'Family & Relations', other: 'Other',
};

const DEFAULT_STATE = {
  habits: [
    { id: 1, name: 'Read the Bible',           zone: 'spirituality', pts: 10, note: '10–15 min in the morning' },
    { id: 2, name: 'Workout / Exercise',        zone: 'health',       pts: 15, note: 'Follow weekly training plan' },
    { id: 3, name: 'Watch a learning video',    zone: 'professional', pts: 8,  note: 'Any topic, any domain' },
    { id: 4, name: 'Quality time with family',  zone: 'family',       pts: 10, note: 'Present, no phone' },
  ],
  tasks: [
    { id: 100, name: 'Read a book for 20 min', zone: 'professional', pts: 8, deadline: '', note: '' },
    { id: 101, name: 'Evening prayer',          zone: 'spirituality', pts: 7, deadline: '', note: '' },
  ],
  done: {}, totalXP: 0, level: 1,
};

let state, activeZone = 'all', modalType = 'habit', editId = null;
const STORAGE_KEY = 'streakdayscore_v1';
const XP_PER_LEVEL = 100;

function loadState() {
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(DEFAULT_STATE); }
  catch { state = structuredClone(DEFAULT_STATE); }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function today() { return new Date().toISOString().split('T')[0]; }
function uid() { return Date.now() + Math.floor(Math.random() * 9999); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function todayDone() { return state.done[today()] || {}; }
function computeLevel(xp) { return Math.floor(xp / XP_PER_LEVEL) + 1; }
function xpInLevel(xp) { return xp % XP_PER_LEVEL; }
function xpToNext(xp) { return XP_PER_LEVEL - xpInLevel(xp); }
function filteredHabits() { return activeZone === 'all' ? state.habits : state.habits.filter(h => h.zone === activeZone); }
function filteredTasks()  { return activeZone === 'all' ? state.tasks  : state.tasks.filter(t => t.zone === activeZone); }

/* ── Build item HTML ── */
function buildItemHTML(item, type) {
  const z = ZONES[item.zone] || ZONES.other;
  const done = !!todayDone()[item.id];
  const checkIcon = done ? '<i class="ti ti-check" aria-hidden="true"></i>' : '';
  const deadlineStr = item.deadline ? ` · ${escHtml(item.deadline)}` : '';
  const noteStr = item.note ? ` · ${escHtml(item.note)}` : '';

  return `
    <div class="swipe-wrapper" data-id="${item.id}" data-type="${type}">
      <div class="swipe-actions">
        <button class="swipe-action-btn edit" data-id="${item.id}" data-type="${type}" aria-label="Edit"><i class="ti ti-edit"></i></button>
        <button class="swipe-action-btn delete" data-id="${item.id}" data-type="${type}" aria-label="Delete"><i class="ti ti-trash"></i></button>
      </div>
      <div class="item-card${done ? ' done' : ''}"
           data-id="${item.id}" data-pts="${item.pts}" data-type="${type}" data-name="${escHtml(item.name)}"
           role="checkbox" aria-checked="${done}" tabindex="0">
        <div class="check-circle">${checkIcon}</div>
        <div class="zone-pip" style="background:${z.col}" aria-hidden="true"></div>
        <div class="item-info">
          <div class="item-name">${escHtml(item.name)}</div>
          <div class="item-sub">${z.label}${deadlineStr}${noteStr}</div>
        </div>
        <div class="pts-badge" style="background:${z.bg};color:${z.textCol}">${item.pts} XP</div>
        <div class="item-actions">
          <button class="act-btn edit-btn" data-id="${item.id}" data-type="${type}" aria-label="Edit"><i class="ti ti-edit" aria-hidden="true"></i></button>
          <button class="act-btn del-btn"  data-id="${item.id}" data-type="${type}" aria-label="Delete"><i class="ti ti-trash" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>`;
}

/* ── Render ── */
function renderList(items, containerId, type) {
  const el = document.getElementById(containerId);
  if (!items.length) { el.innerHTML = `<div class="empty-state">No ${type === 'habit' ? 'habits' : 'tasks'} yet — add one ↑</div>`; return; }
  el.innerHTML = items.map(it => buildItemHTML(it, type)).join('');
  attachSwipe(el);
  attachLongPress(el);
}

function renderStats() {
  const done = todayDone();
  const all = [...state.habits, ...state.tasks];
  const doneN = all.filter(i => done[i.id]).length;
  const ptsN  = all.filter(i => done[i.id]).reduce((s,i) => s + i.pts, 0);
  const pct   = all.length ? Math.round(doneN / all.length * 100) : 0;
  document.getElementById('st-done').textContent = doneN;
  document.getElementById('st-pts').textContent  = ptsN;
  document.getElementById('st-pct').textContent  = pct + '%';
  const xp = state.totalXP || 0;
  state.level = computeLevel(xp);
  document.getElementById('level-n').textContent     = state.level;
  document.getElementById('xp-label').textContent    = `${xp} XP total`;
  document.getElementById('xp-next-lbl').textContent = `next level: ${xpToNext(xp)} XP`;
  document.getElementById('xp-fill').style.width     = xpInLevel(xp) + '%';
  document.getElementById('streak-lbl').textContent  = pct > 0 ? `🔥 ${pct}% completed today` : 'Check off your first item today!';
}

function render() {
  renderList(filteredHabits(), 'habits-list', 'habit');
  renderList(filteredTasks(),  'tasks-list',  'task');
  renderStats();
}

/* ── Toggle done ── */
function markDone(id, pts) {
  const d = today();
  if (!state.done[d]) state.done[d] = {};
  state.done[d][id] = true;
  state.totalXP = (state.totalXP || 0) + pts;
  saveState(); render(); showToast(`+${pts} XP 🎯`);
}
function unmark(id, pts) {
  const d = today();
  if (state.done[d]) delete state.done[d][id];
  state.totalXP = Math.max(0, (state.totalXP || 0) - pts);
  saveState(); render(); showToast('Check removed');
}

function deleteItem(id, type) {
  const key = type === 'habit' ? 'habits' : 'tasks';
  state[key] = state[key].filter(x => x.id !== id);
  Object.keys(state.done).forEach(day => delete state.done[day][id]);
  saveState(); render(); showToast('Deleted');
}

/* ── Swipe to edit/delete ── */
function attachSwipe(container) {
  container.querySelectorAll('.swipe-wrapper').forEach(wrapper => {
    const card = wrapper.querySelector('.item-card');
    let startX = 0, currentX = 0, isSwiping = false;
    const MAX_SWIPE = 152;

    card.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isSwiping = false;
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 8) isSwiping = true;
      if (!isSwiping || dx > 0) return;
      currentX = Math.max(dx, -MAX_SWIPE);
      card.classList.add('swiping');
      card.style.transform = `translateX(${currentX}px)`;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.classList.remove('swiping');
      if (currentX < -60) {
        card.style.transform = `translateX(-${MAX_SWIPE}px)`;
      } else {
        card.style.transform = '';
      }
      currentX = 0;
    });

    // Swipe action buttons
    wrapper.querySelector('.swipe-action-btn.edit').addEventListener('click', e => {
      e.stopPropagation();
      card.style.transform = '';
      openModal(card.dataset.type, +card.dataset.id);
    });
    wrapper.querySelector('.swipe-action-btn.delete').addEventListener('click', e => {
      e.stopPropagation();
      card.style.transform = '';
      if (confirm('Delete this item?')) deleteItem(+card.dataset.id, card.dataset.type);
    });
  });
}

/* ── Long press action sheet (mobile) ── */
function attachLongPress(container) {
  container.querySelectorAll('.item-card').forEach(card => {
    let timer;

    const start = () => {
      timer = setTimeout(() => showActionSheet(card), 500);
    };
    const cancel = () => clearTimeout(timer);

    card.addEventListener('touchstart', start, { passive: true });
    card.addEventListener('touchend',   cancel);
    card.addEventListener('touchmove',  cancel);
  });
}

function showActionSheet(card) {
  const id   = +card.dataset.id;
  const pts  = +card.dataset.pts;
  const type = card.dataset.type;
  const name = card.dataset.name;

  // vibrate for feedback
  if (navigator.vibrate) navigator.vibrate(40);

  const overlay = document.createElement('div');
  overlay.className = 'action-sheet-overlay';
  overlay.innerHTML = `
    <div class="action-sheet">
      <div class="action-sheet-title">${escHtml(name)}</div>
      <button class="action-sheet-btn" id="as-check">
        <i class="ti ti-check" aria-hidden="true"></i>
        ${todayDone()[id] ? 'Uncheck' : 'Mark as done'}
      </button>
      <button class="action-sheet-btn" id="as-edit">
        <i class="ti ti-edit" aria-hidden="true"></i> Edit
      </button>
      <button class="action-sheet-btn danger" id="as-delete">
        <i class="ti ti-trash" aria-hidden="true"></i> Delete
      </button>
      <button class="action-sheet-cancel" id="as-cancel">Cancel</button>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('#as-check').onclick = () => {
    document.body.removeChild(overlay);
    if (todayDone()[id]) unmark(id, pts);
    else markDone(id, pts);
  };
  overlay.querySelector('#as-edit').onclick = () => {
    document.body.removeChild(overlay);
    openModal(type, id);
  };
  overlay.querySelector('#as-delete').onclick = () => {
    document.body.removeChild(overlay);
    if (confirm('Delete this item?')) deleteItem(id, type);
  };
  overlay.querySelector('#as-cancel').onclick = () => document.body.removeChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
}

/* ── List click (tap to check, desktop edit/delete) ── */
function handleListClick(e, arrayKey) {
  const card    = e.target.closest('.item-card');
  const delBtn  = e.target.closest('.del-btn');
  const editBtn = e.target.closest('.edit-btn');
  if (!card) return;
  e.stopPropagation();
  const id  = +card.dataset.id;
  const pts = +card.dataset.pts;
  const type = card.dataset.type;
  if (delBtn) { if (confirm('Delete this item?')) deleteItem(id, type); return; }
  if (editBtn) { openModal(type, id); return; }
  if (todayDone()[id]) unmark(id, pts);
  else markDone(id, pts);
}

/* ── Zone filter ── */
function setZone(zone) {
  activeZone = zone;
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.z === zone);
  });
  document.getElementById('zone-title').textContent = ZONE_TITLES[zone] || 'All';
  render();
}

/* ── Modal ── */
function openModal(type, id = null) {
  modalType = type; editId = id;
  const isTask = type === 'task';
  document.getElementById('modal-heading').textContent = id ? (isTask ? 'Edit Task' : 'Edit Habit') : (isTask ? 'New Task' : 'New Habit');
  document.getElementById('f-deadline-wrap').style.display = isTask ? 'block' : 'none';
  if (id) {
    const item = (isTask ? state.tasks : state.habits).find(x => x.id === id);
    if (item) {
      document.getElementById('f-name').value     = item.name;
      document.getElementById('f-zone').value     = item.zone;
      document.getElementById('f-pts').value      = item.pts;
      document.getElementById('f-note').value     = item.note     || '';
      document.getElementById('f-deadline').value = item.deadline || '';
    }
  } else {
    document.getElementById('f-name').value     = '';
    document.getElementById('f-zone').value     = 'spirituality';
    document.getElementById('f-pts').value      = 5;
    document.getElementById('f-note').value     = '';
    document.getElementById('f-deadline').value = '';
  }
  document.getElementById('modal').style.display = 'flex';
  setTimeout(() => document.getElementById('f-name').focus(), 100);
}

function closeModal() { document.getElementById('modal').style.display = 'none'; editId = null; }

function saveModal() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) { document.getElementById('f-name').focus(); return; }
  const obj = {
    name,
    zone:     document.getElementById('f-zone').value,
    pts:      Math.min(20, Math.max(1, parseInt(document.getElementById('f-pts').value) || 5)),
    note:     document.getElementById('f-note').value.trim(),
    deadline: document.getElementById('f-deadline').value,
  };
  const key = modalType === 'task' ? 'tasks' : 'habits';
  if (editId) {
    const idx = state[key].findIndex(x => x.id === editId);
    if (idx > -1) state[key][idx] = { ...state[key][idx], ...obj };
  } else { obj.id = uid(); state[key].push(obj); }
  saveState(); closeModal(); render(); showToast(editId ? 'Saved ✓' : 'Added ✓');
}

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── Init ── */
function init() {
  loadState();
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  render();

  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => setZone(btn.dataset.z));
  });

  document.getElementById('add-habit-btn').addEventListener('click', () => openModal('habit'));
  document.getElementById('add-task-btn').addEventListener('click',  () => openModal('task'));
  document.getElementById('habits-list').addEventListener('click', e => handleListClick(e, 'habits'));
  document.getElementById('tasks-list').addEventListener('click',  e => handleListClick(e, 'tasks'));

  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.item-card')) { e.preventDefault(); e.target.closest('.item-card').click(); }
    if (e.key === 'Escape') closeModal();
  });

  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click', saveModal);
  document.getElementById('modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.getElementById('f-name').addEventListener('keydown', e => { if (e.key === 'Enter') saveModal(); });
}

document.addEventListener('DOMContentLoaded', init);
