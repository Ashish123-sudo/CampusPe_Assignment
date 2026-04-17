$(document).ready(function () {

  const textarea = $("#message-input");
  const sendBtn = $("#send-btn");
  const messagesContainer = $("#messages-container");
  const wrapper = $(".messages-wrapper");

  // ================================
  // Part 3.1: Message Display
  // ================================

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(text, sender) {
    const time = getCurrentTime();

    const isUser = sender === "user";

    const messageHTML = `
      <div class="message ${isUser ? "user" : "ai"}">
        <div class="msg-avatar">
          <i class="fa-solid ${isUser ? "fa-user" : "fa-bolt"}"></i>
        </div>
        <div class="msg-bubble">
          <p>${text}</p>
          <div class="msg-time" style="font-size:11px;opacity:.6;margin-top:6px;">
            ${time}
          </div>
        </div>
      </div>
    `;

    messagesContainer.append(messageHTML);
    scrollToBottom();
  }

  function scrollToBottom() {
    wrapper.scrollTop(wrapper[0].scrollHeight);
  }

  // ================================
  // Part 3.2: Input Handling
  // ================================

  textarea.on("input", function () {
    const value = $(this).val().trim();

    // Enable/disable button
    sendBtn.prop("disabled", value === "");

    // Auto resize
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Enter to send, Shift+Enter for newline
  textarea.on("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click
  sendBtn.on("click", function () {
    sendMessage();
  });

  // Prevent empty messages handled in sendMessage

  // ================================
  // Part 3.3: Mock AI Responses
  // ================================

  const responses = [
    "That’s a great question.",
    "Let me break that down for you.",
    "Interesting perspective — here’s my take.",
    "I can help with that!",
    "Here’s something you might find useful.",
    "Let’s explore that idea further.",
    "Good thinking — here’s what I suggest."
  ];

  function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  function showTyping() {
    $("#typing-indicator").removeClass("hidden");
    scrollToBottom();
  }

  function hideTyping() {
    $("#typing-indicator").addClass("hidden");
  }

  function sendMessage(customText = null) {
    const text = customText || textarea.val().trim();

    // Prevent empty
    if (!text) return;

    // Hide welcome screen
    $("#welcome-screen").fadeOut(200);

    // Add user message
    addMessage(text, "user");

    // Clear input
    textarea.val("");
    sendBtn.prop("disabled", true);
    textarea.css("height", "auto");

    // Show typing indicator
    showTyping();

    // Simulated delay (1–2 sec)
    const delay = Math.random() * 1000 + 1000;

    setTimeout(() => {
      hideTyping();

      const reply = getRandomResponse();
      addMessage(reply, "ai");

    }, delay);
  }

  // ================================
  // Extra: Suggestion Cards Click
  // ================================

  $(".suggestion-card").on("click", function () {
    const prompt = $(this).data("prompt");
    sendMessage(prompt);
  });

});
