<template>
  <div class="container mt-5">
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


<style>
/* Global page background with animated gradient */
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(-45deg, #012030, #13678A, #45C4B0, #9AEBA3);
  background-size: 400% 400%;
  animation: gradientBackground 20s ease-in-out infinite;
  min-height: 100vh;
  margin: 0;
}

/* Container for central content alignment */
.container {
  max-width: 1200px;
  margin: auto;
}

/* Title section styling */
.titles {
  text-align: center;
  margin-bottom: 30px;
}

.titles h1 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.titles p {
  color: #dddddd;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

/* Currency input wrapper */
.amountToConvert {
  display: flex;
  flex-direction: column;
  align-items: end;
}

/* Currency input field styling */
.amountToConvert input {
  padding: 12px 20px;
  font-size: 1.2rem;
  border-radius: 10px;
  border: none;
  outline: none;
  width: 150px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}

/* XPF label */
.amountToConvert span {
  color: #fff;
}

/* Currency card container layout: 2 columns */
.currenciesList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

/* Individual currency card with animated background */
.currenciesList > div {
  display: flex;
  align-items: center;
  background: linear-gradient(-45deg, #9AEBA3, #45C4B0, #13678A, #012030);
  background-size: 400% 400%;
  animation: cardGradient 20s ease-in-out infinite;
  color: #fff;
  border-radius: 14px;
  padding: 20px;
  width: 48%;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}

/* Flag image styling */
.currenciesList img {
  width: 55px;
  height: 38px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  margin-right: 15px;
}

/* Currency name container */
.currenciesList .countryCurrency {
  flex: 1;
}

/* French currency name styling */
.currenciesList .countryCurrency p:first-child {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
}

/* English currency name styling */
.currenciesList .countryCurrency p:last-child {
  font-size: 0.95rem;
  color: #e2e2e2;
  margin: 2px 0 0 0;
}

/* Amount display styling */
.currenciesList > div > p:last-child {
  font-size: 1.3rem;
  font-weight: bold;
  margin-left: auto;
  white-space: nowrap;
}

/* Background animation for the body */
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

/* Gradient animation for each currency card */
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

</style>

<script>
export default {
  name: 'DevisesOption',

  // Component reactive data
  data() {
    return {
      loading: true,        // Indicates if the data is being fetched
      currencies: [],       // Final list of currency objects to display
      amount: 100           // Default amount in XPF
    };
  },

  // Lifecycle hook for fetching data when component is mounted
  mounted() {
    fetch("https://v6.exchangerate-api.com/v6/ceb3e48ff7d6b698944a5eb2/latest/XPF")
        .then(res => res.json())
        .then(data => {
          // Check if conversion data exists
          if (!data.conversion_rates) {
            console.error('Conversion rates not found:', data);
            this.loading = false;
            return;
          }

          // Currency display configuration: names + flags
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

          // Create final list of currency entries
          this.currencies = Object.entries(currencyLabels).map(([code, labels]) => {
            const countryCode = labels.countryCode?.toLowerCase() || "xx";

            return {
              code,
              name_en: labels.en,
              name_fr: labels.fr,
              rate: data.conversion_rates[code] ?? 0,
              flagUrl: `https://flagcdn.com/h40/${countryCode}.png`
            };
          });

          this.loading = false;
        })
        .catch(error => {
          // Handle fetch error
          console.error("Error while loading JSON data:", error);
          this.loading = false;
        });
  }
};
</script>

