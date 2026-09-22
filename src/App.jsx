import { useEffect, useMemo, useState } from "react";

import {
  Download,
  Filter,
  Plus,
  Upload,
  Search,
  Sparkles,
  Check,
  X,
  LogOut,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase";

import Dashboard from "./Dashboard";
import AI from "./AI";

import {
  Sidebar,
  Topbar,
  SubscriptionCard,
  AddSubscriptionModal,
  EmptyState,
  SectionHeader,
} from "./components";

import {
  categories,
  initialBudget,
} from "./data";

import {
  exportSubscriptions,
  loadSubscriptions,
  saveSubscriptions,
  calculateStats,
  parseCSV,
  detectRecurringPayments,
} from "./utils";

// =========================================================
// CONSTANTS
// =========================================================

const DEMO_OTP = "123456";

const blankForm = {
  name: "",
  category: "Entertainment",
  price: "",
  billing: "Monthly",
  renewal: "",
  url: "",
  color: "#635BFF",
  icon: "S",
  active: true,
};

// =========================================================
// AUTH SCREEN
// =========================================================

// =========================================================
// AUTH SCREEN
// =========================================================

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("account");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------------------------------
  // LOGIN / CREATE ACCOUNT
  // -------------------------------------------------------

  const submitAccount = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // Extra validation only for signup
    if (mode === "signup") {
      if (username.trim().length < 2) {
        setError("Please enter your username.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      let credential;

      // =====================================================
      // CREATE ACCOUNT
      // =====================================================

      if (mode === "signup") {
        credential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        const user = {
          uid: credential.user.uid,
          email: credential.user.email,
          username:
            username.trim() ||
            credential.user.email?.split("@")[0] ||
            "User",
        };

        // Store temporary signup information.
        // OTP is required ONLY during signup.
        sessionStorage.setItem(
          "subscriptionos_pending_user",
          JSON.stringify(user)
        );

        setStep("phone");
        return;
      }

      // =====================================================
      // EXISTING USER LOGIN
      // =====================================================

      credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const user = {
        uid: credential.user.uid,
        email: credential.user.email,
        username:
          credential.user.email?.split("@")[0] ||
          "User",
        loggedIn: true,
      };

      // IMPORTANT:
      // Existing users go directly to the app.
      // NO PHONE.
      // NO OTP.
      localStorage.setItem(
        "subscriptionos_user",
        JSON.stringify(user)
      );

      onLogin(user);
    } catch (firebaseError) {
      console.error(firebaseError);

      if (
        firebaseError?.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "This email already has an account. Please log in instead."
        );
      } else if (
        firebaseError?.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Incorrect email or password."
        );
      } else if (
        firebaseError?.code ===
        "auth/user-not-found"
      ) {
        setError(
          "No account found with this email. Please create an account."
        );
      } else if (
        firebaseError?.code ===
        "auth/wrong-password"
      ) {
        setError(
          "Incorrect password. Please try again."
        );
      } else if (
        firebaseError?.code ===
        "auth/weak-password"
      ) {
        setError(
          "Please use a stronger password."
        );
      } else {
        setError(
          firebaseError?.message ||
            "Authentication failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // DEMO PHONE VERIFICATION
  // ONLY USED DURING ACCOUNT CREATION
  // -------------------------------------------------------

  const verifyDemoOtp = () => {
    setError("");

    if (otp !== DEMO_OTP) {
      setError(
        "Incorrect OTP. Use the demo OTP shown below."
      );
      return;
    }

    const pending = JSON.parse(
      sessionStorage.getItem(
        "subscriptionos_pending_user"
      ) || "null"
    );

    if (!pending) {
      setError(
        "Your signup session expired. Please create your account again."
      );
      setStep("account");
      return;
    }

    const user = {
      ...pending,
      phone: phone.replace(/\D/g, ""),
      phoneVerified: true,
      loggedIn: true,
    };

    localStorage.setItem(
      "subscriptionos_user",
      JSON.stringify(user)
    );

    sessionStorage.removeItem(
      "subscriptionos_pending_user"
    );

    onLogin(user);
  };

  // -------------------------------------------------------
  // SWITCH LOGIN / SIGNUP
  // -------------------------------------------------------

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep("account");

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setOtp("");
    setError("");
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (
    <div className="auth-screen">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-card">

        {/* BRAND */}
        <div className="auth-brand">
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>

          <div>
            <strong>SubscriptionOS</strong>

            <small>
              Financial command center
            </small>
          </div>
        </div>

        {/* =================================================
            LOGIN / SIGNUP TABS
        ================================================= */}

        {step === "account" && (
          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchMode("login")
              }
            >
              Log in
            </button>

            <button
              type="button"
              className={
                mode === "signup"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchMode("signup")
              }
            >
              Create account
            </button>
          </div>
        )}

        {/* =================================================
            LOGIN
        ================================================= */}

        {step === "account" &&
          mode === "login" && (
            <>
              <div className="auth-heading">
                <span>
                  WELCOME BACK
                </span>

                <h1>
                  Welcome back.
                  <br />
                  Let's save you money.
                </h1>

                <p>
                  Track your subscriptions,
                  upcoming renewals and
                  recurring spending in one
                  workspace.
                </p>
              </div>

              <label className="auth-label">
                Email address

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </label>

              <label className="auth-label">
                Password

                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitAccount();
                    }
                  }}
                />
              </label>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                className="auth-primary"
                onClick={submitAccount}
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Log in"}

                <span>→</span>
              </button>

              <p className="auth-switch-text">
                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    switchMode("signup")
                  }
                >
                  Create an account
                </button>
              </p>
            </>
          )}

        {/* =================================================
            CREATE ACCOUNT
        ================================================= */}

        {step === "account" &&
          mode === "signup" && (
            <>
              <div className="auth-heading">
                <span>
                  GET STARTED
                </span>

                <h1>
                  Create your
                  <br />
                  subscription workspace.
                </h1>

                <p>
                  Add your account details first.
                  We'll verify your phone only
                  once during signup.
                </p>
              </div>

              <label className="auth-label">
                Username

                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  placeholder="Your name"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                />
              </label>

              <label className="auth-label">
                Email address

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </label>

              <label className="auth-label">
                Password

                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  placeholder="Minimum 6 characters"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
              </label>

              <label className="auth-label">
                Confirm password

                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  placeholder="Repeat your password"
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setError("");
                  }}
                />
              </label>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                className="auth-primary"
                onClick={submitAccount}
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}

                <span>→</span>
              </button>

              <div className="auth-security-note">
                <span>🔒</span>

                <div>
                  <strong>
                    One-time phone verification
                  </strong>

                  <p>
                    Phone verification is required
                    only when creating your account.
                  </p>
                </div>
              </div>

              <p className="auth-switch-text">
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    switchMode("login")
                  }
                >
                  Log in
                </button>
              </p>
            </>
          )}

        {/* =================================================
            PHONE — SIGNUP ONLY
        ================================================= */}

        {step === "phone" && (
          <>
            <div className="auth-heading">
              <span>
                ONE-TIME VERIFICATION
              </span>

              <h1>
                Verify your
                <br />
                phone number.
              </h1>

              <p>
                This step is required only
                because you're creating a new
                account.
              </p>
            </div>

            <label className="auth-label">
              Phone number

              <div className="phone-input">
                <span>+91</span>

                <input
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                  value={phone}
                  placeholder="10-digit mobile number"
                  onChange={(e) => {
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    );
                    setError("");
                  }}
                />
              </div>
            </label>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              className="auth-primary"
              onClick={() => {
                if (phone.length !== 10) {
                  setError(
                    "Please enter a valid 10-digit phone number."
                  );
                  return;
                }

                setError("");
                setStep("otp");
              }}
            >
              Continue
              <span>→</span>
            </button>

            <button
              className="auth-back"
              onClick={() => {
                setStep("account");
                setError("");
              }}
            >
              ← Back to account details
            </button>
          </>
        )}

        {/* =================================================
            OTP — SIGNUP ONLY
        ================================================= */}

        {step === "otp" && (
          <>
            <div className="auth-heading">
              <span>
                PHONE VERIFICATION
              </span>

              <h1>
                Enter your
                <br />
                verification code.
              </h1>

              <p>
                Demo verification code for
                <strong>
                  {" "}
                  +91 {phone}
                </strong>
                .
              </p>
            </div>

            <label className="auth-label">
              Verification code

              <input
                className="otp-input"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />
            </label>

            <div className="demo-otp">
              <span>
                Development OTP
              </span>

              <strong>
                {DEMO_OTP}
              </strong>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              className="auth-primary"
              onClick={verifyDemoOtp}
            >
              Verify & create account
              <span>→</span>
            </button>

            <button
              className="auth-back"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
            >
              ← Change phone number
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// =========================================================
// ONBOARDING
// =========================================================

function OnboardingScreen({
  user,
  onDiscover,
  onManual,
}) {
  return (
    <div className="onboarding-screen">
      <div className="onboarding-top">
        <div className="auth-brand">
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>

          <div>
            <strong>SubscriptionOS</strong>
            <small>
              Financial command center
            </small>
          </div>
        </div>

        <div className="onboarding-user">
          {user.email}
        </div>
      </div>

      <div className="onboarding-content">
        <div className="onboarding-badge">
          ✦ SMART SETUP
        </div>

        <h1>
          Let's find the subscriptions
          <br />
          you're already paying for.
        </h1>

        <p className="onboarding-description">
          Start with your own subscription data.
          You can add subscriptions manually or
          import transaction data and let
          SubscriptionOS detect recurring payments.
        </p>

        <div className="onboarding-options">
          <button
            className="discovery-card"
            onClick={onDiscover}
          >
            <div className="discovery-icon">
              ⌕
            </div>

            <div>
              <strong>
                Discover my subscriptions
              </strong>

              <p>
                Import transaction data and detect
                recurring payments.
              </p>

              <span>
                Recommended →
              </span>
            </div>
          </button>

          <button
            className="manual-card"
            onClick={onManual}
          >
            <div className="manual-icon">
              ＋
            </div>

            <div>
              <strong>
                I'll add them manually
              </strong>

              <p>
                Start with subscriptions you already
                know about.
              </p>
            </div>
          </button>
        </div>

        <div className="onboarding-note">
          🔒 No sample subscriptions are added.
          Your dashboard contains only data you
          provide or confirm.
        </div>
      </div>
    </div>
  );
}

// =========================================================
// DISCOVERY PAGE
// =========================================================

function DiscoveryPage({
  detected,
  onConfirm,
  onIgnore,
  onBack,
  onFile,
}) {
  return (
    <div className="page-container">
      <SectionHeader
        eyebrow="DISCOVERY"
        title="Find recurring payments"
        description="Import your transaction data and SubscriptionOS will look for repeated payment patterns."
      />

      <div className="discovery-panel">
        <div className="discovery-panel-icon">
          <Sparkles size={24} />
        </div>

        <div>
          <h3>
            Analyze your transaction history
          </h3>

          <p>
            Use a CSV file containing date,
            merchant and amount columns.
            SubscriptionOS analyzes the file
            locally in your browser.
          </p>

          <label className="primary-button discovery-upload">
            <Upload size={17} />
            Choose transaction CSV

            <input
              type="file"
              accept=".csv,.json"
              onChange={onFile}
            />
          </label>
        </div>
      </div>

      {detected.length > 0 && (
        <div className="detected-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                DETECTED
              </span>

              <h2>
                Possible subscriptions
              </h2>
            </div>

            <span>
              {detected.length} found
            </span>
          </div>

          <div className="detected-list">
            {detected.map((item) => (
              <div
                className="detected-card"
                key={item.id}
              >
                <div className="detected-logo">
                  {item.icon}
                </div>

                <div className="detected-info">
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    {item.price
                      ? `₹${item.price.toLocaleString(
                          "en-IN"
                        )}`
                      : "Amount unavailable"}{" "}
                    · {item.billing}
                  </span>

                  <small>
                    {item.detection?.transactions}{" "}
                    repeated transactions ·{" "}
                    {item.detection?.confidence}{" "}
                    confidence
                  </small>
                </div>

                <div className="detected-actions">
                  <button
                    className="icon-action success"
                    title="Confirm"
                    onClick={() =>
                      onConfirm(item)
                    }
                  >
                    <Check size={17} />
                  </button>

                  <button
                    className="icon-action danger"
                    title="Ignore"
                    onClick={() =>
                      onIgnore(item.id)
                    }
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="secondary-button"
        onClick={onBack}
      >
        ← Back to dashboard
      </button>
    </div>
  );
}

// =========================================================
// MAIN APP
// =========================================================

export default function App() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "subscriptionos_user"
        ) || "null"
      );
    } catch {
      return null;
    }
  });

  const [onboardingComplete, setOnboardingComplete] =
    useState(() => {
      return (
        localStorage.getItem(
          "subscriptionos_onboarding_complete"
        ) === "true"
      );
    });

  const [subscriptions, setSubscriptions] =
    useState([]);

  const [page, setPage] = useState("overview");

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

  const [sort, setSort] =
    useState("renewal");

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem(
      "subscriptionos_budget"
    );

    return saved
      ? Number(saved)
      : initialBudget;
  });

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem(
        "subscriptionos_theme"
      ) || "dark"
    );
  });

  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] =
    useState(blankForm);

  const [detected, setDetected] =
    useState([]);

  // -------------------------------------------------------
  // Load user-specific data
  // -------------------------------------------------------

  useEffect(() => {
    if (!authUser) {
      setSubscriptions([]);
      return;
    }

    setSubscriptions(
      loadSubscriptions([])
    );
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;

    saveSubscriptions(subscriptions);
  }, [subscriptions, authUser]);

  useEffect(() => {
    localStorage.setItem(
      "subscriptionos_theme",
      theme
    );

    document.documentElement.dataset.theme =
      theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "subscriptionos_budget",
      String(budget)
    );
  }, [budget]);

  // -------------------------------------------------------
  // Onboarding
  // -------------------------------------------------------

  const completeOnboarding = () => {
    localStorage.setItem(
      "subscriptionos_onboarding_complete",
      "true"
    );

    setOnboardingComplete(true);
  };

  const handleDiscover = () => {
    completeOnboarding();
    setPage("discovery");
  };

  const handleManual = () => {
    completeOnboarding();

    setTimeout(() => {
      openAdd();
    }, 0);
  };

  // -------------------------------------------------------
  // Subscription operations
  // -------------------------------------------------------

  const openAdd = () => {
    setEditing(null);
    setForm(blankForm);
    setModal(true);
  };

  const openEdit = (subscription) => {
    setEditing(subscription);
    setForm(subscription);
    setModal(true);
  };

  const saveSubscription = () => {
    if (
      !form.name.trim() ||
      !form.price ||
      !form.renewal
    ) {
      alert(
        "Please complete the required fields."
      );
      return;
    }

    if (editing) {
      setSubscriptions((previous) =>
        previous.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                ...form,
                name: form.name.trim(),
                price: Number(form.price),
              }
            : item
        )
      );
    } else {
      const newSubscription = {
        ...form,

        id: crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,

        name: form.name.trim(),

        price: Number(form.price),

        icon: form.name
          .trim()
          .charAt(0)
          .toUpperCase(),

        color: "#635BFF",

        source: "Manual",
      };

      setSubscriptions((previous) => [
        newSubscription,
        ...previous,
      ]);
    }

    setModal(false);
    setEditing(null);
    setForm(blankForm);
  };

  const deleteSubscription = (id) => {
    if (
      !window.confirm(
        "Remove this subscription?"
      )
    ) {
      return;
    }

    setSubscriptions((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  // -------------------------------------------------------
  // Search / filter / sort
  // -------------------------------------------------------

  const filtered = useMemo(() => {
    const result =
      subscriptions.filter((item) => {
        const name =
          item.name?.toLowerCase() || "";

        const matchesSearch =
          name.includes(
            search.toLowerCase()
          );

        const matchesCategory =
          category === "All" ||
          item.category === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      });

    return [...result].sort((a, b) => {
      if (sort === "price-high") {
        return b.price - a.price;
      }

      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "name") {
        return a.name.localeCompare(
          b.name
        );
      }

      return (
        new Date(a.renewal) -
        new Date(b.renewal)
      );
    });
  }, [
    subscriptions,
    search,
    category,
    sort,
  ]);

  const stats =
    calculateStats(subscriptions);

  // -------------------------------------------------------
  // Import / discovery
  // -------------------------------------------------------

  const handleDiscoveryFile = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = String(
          e.target.result || ""
        );

        let transactions;

        if (
          file.name
            .toLowerCase()
            .endsWith(".json")
        ) {
          transactions = JSON.parse(text);

          if (!Array.isArray(transactions)) {
            throw new Error(
              "JSON must contain an array."
            );
          }
        } else {
          transactions = parseCSV(text);
        }

        const results =
          detectRecurringPayments(
            transactions
          );

        setDetected(results);

        if (!results.length) {
          alert(
            "No recurring payment pattern was detected in this file."
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          error?.message ||
            "Could not read the transaction file."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  const confirmDetected = (item) => {
    setSubscriptions((previous) => {
      const exists = previous.some(
        (subscription) =>
          subscription.name.toLowerCase() ===
          item.name.toLowerCase()
      );

      if (exists) {
        return previous;
      }

      return [
        {
          ...item,
          detection: undefined,
          source:
            "Imported transaction data",
        },
        ...previous,
      ];
    });

    setDetected((previous) =>
      previous.filter(
        (candidate) =>
          candidate.id !== item.id
      )
    );
  };

  const ignoreDetected = (id) => {
    setDetected((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  // -------------------------------------------------------
  // JSON import
  // -------------------------------------------------------

  const handleJSONImport = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(
          e.target.result
        );

        if (!Array.isArray(imported)) {
          throw new Error();
        }

        setSubscriptions(imported);

        alert(
          `${imported.length} subscriptions imported.`
        );
      } catch {
        alert(
          "Invalid SubscriptionOS JSON file."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  // -------------------------------------------------------
  // Logout
  // -------------------------------------------------------

  const logout = () => {
    localStorage.removeItem(
      "subscriptionos_user"
    );

    sessionStorage.clear();

    setAuthUser(null);
    setOnboardingComplete(false);
    setSubscriptions([]);
    setPage("overview");

    localStorage.removeItem(
      "subscriptionos_onboarding_complete"
    );
  };

  // -------------------------------------------------------
  // Auth
  // -------------------------------------------------------

  if (!authUser) {
    return (
      <AuthScreen
        onLogin={(user) =>
          setAuthUser(user)
        }
      />
    );
  }

  if (!onboardingComplete) {
    return (
      <OnboardingScreen
        user={authUser}
        onDiscover={handleDiscover}
        onManual={handleManual}
      />
    );
  }

  // -------------------------------------------------------
  // Discovery
  // -------------------------------------------------------

  if (page === "discovery") {
    return (
      <div className="app-shell">
        <Sidebar
          page={page}
          setPage={setPage}
          onAdd={openAdd}
        />

        <main className="main">
          <Topbar
            search={search}
            setSearch={setSearch}
            theme={theme}
            setTheme={setTheme}
          />

          <DiscoveryPage
            detected={detected}
            onConfirm={confirmDetected}
            onIgnore={ignoreDetected}
            onBack={() =>
              setPage("overview")
            }
            onFile={handleDiscoveryFile}
          />
        </main>
      </div>
    );
  }

  // -------------------------------------------------------
  // Subscriptions
  // -------------------------------------------------------

  const renderSubscriptions = () => (
    <div className="page-container">
      <SectionHeader
        eyebrow="MANAGEMENT"
        title="Subscriptions"
        description={
          subscriptions.length
            ? `${subscriptions.length} subscription${
                subscriptions.length === 1
                  ? ""
                  : "s"
              } in your workspace.`
            : "Your workspace is empty. Add or discover a subscription."
        }
        action={
          <button
            className="primary-button"
            onClick={openAdd}
          >
            <Plus size={17} />
            Add subscription
          </button>
        }
      />

      <div className="management-toolbar">
        <div className="filter-group">
          <Filter size={16} />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <select
          className="sort-select"
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="renewal">
            Sort: Renewal
          </option>

          <option value="price-high">
            Price: High → Low
          </option>

          <option value="price-low">
            Price: Low → High
          </option>

          <option value="name">
            Name A → Z
          </option>
        </select>

        <div className="toolbar-actions">
          <button
            className="secondary-button"
            onClick={() =>
              exportSubscriptions(
                subscriptions
              )
            }
          >
            <Download size={16} />
            Export
          </button>

          <label className="secondary-button upload-button">
            <Upload size={16} />
            Import JSON

            <input
              type="file"
              accept=".json"
              onChange={handleJSONImport}
            />
          </label>
        </div>
      </div>

      <div className="management-summary">
        <div>
          <span>Monthly commitment</span>

          <strong>
            ₹{Math.round(stats.monthly)}
          </strong>
        </div>

        <div>
          <span>Yearly commitment</span>

          <strong>
            ₹{Math.round(stats.yearly)}
          </strong>
        </div>

        <div>
          <span>Active services</span>

          <strong>{stats.active}</strong>
        </div>

        <div>
          <span>Renewing soon</span>

          <strong>{stats.upcoming}</strong>
        </div>

        <div className="budget-edit">
          <span>Monthly budget</span>

          <input
            type="number"
            value={budget}
            onChange={(e) =>
              setBudget(
                Number(e.target.value)
              )
            }
          />
        </div>
      </div>

      <div className="subscription-list large-list">
        {filtered.length ? (
          filtered.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={
                subscription
              }
              onDelete={
                deleteSubscription
              }
              onEdit={openEdit}
            />
          ))
        ) : (
          <EmptyState
            onAdd={openAdd}
          />
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------
  // Analytics
  // -------------------------------------------------------

  const renderAnalytics = () => {
    const categoryTotals = {};

    subscriptions.forEach((item) => {
      const categoryName =
        item.category || "Other";

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] ||
          0) +
        Number(
          item.price || 0
        );
    });

    return (
      <div className="page-container">
        <SectionHeader
          eyebrow="ANALYTICS"
          title="Financial intelligence"
          description="Understand the recurring cost of your digital life."
        />

        <div className="analytics-hero">
          <div>
            <span>
              Total annual commitment
            </span>

            <strong>
              ₹
              {Math.round(
                stats.yearly
              ).toLocaleString("en-IN")}
            </strong>

            <p>
              Approximately ₹
              {Math.round(
                stats.monthly
              ).toLocaleString("en-IN")}
              per month.
            </p>
          </div>

          <div className="analytics-orb">
            ₹
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-box">
            <span>
              Average subscription
            </span>

            <strong>
              ₹
              {subscriptions.length
                ? Math.round(
                    stats.monthly /
                      subscriptions.length
                  ).toLocaleString(
                    "en-IN"
                  )
                : 0}
            </strong>
          </div>

          <div className="analytics-box">
            <span>
              Services tracked
            </span>

            <strong>
              {subscriptions.length}
            </strong>
          </div>

          <div className="analytics-box">
            <span>
              Budget utilization
            </span>

            <strong>
              {budget
                ? Math.round(
                    (stats.monthly /
                      budget) *
                      100
                  )
                : 0}
              %
            </strong>
          </div>
        </div>

        <div className="analytics-category-list">
          {Object.entries(
            categoryTotals
          ).map(([name, amount]) => (
            <div
              key={name}
              className="analytics-category"
            >
              <span>{name}</span>

              <strong>
                ₹
                {Math.round(
                  amount
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------
  // Calendar
  // -------------------------------------------------------

  const renderCalendar = () => {
    const sorted = [
      ...subscriptions,
    ].sort(
      (a, b) =>
        new Date(a.renewal) -
        new Date(b.renewal)
    );

    return (
      <div className="page-container">
        <SectionHeader
          eyebrow="RENEWALS"
          title="Renewal calendar"
          description="Never be surprised by another recurring charge."
        />

        {sorted.length ? (
          <div className="calendar-list">
            {sorted.map((item) => {
              const date = new Date(
                item.renewal
              );

              return (
                <div
                  className="calendar-item"
                  key={item.id}
                >
                  <div className="calendar-date">
                    <strong>
                      {date.toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                        }
                      )}
                    </strong>

                    <span>
                      {date.toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                        }
                      )}
                    </span>
                  </div>

                  <div
                    className="service-logo"
                    style={{
                      background:
                        item.color ||
                        "#635BFF",
                    }}
                  >
                    {item.icon ||
                      item.name
                        ?.charAt(0)
                        .toUpperCase()}
                  </div>

                  <div className="calendar-info">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.category}
                    </span>
                  </div>

                  <div className="calendar-price">
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="renew-button"
                    >
                      Renew
                    </a>
                  ) : (
                    <span className="renew-button disabled">
                      No link
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            onAdd={openAdd}
          />
        )}
      </div>
    );
  };

  // -------------------------------------------------------
  // Main application
  // -------------------------------------------------------

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        onAdd={openAdd}
      />

      <main className="main">
        <Topbar
          search={search}
          setSearch={setSearch}
          theme={theme}
          setTheme={setTheme}
        />

        {page === "overview" && (
          <Dashboard
            subscriptions={
              subscriptions
            }
            budget={budget}
            onAdd={openAdd}
            onDelete={
              deleteSubscription
            }
            onEdit={openEdit}
            setPage={setPage}
          />
        )}

        {page === "subscriptions" &&
          renderSubscriptions()}

        {page === "analytics" &&
          renderAnalytics()}

        {page === "calendar" &&
          renderCalendar()}

        {page === "ai" && (
          <AI
            subscriptions={
              subscriptions
            }
          />
        )}
      </main>

      {modal && (
        <AddSubscriptionModal
          editing={editing}
          form={form}
          setForm={setForm}
          onClose={() =>
            setModal(false)
          }
          onSave={saveSubscription}
        />
      )}
    </div>
  );
}