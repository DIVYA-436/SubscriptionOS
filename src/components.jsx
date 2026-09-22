import { useEffect, useState } from "react";

import {
  Bell,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  Pencil,
  ExternalLink,
  Search,
  WalletCards,
} from "lucide-react";

import {
  formatCurrency,
  getRenewalLabel,
  monthlyEquivalent,
} from "./utils";

import { services } from "./data";
export function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <span />
        <span />
        <span />
      </div>

      <div>
        <strong>SubscriptionOS</strong>
        <small>Financial command center</small>
      </div>
    </div>
  );
}

export function Sidebar({ page, setPage, onAdd }) {
  const items = [
    ["overview", "Overview", "⌂"],
    ["subscriptions", "Subscriptions", "◈"],
    ["analytics", "Analytics", "◒"],
    ["calendar", "Renewal calendar", "□"],
    ["ai", "AI Advisor", "✦"],
  ];

  return (
    <aside className="sidebar">
      <Logo />

      <div className="side-section-title">WORKSPACE</div>

      <nav>
        {items.map(([id, label, icon]) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            onClick={() => setPage(id)}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="add-button" onClick={onAdd}>
          <Plus size={18} />
          Add subscription
        </button>

        <div className="sidebar-tip">
          <Sparkles size={17} />
          <div>
            <strong>Smart savings</strong>
            <p>Let AI find subscriptions you may not need.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({
  search,
  setSearch,
  theme,
  setTheme,
}) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <Logo />
      </div>

      <div className="search-box">
        <Search size={17} />
        <input
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <kbd>⌘ K</kbd>
      </div>

      <div className="top-actions">
        <button
          className="icon-button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>

        <button className="icon-button notification">
          <Bell size={18} />
          <span />
        </button>

        <div className="avatar">D</div>
      </div>
    </header>
  );
}

export function StatCard({
  icon,
  label,
  value,
  detail,
  accent,
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${accent || ""}`}>{icon}</div>
        <MoreHorizontal size={18} className="muted-icon" />
      </div>

      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}

export function SubscriptionCard({
  subscription,
  onDelete,
  onEdit,
}) {
  const days = monthlyEquivalent(subscription);

  return (
    <div className="subscription-card">
      <div className="subscription-main">
        <div
          className="service-logo"
          style={{ background: subscription.color }}
        >
          {subscription.icon}
        </div>

        <div className="subscription-info">
          <div className="service-name-row">
            <h3>{subscription.name}</h3>
            <span className="active-pill">Active</span>
          </div>

          <p>{subscription.category}</p>
        </div>
      </div>

      <div className="subscription-price">
        <strong>{formatCurrency(subscription.price)}</strong>
        <span>/{subscription.billing === "Yearly" ? "year" : "month"}</span>
      </div>

      <div className="subscription-renewal">
        <span>Next renewal</span>
        <strong>{getRenewalLabel(subscription.renewal)}</strong>
      </div>

      <div className="subscription-actions">
        <a
          href={subscription.url}
          target="_blank"
          rel="noreferrer"
          className="renew-button"
        >
          Renew
          <ExternalLink size={14} />
        </a>

        <button onClick={() => onEdit(subscription)} title="Edit">
          <Pencil size={16} />
        </button>

        <button onClick={() => onDelete(subscription.id)} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="subscription-mobile-cost">
        ≈ {formatCurrency(days)} / month
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {action}
    </div>
  );
}

export function EmptyState({ onAdd }) {
  return (
    <div className="empty-state">
      <WalletCards size={34} />
      <h3>No subscriptions found</h3>
      <p>Add your first subscription to start tracking your spending.</p>
      <button className="primary-button" onClick={onAdd}>
        <Plus size={17} />
        Add subscription
      </button>
    </div>
  );
}

export function AddSubscriptionModal({
  editing,
  form,
  setForm,
  onClose,
  onSave,
}) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [search, setSearch] = useState("");

  const serviceList = services || [];

  useEffect(() => {
    if (editing?.serviceId) {
      const service = serviceList.find(
        (item) => item.id === editing.serviceId
      );

      if (service) {
        setSelectedService(service);

        const plan = service.plans?.find(
          (item) => item.id === editing.planId
        );

        if (plan) {
          setSelectedPlan(plan);
        }
      }
    }
  }, [editing]);

  const filteredServices = serviceList.filter((service) =>
    service.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const chooseService = (service) => {
    setSelectedService(service);
    setSelectedPlan(null);

    setForm((previous) => ({
      ...previous,
      name: service.name,
      category: service.category,
      url: service.url,
      color: service.color,
      icon: service.icon,
      price: "",
      billing: "",
      serviceId: service.id,
      planId: "",
      planName: "",
      planDetails: [],
    }));
  };

  const choosePlan = (plan) => {
    if (!selectedService) return;

    setSelectedPlan(plan);

    setForm((previous) => ({
      ...previous,
      name: selectedService.name,
      category: selectedService.category,
      price: plan.price,
      billing: plan.billing,
      url: selectedService.url,
      color: selectedService.color,
      icon: selectedService.icon,
      serviceId: selectedService.id,
      planId: plan.id,
      planName: plan.name,
      planDetails: plan.details || [],
    }));
  };

  const chooseCustom = () => {
    setSelectedService({
      id: "custom",
      name: "Custom service",
      category: "Other",
      color: "#635BFF",
      icon: "＋",
      url: "",
      plans: [],
    });

    setSelectedPlan(null);

    setForm((previous) => ({
      ...previous,
      name: "",
      category: "Other",
      price: "",
      billing: "Monthly",
      url: "",
      color: "#635BFF",
      icon: "＋",
      serviceId: "custom",
      planId: "",
      planName: "",
      planDetails: [],
    }));
  };

  const handleSave = () => {
    if (!selectedService) {
      alert("Please choose a service.");
      return;
    }

    if (
      selectedService.id !== "custom" &&
      !selectedPlan
    ) {
      alert("Please choose a plan.");
      return;
    }

    if (!form.name || !form.price || !form.renewal) {
      alert("Please complete the required details.");
      return;
    }

    onSave();
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal subscription-picker-modal">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              {editing
                ? "UPDATE SUBSCRIPTION"
                : "ADD SUBSCRIPTION"}
            </span>

            <h2>
              {editing
                ? "Update your subscription"
                : "Choose a service"}
            </h2>

            <p>
              Pick a service and select the plan you're
              actually subscribed to.
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {!selectedService && (
          <>
            <div className="service-picker-search">
              <span>⌕</span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search services..."
              />
            </div>

            <div className="service-picker-grid">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className="service-picker-card"
                  onClick={() =>
                    chooseService(service)
                  }
                >
                  <div
                    className="service-picker-logo"
                    style={{
                      background: service.color,
                    }}
                  >
                    {service.icon}
                  </div>

                  <strong>{service.name}</strong>

                  <span>{service.category}</span>
                </button>
              ))}

              <button
                type="button"
                className="service-picker-card custom-service-card"
                onClick={chooseCustom}
              >
                <div className="service-picker-logo custom-logo">
                  ＋
                </div>

                <strong>Other</strong>

                <span>Add custom service</span>
              </button>
            </div>
          </>
        )}

        {selectedService && (
          <div className="subscription-step-content">
            <button
              type="button"
              className="picker-back-button"
              onClick={() => {
                setSelectedService(null);
                setSelectedPlan(null);
              }}
            >
              ← Choose another service
            </button>

            <div className="selected-service-banner">
              <div
                className="selected-service-logo"
                style={{
                  background: selectedService.color,
                }}
              >
                {selectedService.icon}
              </div>

              <div>
                <span>Selected service</span>
                <strong>
                  {selectedService.name}
                </strong>
              </div>
            </div>

            {selectedService.id !== "custom" ? (
              <>
                <div className="plan-section-heading">
                  <div>
                    <span>STEP 2</span>
                    <h3>Choose your plan</h3>
                  </div>

                  <small>
                    {selectedService.plans.length}{" "}
                    available options
                  </small>
                </div>

                <div className="plan-picker-list">
                  {selectedService.plans.map((plan) => {
                    const active =
                      selectedPlan?.id === plan.id;

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        className={`plan-picker-card ${
                          active ? "selected" : ""
                        }`}
                        onClick={() =>
                          choosePlan(plan)
                        }
                      >
                        <div className="plan-picker-main">
                          <div>
                            <strong>
                              {plan.name}
                            </strong>

                            <span>
                              {plan.billing}
                            </span>
                          </div>

                          <div className="plan-price">
                            <strong>
                              ₹
                              {Number(
                                plan.price
                              ).toLocaleString("en-IN")}
                            </strong>

                            <span>
                              /{" "}
                              {plan.billing ===
                              "Yearly"
                                ? "year"
                                : plan.billing ===
                                  "Quarterly"
                                ? "quarter"
                                : "month"}
                            </span>
                          </div>
                        </div>

                        <div className="plan-details">
                          {plan.details?.map(
                            (detail) => (
                              <span key={detail}>
                                ✓ {detail}
                              </span>
                            )
                          )}
                        </div>

                        <div className="plan-radio">
                          {active ? "✓" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedPlan && (
                  <div className="selected-plan-summary">
                    <span>Selected plan</span>

                    <strong>
                      {selectedPlan.name}
                    </strong>

                    <b>
                      ₹
                      {Number(
                        selectedPlan.price
                      ).toLocaleString("en-IN")}
                      {" / "}
                      {selectedPlan.billing ===
                      "Yearly"
                        ? "year"
                        : selectedPlan.billing ===
                          "Quarterly"
                        ? "quarter"
                        : "month"}
                    </b>
                  </div>
                )}
              </>
            ) : (
              <div className="custom-subscription-fields">
                <div className="custom-field">
                  <label>Service name</label>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Canva"
                  />
                </div>

                <div className="custom-field">
                  <label>Price</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        price: event.target.value,
                      }))
                    }
                    placeholder="₹"
                  />
                </div>

                <div className="custom-field">
                  <label>Billing</label>
                  <select
                    value={form.billing}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        billing: event.target.value,
                      }))
                    }
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div className="custom-field">
                  <label>Website</label>
                  <input
                    value={form.url}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        url: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            <div className="renewal-field">
              <label>Next renewal date</label>

              <input
                type="date"
                value={form.renewal || ""}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    renewal: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
            disabled={
              !selectedService ||
              (selectedService.id !== "custom" &&
                !selectedPlan)
            }
          >
            {editing
              ? "Save changes"
              : "Add subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RenewalMiniCard({ subscription }) {
  return (
    <div className="renewal-mini-card">
      <div
        className="mini-logo"
        style={{ background: subscription.color }}
      >
        {subscription.icon}
      </div>

      <div className="renewal-mini-info">
        <strong>{subscription.name}</strong>
        <span>{getRenewalLabel(subscription.renewal)}</span>
      </div>

      <strong>{formatCurrency(subscription.price)}</strong>
    </div>
  );
}

export function QuickInsight({ icon, title, text }) {
  return (
    <div className="quick-insight">
      <div className="insight-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <ChevronRight size={17} />
    </div>
  );
}