/**
 * NeuralChat — chatbot1.js
 * Handles: messaging, input, typing indicator, sliding sidebar,
 *          dark mode, welcome screen, auto-resize, keyboard shortcuts, export.
 */

$(function () {

  /* ── Mock AI Responses ──────────────────────────────────── */
  const AI_RESPONSES = [
    "That's a great question! Let me break it down for you. The concept involves several interconnected ideas that build on each other progressively.",
    "I'd be happy to help with that. Here's what I know: this topic has been studied extensively, and the current understanding points to a few key principles.",
    "Interesting! There are multiple ways to approach this. The most straightforward method would be to start with the fundamentals and work your way up to more complex ideas.",
    "Sure thing! Think of it this way — the underlying mechanism works similarly to how a well-organized system handles inputs and produces predictable outputs.",
    "Great point. Research in this area suggests that consistency and structured practice are the most reliable paths to meaningful progress over time.",
    "Here's a concise answer: the key insight is that small, incremental improvements compound dramatically when applied consistently over a longer period.",
    "Absolutely! This is something many people find tricky at first, but once you see the pattern, it becomes much more intuitive and natural to work with.",
    "Let me think through this carefully. The most important factors to consider are: (1) your specific context, (2) the constraints you're working within, and (3) the outcome you're optimizing for.",
    "That's a fascinating area! Modern approaches have evolved significantly, moving away from brute-force methods toward more elegant, data-driven solutions.",
    "Of course! The short answer is yes — but with some important caveats. Let me walk you through both the general principle and the edge cases worth knowing about.",
  ];

  /* ── State ──────────────────────────────────────────────── */
  let messageCount   = 0;
  let isWelcomeShown = true;
  let isSidebarOpen  = false;

  /* ── DOM References ─────────────────────────────────────── */
  const $app               = $('#app');
  const $sidebar           = $('#sidebar');
  const $overlay           = $('#sidebar-overlay');
  const $messagesContainer = $('#messages-container');
  const $welcomeScreen     = $('#welcome-screen');
  const $typingIndicator   = $('#typing-indicator');
  const $messageInput      = $('#message-input');
  const $sendBtn           = $('#send-btn');
  const $themeToggle       = $('#theme-toggle');

  /* ============================================================
     SIDEBAR: Core open / close / toggle
     ============================================================ */
  function openSidebar() {
    $sidebar.removeClass('collapsed');
    $overlay.addClass('active');
    $app.addClass('sidebar-open');
    isSidebarOpen = true;
    // Trap focus inside sidebar (a11y)
    $sidebar.attr('aria-hidden', 'false');
  }

  function closeSidebar() {
    $sidebar.addClass('collapsed');
    $overlay.removeClass('active');
    $app.removeClass('sidebar-open');
    isSidebarOpen = false;
    $sidebar.attr('aria-hidden', 'true');
  }

  function toggleSidebar() {
    isSidebarOpen ? closeSidebar() : openSidebar();
  }

  /* Hamburger button */
  $('#hamburger-btn').on('click', function (e) {
    e.stopPropagation();
    toggleSidebar();
  });

  /* Overlay click closes sidebar */
  $overlay.on('click', closeSidebar);

  /* Escape key closes sidebar */
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && isSidebarOpen) closeSidebar();
  });

  /* Swipe-to-close on touch devices */
  let touchStartX = 0;
  document.getElementById('sidebar').addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.getElementById('sidebar').addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -60) closeSidebar();   // swipe left closes
  }, { passive: true });

  /* Swipe-to-open from left edge of main content */
  let edgeSwipeStartX = 0;
  document.getElementById('main-content').addEventListener('touchstart', function (e) {
    edgeSwipeStartX = e.touches[0].clientX;
  }, { passive: true });
  document.getElementById('main-content').addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - edgeSwipeStartX;
    if (edgeSwipeStartX < 24 && dx > 60) openSidebar();   // swipe right from edge
  }, { passive: true });

  /* ============================================================
     UTILITY
     ============================================================ */
  function getCurrentTime() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  function getRandomResponse() {
    return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  }

  /* ============================================================
     CORE: addMessage(text, sender)
     ============================================================ */
  function addMessage(text, sender) {
    messageCount++;
    const time      = getCurrentTime();
    const isUser    = sender === 'user';
    const avatarContent = isUser
      ? '<i class="fa-solid fa-user"></i>'
      : '<i class="fa-solid fa-bolt"></i>';
    const senderName = isUser ? 'You' : 'NeuralChat';
    const sanitized  = $('<div>').text(text).html();

    const msgHTML = `
      <div class="message ${isUser ? 'user' : 'ai'}">
        <div class="msg-avatar">${avatarContent}</div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-name">${senderName}</span>
            <span class="msg-time">${time}</span>
          </div>
          <div class="msg-bubble">${sanitized}</div>
        </div>
      </div>
    `;

    $messagesContainer.append(msgHTML);
    scrollToBottom();
  }

  function scrollToBottom() {
    const wrapper = document.getElementById('messages-wrapper');
    wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: 'smooth' });
  }

  /* ============================================================
     CORE: sendMessage
     ============================================================ */
  function sendMessage() {
    const text = $messageInput.val().trim();
    if (!text) return;

    if (isWelcomeShown) {
      $welcomeScreen.fadeOut(300, function () { $(this).remove(); });
      isWelcomeShown = false;
    }

    addMessage(text, 'user');
    $messageInput.val('').trigger('input');
    simulateAIResponse();
  }

  function simulateAIResponse() {
    $sendBtn.prop('disabled', true);
    $typingIndicator.removeClass('hidden');
    scrollToBottom();

    const delay = 1200 + Math.random() * 1000;
    setTimeout(function () {
      $typingIndicator.addClass('hidden');
      addMessage(getRandomResponse(), 'ai');
      updateSendButton();
    }, delay);
  }

  /* ============================================================
     INPUT
     ============================================================ */
  function updateSendButton() {
    $sendBtn.prop('disabled', $messageInput.val().trim().length === 0);
  }

  function autoResize() {
    const el = $messageInput[0];
    el.style.height = 'auto';
    const maxH = 160;
    el.style.height = Math.min(el.scrollHeight, maxH) + 'px';
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  }

  $messageInput.on('input', function () {
    updateSendButton();
    autoResize();
  });

  $messageInput.on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!$sendBtn.prop('disabled')) sendMessage();
    }
  });

  $sendBtn.on('click', sendMessage);

  /* Suggestion cards */
  $(document).on('click', '.suggestion-card', function () {
    const prompt = $(this).data('prompt');
    if (prompt) {
      $messageInput.val(prompt).trigger('input');
      sendMessage();
    }
  });

  /* ============================================================
     NEW CHAT
     ============================================================ */
  const welcomeTemplate = `
    <div id="welcome-screen" class="welcome-screen">
      <div class="welcome-inner">
        <div class="welcome-icon"><i class="fa-solid fa-bolt"></i></div>
        <h1 class="welcome-title">Good to see you</h1>
        <p class="welcome-subtitle">I'm NeuralChat — your intelligent assistant.<br>Ask me anything, or start with a suggestion.</p>
        <div class="suggestion-grid">
          <button class="suggestion-card" data-prompt="Explain how neural networks learn from data in simple terms">
            <div class="card-icon"><i class="fa-solid fa-brain"></i></div>
            <div class="card-text"><span class="card-title">Explain AI</span><span class="card-desc">How do neural networks learn from data?</span></div>
          </button>
          <button class="suggestion-card" data-prompt="Write a Python function to find all prime numbers up to 1000 using the Sieve of Eratosthenes">
            <div class="card-icon"><i class="fa-solid fa-code"></i></div>
            <div class="card-text"><span class="card-title">Write Code</span><span class="card-desc">Python function for prime numbers</span></div>
          </button>
          <button class="suggestion-card" data-prompt="What are 5 effective strategies for improving productivity and managing time better?">
            <div class="card-icon"><i class="fa-solid fa-lightbulb"></i></div>
            <div class="card-text"><span class="card-title">Get Ideas</span><span class="card-desc">Strategies to boost productivity</span></div>
          </button>
          <button class="suggestion-card" data-prompt="Help me draft a professional email to my manager requesting a project deadline extension">
            <div class="card-icon"><i class="fa-solid fa-pen-nib"></i></div>
            <div class="card-text"><span class="card-title">Draft Text</span><span class="card-desc">Professional email to manager</span></div>
          </button>
        </div>
      </div>
    </div>
  `;

  function startNewChat() {
    $messagesContainer.empty().append(welcomeTemplate);
    messageCount   = 0;
    isWelcomeShown = true;

    $('#chat-history-list .history-item').removeClass('active');
    $('#chat-history-list').prepend(`
      <li class="history-item active">
        <i class="fa-regular fa-comment"></i>
        <span>New Conversation</span>
      </li>
    `);

    closeSidebar();
    $messageInput.focus();
  }

  $('#new-chat-btn, #topbar-new-chat').on('click', startNewChat);

  /* History item click */
  $(document).on('click', '.history-item', function () {
    $('.history-item').removeClass('active');
    $(this).addClass('active');
    closeSidebar();
  });

  /* ============================================================
     DARK MODE TOGGLE
     ============================================================ */
  if (localStorage.getItem('neuralchat-theme') === 'light') {
    $('body').addClass('light');
    $themeToggle.addClass('active');
  }

  $themeToggle.on('click', function () {
    $('body').toggleClass('light');
    $(this).toggleClass('active');
    localStorage.setItem('neuralchat-theme', $('body').hasClass('light') ? 'light' : 'dark');
  });

  /* ============================================================
     EXPORT CHAT
     ============================================================ */
  $('.user-options-btn').on('click', function () {
    const lines = ['NeuralChat — Conversation Export', '='.repeat(40), ''];
    $('.message').each(function () {
      const name   = $(this).find('.msg-name').text();
      const time   = $(this).find('.msg-time').text();
      const bubble = $(this).find('.msg-bubble').text().trim();
      lines.push(`[${time}] ${name}:`);
      lines.push(bubble);
      lines.push('');
    });

    if (lines.length <= 3) { alert('No messages to export yet!'); return; }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'neuralchat-export.txt'; a.click();
    URL.revokeObjectURL(url);
  });

  /* ============================================================
     INIT
     ============================================================ */
  $messageInput.focus();
  updateSendButton();
  // Sidebar starts collapsed; aria-hidden for a11y
  $sidebar.attr('aria-hidden', 'true');

}); // end document ready