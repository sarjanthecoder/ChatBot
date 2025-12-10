// ============================================
// State Management
// ============================================
let currentChatId = null;
let isLoading = false;

// ============================================
// DOM Elements
// ============================================
const elements = {
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    newChatBtn: document.getElementById('newChatBtn'),
    clearChatBtn: document.getElementById('clearChatBtn'),
    deleteChatBtn: document.getElementById('deleteChatBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    chatList: document.getElementById('chatList'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    chatSidebar: document.querySelector('.chat-sidebar'),
    themeToggle: document.getElementById('themeToggle'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    header: document.querySelector('.header'),
    toastContainer: document.getElementById('toastContainer'),
    particles: document.getElementById('particles')
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEventListeners();
    loadChats();
    initScrollEffects();
    initTextareaAutoResize();
});

// ============================================
// Particles Animation
// ============================================
function initParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        elements.particles.appendChild(particle);
    }
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Send message
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Chat actions
    elements.newChatBtn.addEventListener('click', createNewChat);
    elements.clearChatBtn.addEventListener('click', clearCurrentChat);
    elements.deleteChatBtn.addEventListener('click', deleteCurrentChat);
    elements.clearAllBtn.addEventListener('click', clearAllChats);

    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', toggleSidebar);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Mobile menu
    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenu.classList.remove('active');
        });
    });

    // Scroll effects
    window.addEventListener('scroll', handleScroll);
}

// ============================================
// Scroll Effects
// ============================================
function initScrollEffects() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function handleScroll() {
    if (window.scrollY > 50) {
        elements.header.classList.add('scrolled');
    } else {
        elements.header.classList.remove('scrolled');
    }
}

// ============================================
// Textarea Auto Resize
// ============================================
function initTextareaAutoResize() {
    elements.messageInput.addEventListener('input', () => {
        elements.messageInput.style.height = 'auto';
        elements.messageInput.style.height = Math.min(elements.messageInput.scrollHeight, 150) + 'px';
    });
}

// ============================================
// Theme Toggle
// ============================================
function toggleTheme() {
    const body = document.body;
    const icon = elements.themeToggle.querySelector('i');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
    } else {
        body.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-sun';
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================
function toggleMobileMenu() {
    elements.mobileMenu.classList.toggle('active');
}

// ============================================
// Sidebar Toggle
// ============================================
function toggleSidebar() {
    elements.chatSidebar.classList.toggle('active');
}

// ============================================
// Navigation
// ============================================
function scrollToChat() {
    document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Chat Functions
// ============================================
async function loadChats() {
    try {
        const response = await fetch('/api/get-chats');
        const data = await response.json();

        if (data.success) {
            renderChatList(data.chats);
            if (data.current_chat_id && data.chats.length > 0) {
                loadChat(data.current_chat_id);
            }
        }
    } catch (error) {
        console.error('Error loading chats:', error);
    }
}

function renderChatList(chats) {
    if (chats.length === 0) {
        elements.chatList.innerHTML = `
            <div class="empty-chats">
                <p style="color: var(--text-muted); text-align: center; padding: 2rem;">
                    No conversations yet.<br>Start a new chat!
                </p>
            </div>
        `;
        return;
    }

    elements.chatList.innerHTML = chats.map(chat => `
        <div class="chat-item ${chat.id === currentChatId ? 'active' : ''}" 
             onclick="loadChat('${chat.id}')">
            <div class="chat-item-icon">
                <i class="fas fa-comment"></i>
            </div>
            <div class="chat-item-content">
                <div class="chat-item-title">${escapeHtml(chat.title)}</div>
                <div class="chat-item-date">${formatDate(chat.created_at)}</div>
            </div>
        </div>
    `).join('');
}

async function loadChat(chatId) {
    try {
        const response = await fetch(`/api/get-chat/${chatId}`);
        const data = await response.json();

        if (data.success) {
            currentChatId = chatId;
            renderMessages(data.chat.messages);
            updateChatListActive();
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                elements.chatSidebar.classList.remove('active');
            }
        }
    } catch (error) {
        console.error('Error loading chat:', error);
        showToast('Error loading chat', 'error');
    }
}

function renderMessages(messages) {
    if (messages.length === 0) {
        elements.chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>Welcome to NexusAI!</h3>
                <p>I'm your AI assistant powered by Cohere. How can I help you today?</p>
                <div class="quick-prompts">
                    <button class="quick-prompt" onclick="sendQuickPrompt('Tell me about yourself')">
                        <i class="fas fa-info-circle"></i>
                        Tell me about yourself
                    </button>
                    <button class="quick-prompt" onclick="sendQuickPrompt('What can you help me with?')">
                        <i class="fas fa-question-circle"></i>
                        What can you help me with?
                    </button>
                    <button class="quick-prompt" onclick="sendQuickPrompt('Give me a fun fact')">
                        <i class="fas fa-lightbulb"></i>
                        Give me a fun fact
                    </button>
                </div>
            </div>
        `;
        return;
    }

    elements.chatMessages.innerHTML = messages.map(msg => createMessageHTML(msg)).join('');
    scrollToBottom();
}

function createMessageHTML(message) {
    const isUser = message.role === 'user';
    const time = formatTime(message.timestamp);

    return `
        <div class="message ${message.role}">
            <div class="message-avatar">
                <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${escapeHtml(message.content)}</div>
                <div class="message-time">${time}</div>
            </div>
        </div>
    `;
}

function updateChatListActive() {
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.chat-item[onclick="loadChat('${currentChatId}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    elements.sendBtn.disabled = true;

    // Clear welcome message if present
    const welcomeMsg = elements.chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    // Add user message
    appendMessage({ role: 'user', content: message, timestamp: new Date().toISOString() });
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, chat_id: currentChatId })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (data.success) {
            currentChatId = data.chat_id;
            appendMessage({ 
                role: 'assistant', 
                content: data.response, 
                timestamp: new Date().toISOString() 
            });
            loadChats(); // Refresh chat list
        } else {
            showToast(data.error || 'Error getting response', 'error');
        }
    } catch (error) {
        removeTypingIndicator();
        showToast('Network error. Please try again.', 'error');
        console.error('Error:', error);
    }

    isLoading = false;
    elements.sendBtn.disabled = false;
}

function sendQuickPrompt(prompt) {
    elements.messageInput.value = prompt;
    sendMessage();
}

function appendMessage(message) {
    const messageHTML = createMessageHTML(message);
    elements.chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingHTML = `
        <div class="typing-message" id="typingIndicator">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    elements.chatMessages.insertAdjacentHTML('beforeend', typingHTML);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

async function createNewChat() {
    try {
        const response = await fetch('/api/new-chat', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            currentChatId = data.chat_id;
            renderMessages([]);
            loadChats();
            showToast('New chat created!', 'success');
        }
    } catch (error) {
        showToast('Error creating new chat', 'error');
    }
}

async function clearCurrentChat() {
    if (!currentChatId) {
        showToast('No active chat to clear', 'info');
        return;
    }

    if (!confirm('Clear all messages in this chat?')) return;

    try {
        const response = await fetch('/api/clear-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: currentChatId })
        });

        const data = await response.json();

        if (data.success) {
            renderMessages([]);
            showToast('Chat cleared!', 'success');
        }
    } catch (error) {
        showToast('Error clearing chat', 'error');
    }
}

async function deleteCurrentChat() {
    if (!currentChatId) {
        showToast('No active chat to delete', 'info');
        return;
    }

    if (!confirm('Delete this entire conversation?')) return;

    try {
        const response = await fetch('/api/delete-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: currentChatId })
        });

        const data = await response.json();

        if (data.success) {
            currentChatId = null;
            renderMessages([]);
            loadChats();
            showToast('Chat deleted!', 'success');
        }
    } catch (error) {
        showToast('Error deleting chat', 'error');
    }
}

async function clearAllChats() {
    if (!confirm('Delete ALL conversations? This cannot be undone!')) return;

    try {
        const response = await fetch('/api/get-chats');
        const data = await response.json();

        if (data.success) {
            for (const chat of data.chats) {
                await fetch('/api/delete-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chat.id })
                });
            }

            currentChatId = null;
            renderMessages([]);
            loadChats();
            showToast('All chats deleted!', 'success');
        }
    } catch (error) {
        showToast('Error deleting chats', 'error');
    }
}

// ============================================
// Utility Functions
// ============================================
function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'info') {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions globally available
window.scrollToChat = scrollToChat;
window.scrollToFeatures = scrollToFeatures;
window.sendQuickPrompt = sendQuickPrompt;
window.loadChat = loadChat;
