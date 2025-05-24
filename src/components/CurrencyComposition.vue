<template>
  <!-- Main container for the currency converter application -->
  <div class="mainContainer">
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
        <!-- Bound to `amount` reactive ref with numeric parsing -->
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

<script setup>
// Import Composition API utilities
import {ref, onMounted, onBeforeUnmount} from 'vue';

// Reactive state variables
const loading = ref(true);            // Tracks fetch status
const currencies = ref([]);           // Holds currency data
const amount = ref(100);              // User input in XPF
const lastUpdated = ref('');          // Timestamp of last update
const isLightTheme = ref(false);      // Theme toggle state
let intervalId = null;                // Interval reference

// Function to fetch latest exchange rates from API
async function fetchRates() {
  try {
    const response = await fetch('https://v6.exchangerate-api.com/v6/ceb3e48ff7d6b698944a5eb2/latest/XPF');
    const data = await response.json();

    // Ensure conversion data exists
    if (!data.conversion_rates) {
      console.error('Conversion rates not found:', data);
      loading.value = false;
      return;
    }

    // Label definitions for currencies
    const currencyLabels = {
      AUD: {en: 'Australian Dollar', fr: 'Dollar australien', countryCode: 'AU'},
      NZD: {en: 'New Zealand Dollar', fr: 'Dollar néo-zélandais', countryCode: 'NZ'},
      CAD: {en: 'Canadian Dollar', fr: 'Dollar canadien', countryCode: 'CA'},
      SGD: {en: 'Singapore Dollar', fr: 'Dollar singapourien', countryCode: 'SG'},
      CHF: {en: 'Swiss Franc', fr: 'Franc suisse', countryCode: 'CH'},
      THB: {en: 'Thai Baht', fr: 'Baht thaïlandais', countryCode: 'TH'},
      EUR: {en: 'Euro', fr: 'Euro', countryCode: 'EU'},
      USD: {en: 'US Dollar', fr: 'Dollar américain', countryCode: 'US'},
      FJD: {en: 'Fijian Dollar', fr: 'Dollar fidjien', countryCode: 'FJ'},
      VUV: {en: 'Vanuatu Vatu', fr: 'Vatu vanuatuan', countryCode: 'VU'},
      GBP: {en: 'Pound Sterling', fr: 'Livre sterling', countryCode: 'GB'},
      JPY: {en: 'Japanese Yen', fr: 'Yen japonais', countryCode: 'JP'},
    };

    // Transform API response into renderable format
    currencies.value = Object.entries(currencyLabels).map(([code, labels]) => {
      const countryCode = labels.countryCode.toLowerCase() || 'xx';
      return {
        code,
        name_en: labels.en,
        name_fr: labels.fr,
        rate: data.conversion_rates[code] || 0,
        flagUrl: `https://flagcdn.com/h40/${countryCode}.png`,
      };
    });

    // Update timestamp and loading state
    lastUpdated.value = new Date().toLocaleString('fr-FR');
    loading.value = false;
  } catch (error) {
    console.error('Error while loading JSON data:', error);
    loading.value = false;
  }
}

// Function to toggle between light and dark theme on <body>
function toggleTheme() {
  isLightTheme.value = !isLightTheme.value;
  document.body.classList.toggle('lightBody', isLightTheme.value);
  document.body.classList.toggle('darkBody', !isLightTheme.value);
}

// Lifecycle hook: runs after component is mounted
onMounted(() => {
  // Default to dark theme
  document.body.classList.add('darkBody');

  // Initial data fetch
  fetchRates();

  // Schedule hourly updates
  intervalId = setInterval(fetchRates, 3600000);
});

// Cleanup hook: clear the update interval
onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>
