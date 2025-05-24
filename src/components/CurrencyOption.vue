<template>
  <!-- Main container for the currency converter application -->
  <div id="mainContainer1" class="mainContainer" :class="[isLightTheme ? 'lightBody' : 'darkBody']">
    <!-- Title, description and theme toggle section -->
    <div class="titles">
      <!-- Application title in French -->
      <h1>Bureau de change</h1>
      <!-- English subtitle -->
      <p>Exchange office</p>
      <!-- Button to switch between light and dark modes -->
      <button @click="toggleTheme" class="themeToggle">
        {{ isLightTheme ? '🌙' : '☀️' }}
      </button>

      <!-- Input field for entering amount in XPF -->
      <div class="amountToConvert">
        <!-- Bound to `amount` data property with numeric parsing -->
        <input
            type="number"
            v-model.number="amount"
            min="0"
            placeholder="Montant en XPF"
        />
        <!-- Currency label -->
        <span>XPF</span>
      </div>

      <!-- Displays timestamp of last successful data fetch -->
      <p class="updated">Dernière mise à jour : {{ lastUpdated }}</p>
    </div>

    <!-- Show while data is being fetched -->
    <div v-if="loading">Loading...</div>

    <!-- Once data is ready, render currency cards -->
    <div v-else>
      <div class="currenciesList">
        <!-- Loop through each currency entry -->
        <div
            v-for="(entry, index) in currencies"
            :key="index"
            :class="[isLightTheme ? 'lightCard' : 'darkCard']"
        >
          <!-- Display country flag based on currency code -->
          <img :src="entry.flagUrl" :alt="entry.code"/>

          <!-- Show currency names in French and English -->
          <div class="countryCurrency">
            <p>{{ entry.name_fr }}</p>
            <p>{{ entry.name_en }}</p>
          </div>

          <!-- Calculate and display converted amount -->
          <p>{{ (amount * entry.rate).toFixed(2) }} {{ entry.code }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue component for option-based currency conversion
export default {
  name: 'DevisesOption',
  data() {
    return {
      // Indicates whether API data is being loaded
      loading: true,
      // Stores currency info and conversion rates
      currencies: [],
      // User-entered amount in XPF by default
      amount: 100,
      // Records the last fetched timestamp
      lastUpdated: '',
      // Identifier for the update interval
      intervalId: null,
      // Tracks whether light theme is active
      isLightTheme: false,
    };
  },
  mounted() {
    // Apply dark theme by default on component mount
    document.getElementById("mainContainer1").classList.add('darkBody');
    // Fetch rates immediately
    this.fetchRates();
    // Schedule hourly updates for rates
    this.intervalId = setInterval(() => {
      this.fetchRates();
    }, 3600000);
  },
  beforeUnmount() {
    // Clean up the interval when component is destroyed
    clearInterval(this.intervalId);
  },
  methods: {
    // Retrieves latest exchange rates from external API
    fetchRates() {
      fetch('https://v6.exchangerate-api.com/v6/ceb3e48ff7d6b698944a5eb2/latest/XPF')
          .then(res => res.json())
          .then(data => {
            // Verify response contains conversion rates
            if (!data.conversion_rates) {
              console.error('Conversion rates not found:', data);
              this.loading = false;
              return;
            }

            // Map of currency codes to display labels and flag codes
            const currencyLabels = {
              AUD: {en: "Australian Dollar", fr: "Dollar australien", countryCode: "AU"},
              NZD: {en: "New Zealand Dollar", fr: "Dollar néo-zélandais", countryCode: "NZ"},
              CAD: {en: "Canadian Dollar", fr: "Dollar canadien", countryCode: "CA"},
              SGD: {en: "Singapore Dollar", fr: "Dollar singapourien", countryCode: "SG"},
              CHF: {en: "Swiss Franc", fr: "Franc suisse", countryCode: "CH"},
              THB: {en: "Thai Baht", fr: "Baht thaïlandais", countryCode: "TH"},
              EUR: {en: "Euro", fr: "Euro", countryCode: "EU"},
              USD: {en: "US Dollar", fr: "Dollar américain", countryCode: "US"},
              FJD: {en: "Fijian Dollar", fr: "Dollar fidjien", countryCode: "FJ"},
              VUV: {en: "Vanuatu Vatu", fr: "Vatu vanuatuan", countryCode: "VU"},
              GBP: {en: "Pound Sterling", fr: "Livre sterling", countryCode: "GB"},
              JPY: {en: "Japanese Yen", fr: "Yen japonais", countryCode: "JP"},
            };

            // Convert API data into an array of objects for rendering
            this.currencies = Object.entries(currencyLabels).map(([code, labels]) => {
              const countryCode = labels.countryCode.toLowerCase() || 'xx';
              return {
                code,
                name_en: labels.en,
                name_fr: labels.fr,
                rate: data.conversion_rates[code] || 0,
                flagUrl: `https://flagcdn.com/h40/${countryCode}.png`,
              };
            });

            // Update the timestamp to reflect new data
            this.lastUpdated = new Date().toLocaleString('fr-FR');
            // Disable loading indicator
            this.loading = false;
          })
          .catch(error => {
            console.error('Error while loading JSON data:', error);
            // Disable loading indicator on error
            this.loading = false;
          });
    },
    // Toggles between light and dark theme classes on <body>
    toggleTheme() {
      this.isLightTheme = !this.isLightTheme;
    },
  },
};
</script>

<style>
/* ===== Global Styles ===== */
body {
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  margin: 0;
}

/* Theme background animations */
.darkBody {
  background: linear-gradient(-45deg, #012030, #13678A, #45C4B0, #9AEBA3);
  background-size: 400% 400%;
  animation: gradientBackground 20s ease-in-out infinite;
}

.lightBody {
  background: linear-gradient(-45deg, #fefcea, #f1daff, #cfe8ff, #e4fff8);
  background-size: 400% 400%;
  animation: gradientBackground 20s ease-in-out infinite;
}

/* Force text color based on theme */
body.darkBody > * {
  color: #ffffff !important;
}

body.lightBody > * {
  color: #000000 !important;
}

/* ===== Theme Toggle Button ===== */
.themeToggle {
  background: transparent;
  border: 2px solid #fff;
  border-radius: 50px;
  font-size: 1.5rem;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

body.lightBody .themeToggle {
  border-color: #000;
  color: #000;
}

.themeToggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* ===== Layout Containers ===== */
.mainContainer {
  width: 100%;
  margin: auto;
}

.titles {
  text-align: center;
  margin-bottom: 30px;
}

/* ===== Headings ===== */
.titles h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.titles p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

/* ===== Amount Input Section ===== */
.amountToConvert {
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-right: 20px;
}

.amountToConvert input {
  padding: 12px 20px;
  font-size: 1.2rem;
  border-radius: 12px;
  border: none;
  outline: none;
  width: 150px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}

/* ===== Currency Cards ===== */
.currenciesList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 20px;
  gap: 20px;
}

.currenciesList > div {
  display: flex;
  align-items: center;
  background-size: 400% 400%;
  background-position: 0% 50%;
  animation: cardGradient 20s ease-in-out infinite, fadeInUp 0.6s forwards;
  border-radius: 16px;
  padding: 24px;
  width: 45%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.darkCard {
  background: linear-gradient(-45deg, #9AEBA3, #45C4B0, #13678A, #012030);
  color: #ffffff;
}

.lightCard {
  background: linear-gradient(-45deg, #e4fff8, #cfe8ff, #f1daff, #fefcea);
  color: #000000;
}

.currenciesList > div:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
}

/* ===== Flag Images ===== */
.currenciesList img {
  width: 55px;
  height: 38px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  margin-right: 15px;
}

/* ===== Currency Name Text ===== */
.currenciesList .countryCurrency {
  flex: 1;
}

.currenciesList .countryCurrency p:first-child {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
}

.currenciesList .countryCurrency p:last-child {
  font-size: 0.95rem;
  margin: 2px 0 0 0;
}

.currenciesList > div > p:last-child {
  font-size: 1.3rem;
  font-weight: bold;
  margin-left: auto;
  white-space: nowrap;
}

/* ===== Animations ===== */
@keyframes gradientBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes cardGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Responsive Design ===== */
@media (max-width: 1024px) {
  .currenciesList > div {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .titles h1 {
    font-size: 2rem;
  }

  .amountToConvert input {
    width: 130px;
    font-size: 1rem;
  }

  .currenciesList > div {
    flex-direction: column;
    align-items: flex-start;
  }

  .currenciesList > div > p:last-child {
    align-self: flex-end;
    text-align: right;
    width: 100%;
    margin-top: 10px;
  }

  .currenciesList img {
    margin-bottom: 10px;
    margin-right: 0;
  }
}
</style>
