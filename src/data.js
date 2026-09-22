export const services = [
  {
    id: "netflix",
    name: "Netflix",
    category: "Entertainment",
    color: "#E50914",
    icon: "N",
    url: "https://www.netflix.com/",
    plans: [
      {
        id: "netflix-mobile",
        name: "Mobile",
        price: 149,
        billing: "Monthly",
        details: [
          "Mobile & tablet viewing",
          "SD video quality",
          "1 supported device",
          "Download available"
        ]
      },
      {
        id: "netflix-basic",
        name: "Basic",
        price: 199,
        billing: "Monthly",
        details: [
          "TV, computer, mobile & tablet",
          "HD video quality",
          "1 supported device",
          "Download available"
        ]
      },
      {
        id: "netflix-standard",
        name: "Standard",
        price: 499,
        billing: "Monthly",
        details: [
          "Full HD video quality",
          "2 supported devices",
          "Download available",
          "TV, computer, mobile & tablet"
        ]
      },
      {
        id: "netflix-premium",
        name: "Premium",
        price: 649,
        billing: "Monthly",
        details: [
          "Ultra HD / 4K where available",
          "4 supported devices",
          "Download available",
          "TV, computer, mobile & tablet"
        ]
      }
    ]
  },

  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "Entertainment",
    color: "#FF0000",
    icon: "▶",
    url: "https://www.youtube.com/premium",
    plans: [
      {
        id: "youtube-individual",
        name: "Individual",
        price: 149,
        billing: "Monthly",
        details: [
          "YouTube without ads",
          "YouTube Music Premium",
          "Background play",
          "Offline downloads"
        ]
      },
      {
        id: "youtube-student",
        name: "Student",
        price: 89,
        billing: "Monthly",
        details: [
          "YouTube without ads",
          "YouTube Music Premium",
          "Background play",
          "Student eligibility required"
        ]
      },
      {
        id: "youtube-family",
        name: "Family",
        price: 299,
        billing: "Monthly",
        details: [
          "YouTube without ads",
          "YouTube Music Premium",
          "Background play",
          "Share with eligible family members"
        ]
      }
    ]
  },

  {
    id: "amazon-prime",
    name: "Amazon Prime",
    category: "Shopping & Entertainment",
    color: "#00A8E1",
    icon: "P",
    url: "https://www.amazon.in/prime",
    plans: [
      {
        id: "prime-monthly",
        name: "Monthly",
        price: 299,
        billing: "Monthly",
        details: [
          "Prime Video",
          "Prime Music",
          "Free / faster delivery benefits",
          "Prime member offers"
        ]
      },
      {
        id: "prime-quarterly",
        name: "Quarterly",
        price: 599,
        billing: "Quarterly",
        details: [
          "Prime Video",
          "Prime Music",
          "Delivery benefits",
          "Prime member offers"
        ]
      },
      {
        id: "prime-yearly",
        name: "Annual",
        price: 1499,
        billing: "Yearly",
        details: [
          "Prime Video",
          "Prime Music",
          "Delivery benefits",
          "Prime member offers"
        ]
      }
    ]
  },

  {
    id: "spotify",
    name: "Spotify",
    category: "Music",
    color: "#1DB954",
    icon: "S",
    url: "https://www.spotify.com/in-en/premium/",
    plans: [
      {
        id: "spotify-individual",
        name: "Individual",
        price: 139,
        billing: "Monthly",
        details: [
          "Ad-free music",
          "Offline listening",
          "On-demand playback",
          "Unlimited skips"
        ]
      },
      {
        id: "spotify-student",
        name: "Student",
        price: 69,
        billing: "Monthly",
        details: [
          "Ad-free music",
          "Offline listening",
          "On-demand playback",
          "Eligible students only"
        ]
      },
      {
        id: "spotify-duo",
        name: "Duo",
        price: 179,
        billing: "Monthly",
        details: [
          "Two Premium accounts",
          "Ad-free music",
          "Offline listening",
          "Separate accounts"
        ]
      },
      {
        id: "spotify-family",
        name: "Family",
        price: 229,
        billing: "Monthly",
        details: [
          "Multiple Premium accounts",
          "Ad-free music",
          "Offline listening",
          "Separate accounts"
        ]
      }
    ]
  },

  {
    id: "jiohotstar",
    name: "JioHotstar",
    category: "Entertainment",
    color: "#172B85",
    icon: "J",
    url: "https://www.hotstar.com/in/",
    plans: [
      {
        id: "jiohotstar-mobile",
        name: "Mobile",
        price: 149,
        billing: "Monthly",
        details: [
          "Mobile-focused viewing",
          "Entertainment & sports",
          "Single mobile device",
          "Ad-supported content may apply"
        ]
      },
      {
        id: "jiohotstar-super",
        name: "Super",
        price: 299,
        billing: "Monthly",
        details: [
          "Multiple device access",
          "Entertainment & sports",
          "TV access",
          "Higher device flexibility"
        ]
      },
      {
        id: "jiohotstar-premium",
        name: "Premium",
        price: 349,
        billing: "Monthly",
        details: [
          "Premium content",
          "Multiple device access",
          "Entertainment & sports",
          "Higher quality where available"
        ]
      }
    ]
  },

  {
    id: "sonyliv",
    name: "SonyLIV",
    category: "Entertainment",
    color: "#171717",
    icon: "S",
    url: "https://www.sonyliv.com/",
    plans: [
      {
        id: "sonyliv-monthly",
        name: "Premium Monthly",
        price: 299,
        billing: "Monthly",
        details: [
          "Premium entertainment",
          "Sports content",
          "Sony network shows",
          "Multiple supported devices"
        ]
      },
      {
        id: "sonyliv-yearly",
        name: "Premium Annual",
        price: 1499,
        billing: "Yearly",
        details: [
          "Premium entertainment",
          "Sports content",
          "Sony network shows",
          "Multiple supported devices"
        ]
      }
    ]
  },

  {
    id: "zee5",
    name: "ZEE5",
    category: "Entertainment",
    color: "#7B2CBF",
    icon: "Z",
    url: "https://www.zee5.com/",
    plans: [
      {
        id: "zee5-monthly",
        name: "Premium Monthly",
        price: 199,
        billing: "Monthly",
        details: [
          "Movies & series",
          "Originals",
          "Regional content",
          "Multiple supported devices"
        ]
      },
      {
        id: "zee5-yearly",
        name: "Premium Annual",
        price: 699,
        billing: "Yearly",
        details: [
          "Movies & series",
          "Originals",
          "Regional content",
          "Long-term subscription"
        ]
      }
    ]
  },

  {
    id: "apple-tv",
    name: "Apple TV+",
    category: "Entertainment",
    color: "#000000",
    icon: "",
    url: "https://tv.apple.com/in/",
    plans: [
      {
        id: "apple-tv-monthly",
        name: "Apple TV+",
        price: 99,
        billing: "Monthly",
        details: [
          "Apple Originals",
          "Ad-free viewing",
          "Watch on supported devices",
          "Family Sharing support"
        ]
      }
    ]
  },

  {
    id: "aha",
    name: "aha",
    category: "Regional Entertainment",
    color: "#F4A300",
    icon: "a",
    url: "https://www.aha.video/",
    plans: [
      {
        id: "aha-monthly",
        name: "Premium Monthly",
        price: 149,
        billing: "Monthly",
        details: [
          "Telugu entertainment",
          "Originals",
          "Movies & series",
          "Supported-device streaming"
        ]
      },
      {
        id: "aha-yearly",
        name: "Premium Annual",
        price: 699,
        billing: "Yearly",
        details: [
          "Telugu entertainment",
          "Originals",
          "Movies & series",
          "Annual access"
        ]
      }
    ]
  },

  {
    id: "sun-nxt",
    name: "Sun NXT",
    category: "Regional Entertainment",
    color: "#F57C00",
    icon: "SUN",
    url: "https://www.sunnxt.com/",
    plans: [
      {
        id: "sunnxt-monthly",
        name: "Monthly",
        price: 69,
        billing: "Monthly",
        details: [
          "South Indian movies",
          "TV shows",
          "Multiple Indian languages",
          "Supported-device streaming"
        ]
      },
      {
        id: "sunnxt-yearly",
        name: "Annual",
        price: 399,
        billing: "Yearly",
        details: [
          "South Indian movies",
          "TV shows",
          "Multiple Indian languages",
          "Annual access"
        ]
      }
    ]
  }
];

export const categories = [
  "All",
  "Entertainment",
  "Music",
  "Shopping & Entertainment",
  "Regional Entertainment"
];

export const initialBudget = 5000;