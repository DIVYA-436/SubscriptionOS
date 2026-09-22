import { useMemo, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

import {
  calculateStats,
  formatCurrency,
  monthlyEquivalent,
} from "./utils";

export default function AI({
  subscriptions,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your SubscriptionOS AI Advisor. I can analyze your subscriptions, spending and upcoming renewals.",
    },
  ]);

  const stats = calculateStats(subscriptions);

  const highest = useMemo(
    () =>
      [...subscriptions].sort(
        (a, b) =>
          monthlyEquivalent(b) - monthlyEquivalent(a)
      )[0],
    [subscriptions]
  );

  const insights = [
    {
      icon: <TrendingDown size={18} />,
      title: "Spending snapshot",
      text: `You're spending approximately ${formatCurrency(
        stats.monthly
      )} every month.`,
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Renewal watch",
      text: `${stats.upcoming} subscription${
        stats.upcoming === 1 ? "" : "s"
      } renew within 30 days.`,
    },
    {
      icon: <Lightbulb size={18} />,
      title: "Largest subscription",
      text: highest
        ? `${highest.name} costs ${formatCurrency(
            monthlyEquivalent(highest)
          )} per month equivalent.`
        : "Add subscriptions to generate insights.",
    },
  ];

  const answer = (question) => {
    const q = question.toLowerCase();

    if (q.includes("spend") || q.includes("cost")) {
      return `Your current monthly-equivalent spend is ${formatCurrency(
        stats.monthly
      )}, with an estimated yearly spend of ${formatCurrency(
        stats.yearly
      )}.`;
    }

    if (q.includes("renew")) {
      return `${stats.upcoming} active subscription${
        stats.upcoming === 1 ? "" : "s"
      } are scheduled to renew within the next 30 days.`;
    }

    if (q.includes("expensive") || q.includes("largest")) {
      return highest
        ? `${highest.name} is currently your largest monthly-equivalent expense at ${formatCurrency(
            monthlyEquivalent(highest)
          )}.`
        : "I need at least one subscription to analyze this.";
    }

    if (q.includes("save")) {
      return "A good next step is to review subscriptions you rarely use, compare overlapping entertainment services, and check annual plans against your actual usage.";
    }

    return "I can help with spending, renewals, expensive subscriptions and ways to reduce recurring costs. Try asking: 'How much am I spending?'";
  };

  const sendMessage = (text = message) => {
    if (!text.trim()) return;

    const userMessage = text.trim();

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userMessage },
      { role: "ai", text: answer(userMessage) },
    ]);

    setMessage("");
  };

  return (
    <div className="ai-page">
      <div className="ai-hero">
        <div className="ai-orb">
          <Sparkles size={32} />
        </div>

        <div>
          <div className="eyebrow">SUBSCRIPTIONOS INTELLIGENCE</div>
          <h1>Your personal subscription advisor.</h1>
          <p>
            Understand recurring spending, identify waste and stay
            ahead of renewals.
          </p>
        </div>
      </div>

      <div className="ai-layout">
        <div className="ai-chat-card">
          <div className="ai-chat-header">
            <div>
              <strong>AI Advisor</strong>
              <span>Local intelligence mode</span>
            </div>

            <div className="ai-status">
              <span />
              Online
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`chat-message ${item.role}`}
              >
                {item.role === "ai" && (
                  <div className="chat-avatar">
                    <Bot size={16} />
                  </div>
                )}

                <div className="chat-bubble">{item.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask about your subscriptions..."
            />

            <button onClick={() => sendMessage()}>
              <Send size={17} />
            </button>
          </div>
        </div>

        <div className="ai-insights">
          <h3>Smart insights</h3>

          {insights.map((item, index) => (
            <div className="ai-insight-card" key={index}>
              <div>{item.icon}</div>
              <section>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </section>
            </div>
          ))}

          <div className="ai-suggestion">
            <Sparkles size={18} />
            <div>
              <strong>Try asking</strong>
              <p>
                “Which subscription costs me the most?”
              </p>
              <p>“How can I save money?”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}