/**
 * EduDesk - Auto Classify School IT Tickets
 * Client Logic simulating ServiceNow Flow Designer & u_incident_workflow
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });

  // Classification Rules matching ServiceNow Flow Designer: sys_hub_flow_ec6b056283ef4710667ea9e0deaad3f1
  const CLASSIFICATION_RULES = [
    {
      id: 'network',
      name: 'Network',
      category: 'network',
      subcategory: 'wi-fi',
      assignedGroup: 'Network Support',
      keywords: ['wifi', 'wi-fi', 'network', 'internet', 'lan', 'router', 'switch', 'ssid', 'connectivity', 'offline', 'signal'],
      badgeClass: 'badge-network',
      icon: '📶',
      ruleText: 'If short_desc contains "wifi" | "network" ➔ Category = Network'
    },
    {
      id: 'hardware',
      name: 'Hardware',
      category: 'hardware',
      subcategory: 'projector',
      assignedGroup: 'Hardware Support',
      keywords: ['projector', 'hdmi', 'screen', 'display', 'hardware', 'printer', 'bulb', 'cable', 'mouse', 'keyboard', 'speaker'],
      badgeClass: 'badge-hardware',
      icon: '📽️',
      ruleText: 'If short_desc contains "projector" | "hardware" ➔ Category = Hardware'
    },
    {
      id: 'access',
      name: 'Access',
      category: 'access',
      subcategory: 'forgot password',
      assignedGroup: 'Service Desk',
      keywords: ['password', 'login', 'portal', 'account', 'access', 'auth', 'locked', 'reset', 'credentials', 'sign in', 'user id'],
      badgeClass: 'badge-access',
      icon: '🔑',
      ruleText: 'If short_desc contains "password" | "login" ➔ Category = Access'
    },
    {
      id: 'performance',
      name: 'Performance',
      category: 'performance',
      subcategory: 'slow computer',
      assignedGroup: 'IT Systems',
      keywords: ['slow', 'lag', 'freeze', 'crash', 'hang', 'performance', 'boot', 'reboot', 'stuck', 'memory', 'cpu', 'computer'],
      badgeClass: 'badge-performance',
      icon: '💻',
      ruleText: 'If short_desc contains "slow" | "computer" ➔ Category = Performance'
    }
  ];

  // Presets Data
  const PRESETS = {
    wifi: {
      title: 'Wi-Fi connection failing in Chemistry Lab 3',
      desc: 'Students unable to connect laptops to School_Student_5G network. Error says "Cannot connect to this network".',
      caller: 'Prof. Ramesh (Science Dept)',
      email: 'ramesh.chem@school.edu'
    },
    projector: {
      title: 'Classroom 204 Projector lamp blinking red',
      desc: 'Smart projector turns off after 2 minutes of HDMI connection during lecture.',
      caller: 'Mrs. Malini Devi (Maths)',
      email: 'malini.m@school.edu'
    },
    password: {
      title: 'Forgot password for School Examination Portal',
      desc: 'Locked out after 3 attempts. Need urgent password reset before semester internal test.',
      caller: 'Kavitha S (Student Reg #4012)',
      email: 'kavitha.4012@student.school.edu'
    },
    slow: {
      title: 'Computer Lab 1 workstation 14 extremely slow and freezing',
      desc: 'System takes 15 minutes to boot into Windows and freezes when opening IDE software.',
      caller: 'Mr. Vignesh (Lab Assistant)',
      email: 'vignesh.lab@school.edu'
    }
  };

  // State
  let tickets = [];
  let nextIncNumber = 1013;

  // Initial Sample Tickets
  const INITIAL_TICKETS = [
    {
      id: 'INC0001001',
      caller: 'Dr. Arvind Kumar (Staff)',
      email: 'arvind.k@school.edu',
      shortDesc: 'Wi-Fi connection drop in Science Block A',
      desc: 'Faculty laptops are disconnecting every 10 minutes from the primary access point.',
      category: 'network',
      subcategory: 'wi-fi',
      state: 'new',
      assignedGroup: 'Network Support',
      assignedTo: 'Rajesh (NetAdmin)',
      createdOn: '2026-09-28 10:15:00'
    },
    {
      id: 'INC0001002',
      caller: 'Mrs. Priya S (Staff)',
      email: 'priya.s@school.edu',
      shortDesc: 'Auditorium Projector HDMI display flickers',
      desc: 'Main stage projector loses signal periodically during presentations.',
      category: 'hardware',
      subcategory: 'projector',
      state: 'in progress',
      assignedGroup: 'Hardware Support',
      assignedTo: 'Suresh Kumar',
      createdOn: '2026-09-28 09:30:00'
    },
    {
      id: 'INC0001003',
      caller: 'Dinesh Karthik (Student)',
      email: 'dinesh.k@student.school.edu',
      shortDesc: 'Forgot password for Attendance Management Portal',
      desc: 'Student cannot log in to verify morning attendance record.',
      category: 'access',
      subcategory: 'forgot password',
      state: 'resolved',
      assignedGroup: 'Service Desk',
      assignedTo: 'Anita Sharma',
      createdOn: '2026-09-28 08:45:00'
    },
    {
      id: 'INC0001004',
      caller: 'Karthik N (Student)',
      email: 'karthik.n@student.school.edu',
      shortDesc: 'CAD Lab Computer 08 running abnormally slow',
      desc: '3D modeling software crashes upon launch due to disk usage spike.',
      category: 'performance',
      subcategory: 'slow computer',
      state: 'on hold',
      assignedGroup: 'IT Systems',
      assignedTo: 'Vimal Raj',
      createdOn: '2026-09-27 16:20:00'
    },
    {
      id: 'INC0001005',
      caller: 'Dr. Meenakshi (Dean)',
      email: 'meenakshi@school.edu',
      shortDesc: 'Office printer IP not reachable via Wi-Fi network',
      desc: 'Dean office printer is showing offline for all connected workstations.',
      category: 'network',
      subcategory: 'wi-fi',
      state: 'closed',
      assignedGroup: 'Network Support',
      assignedTo: 'Rajesh (NetAdmin)',
      createdOn: '2026-09-26 11:00:00'
    }
  ];

  // Initialize from LocalStorage or Default
  const saved = localStorage.getItem('edudesk_tickets');
  if (saved) {
    try {
      tickets = JSON.parse(saved);
      if (tickets.length > 0) {
        const lastNum = parseInt(tickets[0].id.replace('INC000', ''));
        if (!isNaN(lastNum)) nextIncNumber = Math.max(nextIncNumber, lastNum + 1);
      }
    } catch (e) {
      tickets = INITIAL_TICKETS;
    }
  } else {
    tickets = INITIAL_TICKETS;
    saveTickets();
  }

  function saveTickets() {
    localStorage.setItem('edudesk_tickets', JSON.stringify(tickets));
    renderKanban();
    updateMetrics();
  }

  // Auto-Classification Function
  function classifyText(text) {
    if (!text || text.trim() === '') {
      return null;
    }
    const lower = text.toLowerCase();

    for (const rule of CLASSIFICATION_RULES) {
      for (const kw of rule.keywords) {
        if (lower.includes(kw)) {
          return rule;
        }
      }
    }

    // Default to network or first rule if no match
    return CLASSIFICATION_RULES[0];
  }

  // Form Elements
  const shortDescInput = document.getElementById('short-description');
  const callerNameInput = document.getElementById('caller-name');
  const callerEmailInput = document.getElementById('caller-email');
  const descInput = document.getElementById('description');
  const incidentForm = document.getElementById('incident-form');

  // Preview elements
  const predCat = document.getElementById('pred-cat');
  const predSubcat = document.getElementById('pred-subcat');
  const predGroup = document.getElementById('pred-group');
  const detectedRule = document.getElementById('detected-rule');

  // Input listener for Real-time preview
  shortDescInput.addEventListener('input', () => {
    updatePreview(shortDescInput.value);
  });

  function updatePreview(text) {
    const rule = classifyText(text);
    if (!rule) {
      predCat.innerHTML = `<span class="badge badge-unclassified">Auto-Detecting...</span>`;
      predSubcat.textContent = '---';
      predGroup.textContent = '---';
      detectedRule.textContent = 'Waiting for input...';
      return;
    }

    predCat.innerHTML = `<span class="badge ${rule.badgeClass}">${rule.icon} ${rule.name}</span>`;
    predSubcat.textContent = rule.subcategory.toUpperCase();
    predGroup.textContent = rule.assignedGroup;
    detectedRule.textContent = rule.ruleText;
  }

  // Preset Buttons
  const presetChips = document.querySelectorAll('.chip-btn');
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-preset');
      const data = PRESETS[type];
      if (data) {
        callerNameInput.value = data.caller;
        callerEmailInput.value = data.email;
        shortDescInput.value = data.title;
        descInput.value = data.desc;
        updatePreview(data.title);
        showToast(`Preset "${chip.textContent.trim()}" loaded!`);
      }
    });
  });

  // Handle Form Submission
  incidentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const shortDesc = shortDescInput.value.trim();
    if (!shortDesc) return;

    const caller = callerNameInput.value.trim() || 'Guest Caller';
    const email = callerEmailInput.value.trim() || 'guest@school.edu';
    const desc = descInput.value.trim() || shortDesc;

    // Execute ServiceNow Flow Classification Logic
    const rule = classifyText(shortDesc) || CLASSIFICATION_RULES[0];
    const newIncId = `INC000${nextIncNumber++}`;

    const newTicket = {
      id: newIncId,
      caller: caller,
      email: email,
      shortDesc: shortDesc,
      desc: desc,
      category: rule.category,
      subcategory: rule.subcategory,
      state: 'new',
      assignedGroup: rule.assignedGroup,
      assignedTo: 'Unassigned (Auto-Routed)',
      createdOn: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    tickets.unshift(newTicket);
    saveTickets();

    // Trigger visual Flow Animation & Update Email Preview
    animateFlowExecution(newTicket, rule);

    showToast(`✓ Ticket ${newIncId} created & auto-classified as "${rule.name}"!`);
  });

  // Flow Animation Execution
  function animateFlowExecution(ticket, rule) {
    const stepTrigger = document.getElementById('step-trigger');
    const stepEval = document.getElementById('step-eval');
    const stepUpdate = document.getElementById('step-update');
    const stepNotify = document.getElementById('step-notify');

    const timelineCond = document.getElementById('timeline-condition-text');
    const timelineUpdate = document.getElementById('timeline-update-text');

    // Reset steps
    [stepTrigger, stepEval, stepUpdate, stepNotify].forEach(step => {
      step.classList.remove('active', 'step-done');
    });

    // Step 1: Trigger
    stepTrigger.classList.add('active', 'step-done');

    setTimeout(() => {
      // Step 2: Evaluation
      stepEval.classList.add('active', 'step-done');
      timelineCond.innerHTML = `Condition met: <strong>"${rule.name}"</strong> pattern matched`;
    }, 400);

    setTimeout(() => {
      // Step 3: Update Record
      stepUpdate.classList.add('active', 'step-done');
      timelineUpdate.innerHTML = `Set Category=<code>${rule.category}</code>, Subcategory=<code>${rule.subcategory}</code>, Group=<code>${rule.assignedGroup}</code>`;
    }, 800);

    setTimeout(() => {
      // Step 4: Email Notification
      stepNotify.classList.add('active', 'step-done');

      // Update Email Preview Box
      document.getElementById('mail-to').textContent = ticket.email;
      document.getElementById('mail-subject').textContent = `Incident ${ticket.id} has been auto-classified and logged`;
      document.getElementById('mail-content').innerHTML = `
        Hello <strong>${escapeHtml(ticket.caller)}</strong>,<br><br>
        Your School IT incident <strong>${ticket.id}</strong> has been logged and automatically routed to the <strong>${rule.assignedGroup}</strong> team.<br>
        • <strong>Category:</strong> ${rule.name}<br>
        • <strong>Subcategory:</strong> ${rule.subcategory.toUpperCase()}<br>
        • <strong>Short Description:</strong> ${escapeHtml(ticket.shortDesc)}<br>
        • <strong>State:</strong> New<br><br>
        Our technicians are reviewing the ticket. You can track updates via this portal.
      `;
    }, 1200);
  }

  // Render Kanban Board
  const cardsNew = document.getElementById('cards-new');
  const cardsInProgress = document.getElementById('cards-inprogress');
  const cardsOnHold = document.getElementById('cards-onhold');
  const cardsResolved = document.getElementById('cards-resolved');
  const cardsClosed = document.getElementById('cards-closed');

  const countNew = document.getElementById('count-new');
  const countInProgress = document.getElementById('count-in-progress');
  const countOnHold = document.getElementById('count-on-hold');
  const countResolved = document.getElementById('count-resolved');
  const countClosed = document.getElementById('count-closed');

  const searchInput = document.getElementById('search-incidents');
  const filterCategory = document.getElementById('filter-category');

  searchInput.addEventListener('input', renderKanban);
  filterCategory.addEventListener('change', renderKanban);

  function renderKanban() {
    const filterCatVal = filterCategory.value;
    const searchVal = searchInput.value.toLowerCase().trim();

    // Clear columns
    cardsNew.innerHTML = '';
    cardsInProgress.innerHTML = '';
    cardsOnHold.innerHTML = '';
    cardsResolved.innerHTML = '';
    cardsClosed.innerHTML = '';

    let cNew = 0, cProg = 0, cHold = 0, cRes = 0, cClose = 0;

    tickets.forEach(ticket => {
      // Filter logic
      if (filterCatVal !== 'ALL' && ticket.category !== filterCatVal) {
        return;
      }
      if (searchVal) {
        const matches = ticket.id.toLowerCase().includes(searchVal) ||
                        ticket.shortDesc.toLowerCase().includes(searchVal) ||
                        ticket.caller.toLowerCase().includes(searchVal) ||
                        ticket.category.toLowerCase().includes(searchVal);
        if (!matches) return;
      }

      const card = createTicketCard(ticket);

      const st = ticket.state.toLowerCase();
      if (st === 'new') {
        cardsNew.appendChild(card);
        cNew++;
      } else if (st === 'in progress') {
        cardsInProgress.appendChild(card);
        cProg++;
      } else if (st === 'on hold') {
        cardsOnHold.appendChild(card);
        cHold++;
      } else if (st === 'resolved') {
        cardsResolved.appendChild(card);
        cRes++;
      } else if (st === 'closed') {
        cardsClosed.appendChild(card);
        cClose++;
      }
    });

    countNew.textContent = cNew;
    countInProgress.textContent = cProg;
    countOnHold.textContent = cHold;
    countResolved.textContent = cRes;
    countClosed.textContent = cClose;
  }

  function createTicketCard(ticket) {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.setAttribute('data-id', ticket.id);

    const rule = CLASSIFICATION_RULES.find(r => r.category === ticket.category) || CLASSIFICATION_RULES[0];

    card.innerHTML = `
      <div class="card-top">
        <span class="ticket-id">${ticket.id}</span>
        <span class="badge ${rule.badgeClass}">${rule.icon} ${rule.name}</span>
      </div>
      <div class="ticket-title">${escapeHtml(ticket.shortDesc)}</div>
      <div class="ticket-meta">
        <span class="caller-info">👤 ${escapeHtml(ticket.caller.split(' ')[0])}</span>
        <span class="group-tag">🛡️ ${escapeHtml(ticket.assignedGroup)}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      openTicketModal(ticket);
    });

    return card;
  }

  // Ticket Modal
  const modal = document.getElementById('ticket-modal');
  const modalCloseBtn = document.getElementById('btn-close-modal');
  const modalFooterClose = document.getElementById('btn-modal-close-footer');
  const modalTitle = document.getElementById('modal-title');
  const modalBadgeCat = document.getElementById('modal-badge-cat');
  const modalBodyContent = document.getElementById('modal-body-content');

  function openTicketModal(ticket) {
    const rule = CLASSIFICATION_RULES.find(r => r.category === ticket.category) || CLASSIFICATION_RULES[0];
    modalBadgeCat.className = `badge ${rule.badgeClass}`;
    modalBadgeCat.textContent = `${rule.icon} ${rule.name}`;
    modalTitle.textContent = `${ticket.id} - Incident Details`;

    modalBodyContent.innerHTML = `
      <div class="detail-row">
        <span>Caller (sys_user):</span>
        <strong>${escapeHtml(ticket.caller)} &lt;${escapeHtml(ticket.email)}&gt;</strong>
      </div>
      <div class="detail-row">
        <span>Table / Record:</span>
        <code>u_incident_workflow (${ticket.id})</code>
      </div>
      <div class="detail-row">
        <span>Category / Subcategory:</span>
        <strong>${rule.name} / ${ticket.subcategory.toUpperCase()}</strong>
      </div>
      <div class="detail-row">
        <span>Assigned Support Group:</span>
        <strong>${escapeHtml(ticket.assignedGroup)}</strong>
      </div>
      <div class="detail-row">
        <span>Assigned Technician:</span>
        <strong>${escapeHtml(ticket.assignedTo)}</strong>
      </div>
      <div class="detail-row">
        <span>Current State:</span>
        <select id="modal-change-state" class="filter-select" style="padding: 4px 8px; font-size: 0.8rem;">
          <option value="new" ${ticket.state === 'new' ? 'selected' : ''}>New</option>
          <option value="in progress" ${ticket.state === 'in progress' ? 'selected' : ''}>In Progress</option>
          <option value="on hold" ${ticket.state === 'on hold' ? 'selected' : ''}>On Hold</option>
          <option value="resolved" ${ticket.state === 'resolved' ? 'selected' : ''}>Resolved</option>
          <option value="closed" ${ticket.state === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
      <div class="detail-row">
        <span>Created Timestamp:</span>
        <span>${ticket.createdOn}</span>
      </div>

      <div style="margin-top: 10px;">
        <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Issue Description:</span>
        <div class="detail-desc-box">${escapeHtml(ticket.desc)}</div>
      </div>
    `;

    modal.classList.add('open');

    // Change state handler inside modal
    const changeStateSelect = document.getElementById('modal-change-state');
    if (changeStateSelect) {
      changeStateSelect.addEventListener('change', (e) => {
        ticket.state = e.target.value;
        saveTickets();
        showToast(`Ticket ${ticket.id} state updated to "${ticket.state.toUpperCase()}"!`);
      });
    }
  }

  modalCloseBtn.addEventListener('click', () => modal.classList.remove('open'));
  modalFooterClose.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // Flow Simulation in Flow Tab
  const btnRunSimulation = document.getElementById('btn-run-simulation');
  if (btnRunSimulation) {
    btnRunSimulation.addEventListener('click', () => {
      const branches = ['branch-network', 'branch-hardware', 'branch-access', 'branch-performance'];
      const nodeTrigger = document.getElementById('node-trigger');
      const nodeEmail = document.getElementById('node-email-action');
      const nodeEnd = document.getElementById('node-end');

      // Pulse trigger
      nodeTrigger.classList.add('active-pulse');

      branches.forEach((bId, idx) => {
        setTimeout(() => {
          document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active-branch'));
          const el = document.getElementById(bId);
          if (el) el.classList.add('active-branch');
        }, (idx + 1) * 700);
      });

      setTimeout(() => {
        document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active-branch'));
        nodeEmail.classList.add('active-pulse');
      }, 3500);

      setTimeout(() => {
        nodeEmail.classList.remove('active-pulse');
        nodeEnd.classList.add('active-pulse');
        showToast('✓ Flow Simulation complete: All 4 decision paths and notification verified!');
      }, 4500);

      setTimeout(() => {
        nodeEnd.classList.remove('active-pulse');
      }, 6000);
    });
  }

  // Export Data as JSON
  const btnExport = document.getElementById('btn-export-data');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tickets, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "school_it_incidents_export.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported incident records to school_it_incidents_export.json');
    });
  }

  // Toast Function
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function updateMetrics() {
    const totalEl = document.getElementById('total-tickets-count');
    if (totalEl) totalEl.textContent = tickets.length;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }

  // Initial render
  renderKanban();
  updateMetrics();
});
