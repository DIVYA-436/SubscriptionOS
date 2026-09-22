// =========================================================
// SUBSCRIPTIONOS UTILITIES
// =========================================================

export function monthlyEquivalent(subscription) {
  const price = Number(subscription?.price) || 0;

  if (subscription?.billing === "Yearly") {
    return price / 12;
  }

  if (subscription?.billing === "Quarterly") {
    return price / 3;
  }

  return price;
}

export function calculateStats(subscriptions = []) {
  const activeSubscriptions = subscriptions.filter(
    (item) => item.active !== false
  );

  const monthly = activeSubscriptions.reduce(
    (total, item) => total + monthlyEquivalent(item),
    0
  );

  const yearly = monthly * 12;

  const now = new Date();

  const upcoming = activeSubscriptions.filter((item) => {
    if (!item.renewal) return false;

    const renewal = new Date(item.renewal);

    const difference =
      (renewal - now) / (1000 * 60 * 60 * 24);

    return difference >= 0 && difference <= 30;
  }).length;

  return {
    monthly,
    yearly,
    active: activeSubscriptions.length,
    upcoming,
  };
}

export function getRenewalLabel(dateString) {
  if (!dateString) return "No renewal date";

  const renewal = new Date(dateString);
  const now = new Date();

  const days = Math.ceil(
    (renewal - now) / (1000 * 60 * 60 * 24)
  );

  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 30) return `In ${days} days`;

  return renewal.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(value) {
  return `₹${Math.round(Number(value) || 0).toLocaleString(
    "en-IN"
  )}`;
}

// =========================================================
// DASHBOARD HELPERS
// =========================================================

export function daysUntil(dateString) {
  if (!dateString) return null;

  const now = new Date();
  const date = new Date(dateString);

  return Math.ceil(
    (date - now) / (1000 * 60 * 60 * 24)
  );
}

export function categoryData(subscriptions = []) {
  const totals = {};

  subscriptions.forEach((subscription) => {
    const category = subscription.category || "Other";

    totals[category] =
      (totals[category] || 0) +
      monthlyEquivalent(subscription);
  });

  return Object.entries(totals).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));
}

// =========================================================
// USER-SPECIFIC STORAGE
// =========================================================

function getUserKey() {
  try {
    const user = JSON.parse(
      localStorage.getItem("subscriptionos_user") || "null"
    );

    return (
      user?.uid ||
      user?.email ||
      user?.phone ||
      "local-user"
    );
  } catch {
    return "local-user";
  }
}

export function loadSubscriptions(fallback = []) {
  try {
    const key = `subscriptionos_subscriptions_${getUserKey()}`;

    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveSubscriptions(subscriptions) {
  try {
    const key = `subscriptionos_subscriptions_${getUserKey()}`;

    localStorage.setItem(
      key,
      JSON.stringify(subscriptions)
    );
  } catch (error) {
    console.error(
      "Could not save subscriptions:",
      error
    );
  }
}

// =========================================================
// EXPORT
// =========================================================

export function exportSubscriptions(subscriptions) {
  const blob = new Blob(
    [JSON.stringify(subscriptions, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "subscriptionos-data.json";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

// =========================================================
// TRANSACTION IMPORT
// =========================================================

function normalizeMerchant(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseAmount(value) {
  if (typeof value === "number") return value;

  const cleaned = String(value || "")
    .replace(/[₹$,\s]/g, "");

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

function parseDate(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function differenceInDays(first, second) {
  return Math.abs(
    (first - second) / (1000 * 60 * 60 * 24)
  );
}

function isRecurringPattern(transactions) {
  if (transactions.length < 2) {
    return false;
  }

  const sorted = [...transactions].sort(
    (a, b) => a.date - b.date
  );

  const intervals = [];

  for (let i = 1; i < sorted.length; i++) {
    intervals.push(
      differenceInDays(
        sorted[i].date,
        sorted[i - 1].date
      )
    );
  }

  const average =
    intervals.reduce((a, b) => a + b, 0) /
    intervals.length;

  return average >= 20 && average <= 100;
}

export function detectRecurringPayments(transactions) {
  const groups = new Map();

  for (const transaction of transactions) {
    const merchantKey = normalizeMerchant(
      transaction.merchant
    );

    if (!merchantKey) continue;

    if (!groups.has(merchantKey)) {
      groups.set(merchantKey, []);
    }

    groups.get(merchantKey).push(transaction);
  }

  const detected = [];

  for (const [merchantKey, items] of groups) {
    if (items.length < 2) continue;

    const valid = items
      .map((item) => ({
        merchant: item.merchant,
        amount: parseAmount(item.amount),
        date: parseDate(item.date),
      }))
      .filter(
        (item) =>
          item.amount > 0 &&
          item.date
      );

    if (valid.length < 2) continue;

    if (!isRecurringPattern(valid)) continue;

    const averageAmount =
      valid.reduce(
        (total, item) => total + item.amount,
        0
      ) / valid.length;

    const latest = [...valid].sort(
      (a, b) => b.date - a.date
    )[0];

    let frequency = "Recurring";

    if (valid.length >= 2) {
      const sorted = [...valid].sort(
        (a, b) => a.date - b.date
      );

      const averageDays =
        sorted.slice(1).reduce(
          (total, item, index) =>
            total +
            differenceInDays(
              item.date,
              sorted[index].date
            ),
          0
        ) /
        (sorted.length - 1);

      if (
        averageDays >= 20 &&
        averageDays <= 45
      ) {
        frequency = "Monthly";
      } else if (
        averageDays > 45 &&
        averageDays <= 100
      ) {
        frequency = "Recurring";
      }
    }

    const confidence =
      valid.length >= 3 ? "High" : "Medium";

    detected.push({
      id: `detected-${merchantKey}-${Date.now()}`,
      name: latest.merchant,
      category: "Other",
      price: Math.round(averageAmount),
      billing:
        frequency === "Monthly"
          ? "Monthly"
          : "Recurring",
      renewal: latest.date
        .toISOString()
        .slice(0, 10),
      color: "#635BFF",
      icon: latest.merchant
        .charAt(0)
        .toUpperCase(),
      url: "",
      active: true,

      detection: {
        confidence,
        transactions: valid.length,
        source: "Imported transaction data",
      },
    });
  }

  return detected;
}

// =========================================================
// CSV PARSER
// =========================================================

export function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error(
      "The CSV file must contain a header and at least one transaction."
    );
  }

  const headers = lines[0]
    .split(",")
    .map((header) =>
      header.trim().toLowerCase()
    );

  const dateIndex = headers.findIndex(
    (header) =>
      header === "date" ||
      header === "transaction_date"
  );

  const merchantIndex = headers.findIndex(
    (header) =>
      header === "merchant" ||
      header === "description" ||
      header === "name"
  );

  const amountIndex = headers.findIndex(
    (header) =>
      header === "amount" ||
      header === "price" ||
      header === "value"
  );

  if (
    dateIndex === -1 ||
    merchantIndex === -1 ||
    amountIndex === -1
  ) {
    throw new Error(
      "CSV must contain date, merchant and amount columns."
    );
  }

  return lines.slice(1).map((line) => {
    const columns = line.split(",");

    return {
      date: columns[dateIndex]?.trim(),
      merchant: columns[merchantIndex]?.trim(),
      amount: columns[amountIndex]?.trim(),
    };
  });
}