
AIzaSyC1pbvpVeyedn9jUYKlQJztrloVZBHhepY



guys if u want a data base i will update it in later verrsions




# NexusAI - Intelligent Chatbot 🤖

A beautiful, modern AI chatbot powered by Cohere AI with a stunning glassmorphism UI design.

![NexusAI](https://img.shields.io/badge/AI-Powered-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![Python](https://img.shields.io/badge/Python-3.9+-yellow)
![Cohere](https://img.shields.io/badge/Cohere-API-purple)

## ✨ Features

- 🎨 **Beautiful Glassmorphism UI** - Modern, responsive design with dark mode
- 💬 **Multi-Conversation Support** - Create and manage multiple chat sessions
- 🧠 **AI-Powered Responses** - Powered by Cohere's latest `command-a-03-2025` model
- 📝 **Chat History** - Maintains conversation context across messages
- ⚡ **Real-time Responses** - Instant AI responses with typing indicators
- 🌐 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **Quick Prompts** - Pre-defined prompts for quick interactions
- 💾 **Session Management** - Persistent chat sessions during your browsing session

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- Cohere API Key (free trial available at [cohere.ai](https://cohere.ai))

### Installation

1. **Clone or download the project**
   ```bash
   cd "C:\Users\sarja\Downloads\New folder (2)\ChatBot"
   ```

2. **Install required packages**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your API key**
   - Open `app.py`
   - Replace the API key on line 12:
     ```python
     COHERE_API_KEY = "your-api-key-here"
     ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   - Navigate to: `http://127.0.0.1:5000`

## 📁 Project Structure

```
ChatBot/
│
├── static/
│   ├── style.css          # Main stylesheet with glassmorphism design
│   └── script.js          # Frontend JavaScript logic
│
├── templates/
│   └── index.html         # Main HTML template
│
├── app.py                 # Flask backend with Cohere API integration
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🛠️ Technologies Used

- **Backend:**
  - Flask 2.3.3 - Python web framework
  - Cohere AI - Advanced language model API
  - Python Sessions - Chat history management

- **Frontend:**
  - HTML5 - Structure
  - CSS3 - Glassmorphism design with animations
  - Vanilla JavaScript - Dynamic interactions
  - Font Awesome - Icons
  - Inter Font - Typography

## 🎨 Features in Detail

### Chat Management
- **New Chat** - Create fresh conversations
- **Chat History** - View all your conversations in the sidebar
- **Clear Chat** - Remove messages from current conversation
- **Delete Chat** - Remove entire conversation
- **Clear All** - Delete all conversations

### UI Features
- **Dark Theme** - Eye-friendly dark interface
- **Animated Background** - Floating gradient orbs
- **Glassmorphism** - Modern glass-like UI elements
- **Responsive Grid** - Adapts to any screen size
- **Smooth Animations** - Polished micro-interactions

## 🔧 Configuration

### Cohere API Settings

In `app.py`, you can modify the AI behavior:

```python
response = co.chat(
    model="command-a-03-2025",  # AI model
    messages=messages
)
```

### Session Storage

Currently uses in-memory storage. For production, replace with a database:

```python
# Current: In-memory dictionary
chat_histories = {}

# Production: Use MongoDB, PostgreSQL, etc.
```

## 🐛 Troubleshooting

### Common Issues

1. **"ClientV2 not found"**
   - Solution: Upgrade Cohere
   ```bash
   pip install --upgrade cohere
   ```

2. **CSS not loading**
   - Solution: Hard refresh browser (`Ctrl+F5`)
   - Check Flask static file paths in `index.html`

3. **Model errors**
   - Ensure using `command-a-03-2025` model
   - Verify API key is valid and has quota

4. **Port already in use**
   - Change port in `app.py`:
   ```python
   app.run(debug=True, port=5001)  # Use different port
   ```

## 📝 API Endpoints

- `GET /` - Main application page
- `POST /api/chat` - Send message and get AI response
- `POST /api/new-chat` - Create new conversation
- `POST /api/clear-chat` - Clear messages in chat
- `POST /api/delete-chat` - Delete conversation
- `GET /api/get-chats` - Get all conversations
- `GET /api/get-chat/<chat_id>` - Get specific conversation

## 🎯 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] File upload support
- [ ] Export chat history
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Custom AI personality settings

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Credits

- **AI Model:** [Cohere AI](https://cohere.ai)
- **Icons:** [Font Awesome](https://fontawesome.com)
- **Fonts:** [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review [Cohere Documentation](https://docs.cohere.com)
3. Ensure all dependencies are installed correctly

---

**Made with ❤️ using Flask and Cohere AI**
