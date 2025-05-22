<template>
  <div class="mainContainer">
    <!-- Title and input section -->
    <div class="titles">
      <h1>Bureau de change</h1>
      <p>Exchange office</p>

      <!-- Input to enter amount in XPF -->
      <div class="amountToConvert">
        <input type="number" v-model.number="amount" min="0" placeholder="Montant en XPF"/>
        <span>XPF</span>
      </div>
    </div>

    <!-- Display loading message while data is being fetched -->
    <div v-if="loading">Loading...</div>

    <!-- Display the currency cards once data is loaded -->
    <div v-else>
      <div class="currenciesList">
        <!-- Loop through all currencies to display their info -->
        <div v-for="(entry, index) in currencies" :key="index">
          <!-- Country flag -->
          <img :src="entry.flagUrl" :alt="entry.code"/>

          <!-- Currency name in French and English -->
          <div class="countryCurrency">
            <p>{{ entry.name_fr }}</p>
            <p>{{ entry.name_en }}</p>
          </div>

          <!-- Converted amount + currency code -->
          <p>{{ (amount * entry.rate).toFixed(2) }} {{ entry.code }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import Vue Composition API functions
import {ref, onMounted} from 'vue'

// Reactive state
const loading = ref(true)
const currencies = ref([])
const amount = ref(100) // Default input value in XPF

// Labels and ISO codes for each currency to display
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
  JPY: {en: "Japanese Yen", fr: "Yen japonais", countryCode: "JP"}
}

// Fetch exchange rates when component mounts
onMounted(async () => {
  try {
    const response = await fetch("https://v6.exchangerate-api.com/v6/ceb3e48ff7d6b698944a5eb2/latest/XPF")
    const data = await response.json()

    if (!data.conversion_rates) {
      console.error('Conversion rates not found:', data)
      loading.value = false
      return
    }

    // Construct the currency list from configured labels
    currencies.value = Object.entries(currencyLabels).map(([code, labels]) => {
      const countryCode = labels.countryCode?.toLowerCase() || "xx"

      return {
        code,
        name_en: labels.en,
        name_fr: labels.fr,
        rate: data.conversion_rates[code] ?? 0,
        flagUrl: `https://flagcdn.com/h40/${countryCode}.png`
      }
    })
  } catch (error) {
    console.error("Error while loading JSON data:", error)
  } finally {
    loading.value = false
  }
})
</script>
