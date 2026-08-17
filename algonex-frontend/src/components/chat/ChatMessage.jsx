import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { CardRenderer } from "./ChatCards";

const msgVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`buddy-msg-row ${isUser ? "buddy-msg-user" : "buddy-msg-ai"}`}
      variants={msgVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar */}
      {!isUser && (
        <div className="buddy-avatar buddy-avatar-ai">
          <Bot size={16} />
        </div>
      )}

      <div className="buddy-msg-content">
        {/* Text bubble */}
        <div className={`buddy-bubble ${isUser ? "buddy-bubble-user" : "buddy-bubble-ai"}`}>
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <div className="buddy-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Rich cards below AI messages */}
        {!isUser && message.cards && message.cards.length > 0 && (
          <CardRenderer cards={message.cards} />
        )}
      </div>

      {isUser && (
        <div className="buddy-avatar buddy-avatar-user">
          <User size={16} />
        </div>
      )}
    </motion.div>
  );
}
