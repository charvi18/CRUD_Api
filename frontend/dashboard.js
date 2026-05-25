/**
 * dashboard.js — Student Dashboard logic
 * Handles listing, searching, pagination, edit, and delete.
 */

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────
  let currentPage = 1;
  const PAGE_LIMIT = 8;
  let searchDebounce;
  let pendingDeleteId = null;

  // ── DOM refs ──────────────────────────────────────────────────
  const tableBody = document.getElementById('tableBody');
  const pagination = document.getElementById('pagination');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');

  // ── Load Students ─────────────────────────────────────────────

  async function loadStudents(page = 1) {
    currentPage = page;

    renderSkeleton();

    const params = {
      page,
      limit: PAGE_LIMIT,
      search: searchInput.value.trim() || undefined,
    };

    try {
      const res = await StudentsAPI.getAll(params);

      const students = res.data || [];
      const meta = res.meta || {};

      updateStats(meta);
      renderTable(students, meta);

    } catch (err) {

      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:3rem;color:red;">
            ⚠ Could not connect to server.
          </td>
        </tr>
      `;

      emptyState.classList.add('hidden');
    }
  }

  // ── Stats ─────────────────────────────────────────────────────

  async function updateStats(meta) {

    document.querySelector('#stat-total .stat-num').textContent =
      meta.total || 0;

    document.querySelector('#stat-active .stat-num').textContent =
      meta.page || 1;

    document.querySelector('#stat-graduated .stat-num').textContent =
      meta.totalPages || 1;
  }

  // ── Skeleton ──────────────────────────────────────────────────

  function renderSkeleton() {

    tableBody.innerHTML = Array.from({ length: 4 }, () => `
      <tr class="skeleton-row">
        <td colspan="6">
          <div class="skeleton-line"></div>
        </td>
      </tr>
    `).join('');

    emptyState.classList.add('hidden');
    pagination.innerHTML = '';
  }

  // ── Render Table ──────────────────────────────────────────────

  function renderTable(students, meta) {

    if (students.length === 0) {

      tableBody.innerHTML = '';
      emptyState.classList.remove('hidden');
      pagination.innerHTML = '';

      return;
    }

    emptyState.classList.add('hidden');

    const startIndex =
      ((meta.page || 1) - 1) * PAGE_LIMIT;

    tableBody.innerHTML = students.map((s, i) => `
      <tr>
        <td>${startIndex + i + 1}</td>

        <td>${escHtml(s.name)}</td>

        <td>${escHtml(s.email)}</td>

        <td>${escHtml(s.course)}</td>

        <td>${s.age}</td>

        <td class="action-cell">
          <button
            class="action-btn edit"
            data-id="${s.id}"
            data-action="edit"
          >
            ✏
          </button>

          <button
            class="action-btn delete"
            data-id="${s.id}"
            data-name="${escHtml(s.name)}"
            data-action="delete"
          >
            🗑
          </button>
        </td>
      </tr>
    `).join('');

    renderPagination(meta);
  }

  // ── Pagination ───────────────────────────────────────────────

  function renderPagination(meta) {

    if (!meta || meta.totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    const { page, totalPages } = meta;

    let html = '';

    html += `
      <button
        class="page-btn"
        ${page <= 1 ? 'disabled' : ''}
        data-page="${page - 1}"
      >
        ‹
      </button>
    `;

    for (let p = 1; p <= totalPages; p++) {

      html += `
        <button
          class="page-btn ${p === page ? 'active' : ''}"
          data-page="${p}"
        >
          ${p}
        </button>
      `;
    }

    html += `
      <button
        class="page-btn"
        ${page >= totalPages ? 'disabled' : ''}
        data-page="${page + 1}"
      >
        ›
      </button>
    `;

    pagination.innerHTML = html;
  }

  // ── Table Actions ────────────────────────────────────────────

  tableBody.addEventListener('click', (e) => {

    const btn = e.target.closest('[data-action]');

    if (!btn) return;

    const { id, action, name } = btn.dataset;

    if (action === 'edit') {
      openEditModal(id);
    }

    if (action === 'delete') {
      openDeleteModal(id, name);
    }
  });

  // ── Pagination Click ─────────────────────────────────────────

  pagination.addEventListener('click', (e) => {

    const btn = e.target.closest('[data-page]');

    if (btn && !btn.disabled) {
      loadStudents(Number(btn.dataset.page));
    }
  });

  // ── Search ───────────────────────────────────────────────────

  searchInput.addEventListener('input', () => {

    clearTimeout(searchDebounce);

    searchDebounce = setTimeout(() => {
      loadStudents(1);
    }, 400);
  });

  // ── Refresh ──────────────────────────────────────────────────

  refreshBtn.addEventListener('click', () => {

    searchInput.value = '';

    loadStudents(1);
  });

  // ── Edit Modal ───────────────────────────────────────────────

  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');

  const modalClose = document.getElementById('modalClose');
  const cancelEdit = document.getElementById('cancelEdit');

  async function openEditModal(id) {

    try {

      const res = await StudentsAPI.getById(id);

      const s = res.data;

      document.getElementById('editId').value = s.id;
      document.getElementById('editName').value = s.name;
      document.getElementById('editEmail').value = s.email;
      document.getElementById('editCourse').value = s.course;
      document.getElementById('editAge').value = s.age;

      editModal.classList.remove('hidden');

    } catch (err) {

      showToast(
        'toast',
        'Could not load student data.',
        'error',
      );
    }
  }

  function closeEditModal() {
    editModal.classList.add('hidden');
  }

  modalClose.addEventListener('click', closeEditModal);
  cancelEdit.addEventListener('click', closeEditModal);

  // ── Edit Submit ──────────────────────────────────────────────

  editForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const id = document.getElementById('editId').value;

    const payload = {
      name: document.getElementById('editName').value.trim(),

      email: document.getElementById('editEmail').value.trim(),

      course: document.getElementById('editCourse').value.trim(),

      age: Number(document.getElementById('editAge').value),
    };

    setButtonLoading('saveEditBtn', true);

    try {

      const res =
        await StudentsAPI.update(id, payload);

      showToast(
        'toast',
        res.message || 'Updated successfully!',
        'success',
      );

      closeEditModal();

      loadStudents(currentPage);

    } catch (err) {

      showToast(
        'toast',
        err.message || 'Update failed.',
        'error',
      );

    } finally {

      setButtonLoading('saveEditBtn', false);
    }
  });

  // ── Delete Modal ─────────────────────────────────────────────

  const deleteModal =
    document.getElementById('deleteModal');

  const deleteModalClose =
    document.getElementById('deleteModalClose');

  const cancelDelete =
    document.getElementById('cancelDelete');

  const confirmDelete =
    document.getElementById('confirmDelete');

  function openDeleteModal(id, name) {

    pendingDeleteId = id;

    document.getElementById(
      'deleteStudentName',
    ).textContent = name;

    deleteModal.classList.remove('hidden');
  }

  function closeDeleteModal() {

    deleteModal.classList.add('hidden');

    pendingDeleteId = null;
  }

  deleteModalClose.addEventListener(
    'click',
    closeDeleteModal,
  );

  cancelDelete.addEventListener(
    'click',
    closeDeleteModal,
  );

  confirmDelete.addEventListener(
    'click',
    async () => {

      if (!pendingDeleteId) return;

      setButtonLoading('confirmDelete', true);

      try {

        await StudentsAPI.delete(pendingDeleteId);

        closeDeleteModal();

        showToast(
          'toast',
          'Student deleted successfully.',
          'success',
        );

        loadStudents(currentPage);

      } catch (err) {

        showToast(
          'toast',
          err.message || 'Delete failed.',
          'error',
        );

      } finally {

        setButtonLoading(
          'confirmDelete',
          false,
        );
      }
    },
  );

  // ── Escape Key ───────────────────────────────────────────────

  document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {

      closeEditModal();
      closeDeleteModal();
    }
  });

  // ── Escape HTML ──────────────────────────────────────────────

  function escHtml(str) {

    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── Init ─────────────────────────────────────────────────────

  loadStudents(1);

})();