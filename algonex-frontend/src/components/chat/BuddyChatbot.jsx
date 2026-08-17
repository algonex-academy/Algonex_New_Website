import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Trash2, Sparkles, ChevronDown } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { sendBuddyMessage } from "../../api/buddy";

// ─── Suggested starter prompts ────────────────────────────────────────────────

const SUGGESTIONS = [
  "What courses do you offer?",
  "Show me trending courses",
  "Any upcoming events?",
  "Are there any internships?",
  "What beginner courses are available?",
];

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="buddy-msg-row buddy-msg-ai">
      <div className="buddy-avatar buddy-avatar-ai">
        <Sparkles size={14} />
      </div>
      <div className="buddy-bubble buddy-bubble-ai buddy-typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ─── Main Chatbot Component ────────────────────────────────────────────────────

export default function BuddyChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // Detect scroll position to show/hide scroll button
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 150);
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      // Show greeting if no messages yet
      if (messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            content:
              "👋 Hi! I'm **Buddy**, your Algonex AI assistant!\n\nI can help you discover courses, events, internships, and more. What would you like to know?",
            cards: [],
          },
        ]);
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearChat = () => {
    setMessages([]);
    // Re-add greeting
    setTimeout(() => {
      setMessages([
        {
          role: "assistant",
          content:
            "Chat cleared! 👋 How can I help you today?",
          cards: [],
        },
      ]);
    }, 100);
  };

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || loading) return;

      const userMsg = { role: "user", content: trimmed };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        // Build API payload: only role + content, no extra fields
        const apiPayload = updatedMessages.map(({ role, content }) => ({ role, content }));
        const response = await sendBuddyMessage(apiPayload);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.message,
            cards: response.cards || [],
          },
        ]);
      } catch (_err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment.",
            cards: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── CSS Variables + Styles ── */}
      <style>{`
        :root {
          --buddy-bg: #0f1117;
          --buddy-surface: #1a1d27;
          --buddy-surface2: #22253a;
          --buddy-border: rgba(255,255,255,0.07);
          --buddy-text: #e2e8f0;
          --buddy-muted: #718096;
          --buddy-accent: #6366f1;
          --buddy-accent2: #8b5cf6;
          --buddy-green: #10b981;
          --buddy-amber: #f59e0b;
          --buddy-red: #ef4444;
          --buddy-user-bubble: linear-gradient(135deg, #6366f1, #8b5cf6);
          --buddy-ai-bubble: #1e2235;
          --buddy-radius: 14px;
          --buddy-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15);
        }

        /* ── FAB Button ── */
        .buddy-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9998;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--buddy-accent), var(--buddy-accent2));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(99,102,241,0.5), 0 2px 8px rgba(0,0,0,0.4);
          color: #fff;
          outline: none;
          transition: transform 0.2s;
        }
        .buddy-fab:hover { transform: scale(1.08); }
        .buddy-fab:active { transform: scale(0.96); }

        /* Pulse ring on FAB */
        .buddy-fab-pulse {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9997;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: transparent;
          border: 2px solid var(--buddy-accent);
          animation: buddyPulse 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes buddyPulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* ── WhatsApp FAB Button ── */
        .whatsapp-fab {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9998;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #25D366;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.4), 0 2px 8px rgba(0,0,0,0.3);
          color: #fff !important;
          outline: none;
          transition: transform 0.2s, background-color 0.2s;
        }
        .whatsapp-fab:hover {
          transform: scale(1.08);
          background-color: #20ba5a;
        }
        .whatsapp-fab:active {
          transform: scale(0.96);
        }

        /* Pulse ring on WhatsApp FAB */
        .whatsapp-fab-pulse {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9997;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: transparent;
          border: 2px solid #25D366;
          animation: whatsappPulse 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes whatsappPulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* ── Chat Window ── */
        .buddy-window {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9999;
          width: 400px;
          max-height: 640px;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          background: var(--buddy-bg);
          border-radius: 20px;
          box-shadow: var(--buddy-shadow);
          border: 1px solid var(--buddy-border);
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .buddy-window {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 88px;
            max-height: 72vh;
          }
          .buddy-fab, .buddy-fab-pulse { bottom: 16px; right: 16px; }
          .whatsapp-fab, .whatsapp-fab-pulse { bottom: 84px; right: 16px; }
        }

        /* ── Header ── */
        .buddy-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: linear-gradient(135deg, #13152a 0%, #1a1d2e 100%);
          border-bottom: 1px solid var(--buddy-border);
          flex-shrink: 0;
        }
        .buddy-header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--buddy-accent), var(--buddy-accent2));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(99,102,241,0.4);
        }
        .buddy-header-info { flex: 1; }
        .buddy-header-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--buddy-text);
          letter-spacing: 0.01em;
          line-height: 1.2;
        }
        .buddy-header-status {
          font-size: 11px;
          color: var(--buddy-green);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .buddy-online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--buddy-green);
          animation: onlinePulse 2s ease-in-out infinite;
        }
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .buddy-header-actions {
          display: flex;
          gap: 6px;
        }
        .buddy-icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          color: var(--buddy-muted);
          display: flex;
          align-items: center;
          transition: background 0.15s, color 0.15s;
        }
        .buddy-icon-btn:hover { background: var(--buddy-surface2); color: var(--buddy-text); }

        /* ── Messages area ── */
        .buddy-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px 12px 4px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
          position: relative;
        }
        .buddy-messages::-webkit-scrollbar { width: 4px; }
        .buddy-messages::-webkit-scrollbar-track { background: transparent; }
        .buddy-messages::-webkit-scrollbar-thumb { background: var(--buddy-border); border-radius: 2px; }

        /* ── Message row ── */
        .buddy-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .buddy-msg-ai { flex-direction: row; }
        .buddy-msg-user { flex-direction: row-reverse; }
        .buddy-msg-content { display: flex; flex-direction: column; gap: 8px; max-width: 82%; }
        .buddy-msg-user .buddy-msg-content { align-items: flex-end; }
        .buddy-msg-ai .buddy-msg-content { align-items: flex-start; }

        /* ── Avatar ── */
        .buddy-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .buddy-avatar-ai {
          background: linear-gradient(135deg, var(--buddy-accent), var(--buddy-accent2));
          color: #fff;
        }
        .buddy-avatar-user {
          background: var(--buddy-surface2);
          color: var(--buddy-muted);
        }

        /* ── Bubbles ── */
        .buddy-bubble {
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.55;
          word-break: break-word;
        }
        .buddy-bubble-user {
          background: var(--buddy-user-bubble);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .buddy-bubble-ai {
          background: var(--buddy-ai-bubble);
          color: var(--buddy-text);
          border: 1px solid var(--buddy-border);
          border-bottom-left-radius: 4px;
        }

        /* ── Markdown inside bubbles ── */
        .buddy-markdown p { margin: 0 0 6px; }
        .buddy-markdown p:last-child { margin-bottom: 0; }
        .buddy-markdown strong { color: #c7d2fe; }
        .buddy-markdown ul, .buddy-markdown ol { margin: 4px 0 4px 18px; padding: 0; }
        .buddy-markdown li { margin-bottom: 2px; }
        .buddy-markdown code {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 12px;
        }

        /* ── Typing indicator ── */
        .buddy-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 12px 16px !important;
        }
        .buddy-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--buddy-muted);
          animation: typingBounce 1.4s ease-in-out infinite;
        }
        .buddy-typing span:nth-child(1) { animation-delay: 0s; }
        .buddy-typing span:nth-child(2) { animation-delay: 0.2s; }
        .buddy-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        /* ── Cards grid ── */
        .buddy-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 360px;
        }

        /* ── Card ── */
        .buddy-card {
          background: var(--buddy-surface);
          border: 1px solid var(--buddy-border);
          border-radius: 14px;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .buddy-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transform: translateY(-1px);
        }
        .buddy-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          padding: 8px 12px;
        }
        .buddy-card-body {
          padding: 10px 14px 8px;
        }
        .buddy-card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--buddy-text);
          margin: 0 0 4px;
          line-height: 1.4;
        }
        .buddy-card-desc {
          font-size: 11.5px;
          color: var(--buddy-muted);
          margin: 0 0 8px;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .buddy-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 6px;
        }
        .buddy-card-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--buddy-muted);
        }
        .buddy-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px 12px;
          gap: 8px;
        }
        .buddy-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          letter-spacing: 0.02em;
        }
        .buddy-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        .buddy-tag {
          font-size: 10px;
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.25);
          padding: 2px 7px;
          border-radius: 20px;
        }
        .buddy-price {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .buddy-price-main {
          font-size: 15px;
          font-weight: 700;
          color: var(--buddy-text);
        }
        .buddy-price-orig {
          font-size: 11px;
          color: var(--buddy-muted);
          text-decoration: line-through;
        }
        .buddy-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, var(--buddy-accent), var(--buddy-accent2));
          color: #fff !important;
          text-decoration: none !important;
          font-size: 11.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.15s, transform 0.15s;
        }
        .buddy-cta-btn:hover { opacity: 0.9; transform: scale(1.02); }

        /* ── Suggestions ── */
        .buddy-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px 12px 6px;
        }
        .buddy-suggestion-chip {
          font-size: 11.5px;
          background: var(--buddy-surface2);
          color: var(--buddy-text);
          border: 1px solid var(--buddy-border);
          padding: 5px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .buddy-suggestion-chip:hover {
          background: rgba(99,102,241,0.2);
          border-color: var(--buddy-accent);
        }

        /* ── Input area ── */
        .buddy-input-area {
          padding: 10px 12px 14px;
          border-top: 1px solid var(--buddy-border);
          background: var(--buddy-bg);
          flex-shrink: 0;
        }
        .buddy-input-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: var(--buddy-surface);
          border: 1px solid var(--buddy-border);
          border-radius: 14px;
          padding: 8px 10px;
          transition: border-color 0.2s;
        }
        .buddy-input-row:focus-within {
          border-color: var(--buddy-accent);
          box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
        }
        .buddy-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--buddy-text);
          font-size: 13.5px;
          resize: none;
          min-height: 20px;
          max-height: 100px;
          line-height: 1.5;
          font-family: inherit;
        }
        .buddy-textarea::placeholder { color: var(--buddy-muted); }
        .buddy-send-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--buddy-accent), var(--buddy-accent2));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          transition: opacity 0.15s, transform 0.15s;
        }
        .buddy-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .buddy-send-btn:not(:disabled):hover { opacity: 0.9; transform: scale(1.05); }

        /* ── Scroll to bottom btn ── */
        .buddy-scroll-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--buddy-surface2);
          border: 1px solid var(--buddy-border);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--buddy-text);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: opacity 0.2s;
        }
        .buddy-scroll-btn:hover { background: var(--buddy-accent); }
      `}</style>

      {/* ── FAB + Pulse ── */}
      <AnimatePresence>
        {!open && (
          <>
            {/* WhatsApp FAB */}
            <div className="whatsapp-fab-pulse" />
            <motion.a
              href="https://api.whatsapp.com/send?phone=919959789424&text=Hello%20ALGONEX%20Team%20i'm%20looking%20for%20Hands-on%20Training/Internship/Placement%20Service"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
              title="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.56 0 11.9-5.336 11.903-11.894a11.786 11.786 0 00-3.486-8.413z" />
              </svg>
            </motion.a>

            {/* Chatbot FAB */}
            <div className="buddy-fab-pulse" />
            <motion.button
              id="buddy-fab-btn"
              className="buddy-fab"
              onClick={() => setOpen(true)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              title="Chat with Buddy"
            >
              <MessageCircle size={26} />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="buddy-chat-window"
            className="buddy-window"
            initial={{ opacity: 0, scale: 0.85, y: 30, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="buddy-header">
              <div className="buddy-header-avatar">
                <Sparkles size={18} />
              </div>
              <div className="buddy-header-info">
                <div className="buddy-header-name">Buddy · Algonex AI</div>
                <div className="buddy-header-status">
                  <span className="buddy-online-dot" />
                  Online · Powered by Gemini
                </div>
              </div>
              <div className="buddy-header-actions">
                <button
                  id="buddy-clear-btn"
                  className="buddy-icon-btn"
                  onClick={clearChat}
                  title="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  id="buddy-close-btn"
                  className="buddy-icon-btn"
                  onClick={() => setOpen(false)}
                  title="Close"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              id="buddy-messages"
              className="buddy-messages"
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {loading && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions (only when no conversation beyond greeting) */}
            {messages.length <= 1 && !loading && (
              <div className="buddy-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="buddy-suggestion-chip"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  className="buddy-scroll-btn"
                  onClick={scrollToBottom}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ position: "relative", display: "flex", alignSelf: "flex-end", margin: "4px 10px 0", zIndex: 10 }}
                >
                  <ChevronDown size={15} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="buddy-input-area">
              <div className="buddy-input-row">
                <textarea
                  id="buddy-input"
                  ref={inputRef}
                  className="buddy-textarea"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
                />
                <button
                  id="buddy-send-btn"
                  className="buddy-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  title="Send"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
