<template>
  <div class="sales-order-form">
    <h1>Hey, you're not supposed to be here!&#128517;</h1>
    <h1>Open-Source Sales Order</h1>
    <button class="json-button" @click="toggleJsonPopup">Paste JSON</button>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="companyName">
          Name of Company: <span class="required">*</span>
        </label>
        <input type="text" id="companyName" v-model="salesOrder.companyName" required>
      </div>

      <div class="form-group">
        <label for="documentNumber">
          Document Number: <span class="required">*</span>
          <img src="@/assets/icons8-info.svg" class="info-icon" @click="showInfo('documentNumber')" alt="info">
        </label>
        <input type="text" id="documentNumber" v-model="salesOrder.documentNumber" required>
      </div>

      <div class="form-group">
        <label for="billTo">
          Bill To Name and Address: <span class="required">*</span>
          <img src="@/assets/icons8-info.svg" class="info-icon" @click="showInfo('billTo')" alt="info">
        </label>
        <textarea id="billTo" v-model="salesOrder.billTo" required></textarea>
      </div>

      <div class="form-group">
        <label for="shipTo">
          Ship To Name and Address: <span class="required">*</span>
          <img src="@/assets/icons8-info.svg" class="info-icon" @click="showInfo('shipTo')" alt="info">
        </label>
        <textarea id="shipTo" v-model="salesOrder.shipTo" required></textarea>
      </div>

      <div class="form-group">
        <label for="total">
          Total: <span class="required">*</span>
          <img src="@/assets/icons8-info.svg" class="info-icon" @click="showInfo('total')" alt="info">
        </label>
        <input type="number" id="total" v-model="salesOrder.total" required>
      </div>

      <div class="form-group">
        <label for="shipDate">Ship Date (optional):</label>
        <input type="date" id="shipDate" v-model="salesOrder.shipDate">
      </div>

      <div class="form-group">
        <label for="memo">Memo (optional):</label>
        <textarea id="memo" v-model="salesOrder.memo"></textarea>
      </div>

      <div class="button-container">
        <button type="submit">Get printable template</button>
      </div>
    </form>

    <div v-if="infoPanelVisible" class="info-panel">
      <div v-html="infoText"></div>
      <button @click="infoPanelVisible = false">Close</button>
    </div>

    <div v-if="jsonPopupVisible" class="json-popup">
      <h2>Paste JSON</h2>
      <textarea v-model="jsonInput" placeholder="Paste JSON here"></textarea>
      <button @click="populateFromJson">Populate</button>
      <button @click="jsonPopupVisible = false">Close</button>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      salesOrder: {
        companyName: '',
        documentNumber: '',
        billTo: '',
        shipTo: '',
        total: null,
        shipDate: '',
        memo: ''
      },
      infoText: '',
      infoPanelVisible: false,
      jsonPopupVisible: false,
      jsonInput: ''
    };
  },
  methods: {
    submitForm() {
      // Handle the form submission, e.g., make an API call or process the data
      console.log("Submitted data:", this.salesOrder);
    },
    showInfo(field) {
      const infoTexts = {
        documentNumber: 'The unique identifier for the sales order document.',
        billTo: `
          <div>
            <p>The name and address to which the invoice will be sent.</p>
            <p>Example:</p>
            <p>Test Customer</p>
            <p>123 Main Street</p>
            <p>Anytown, USA 12345</p>
          </div>`,
        shipTo: `
          <div>
            <p>The name and address to which the order will be shipped.</p>
            <p>Example:</p>
            <p>Test Customer</p>
            <p>123 Main Street</p>
            <p>Anytown, USA 12345</p>
          </div>`,
        total: 'The total amount for the sales order.'
      };
      this.infoText = infoTexts[field];
      this.infoPanelVisible = true;
    },
    toggleJsonPopup() {
      this.jsonPopupVisible = !this.jsonPopupVisible;
    },
    populateFromJson() {
      try {
        const data = JSON.parse(this.jsonInput);
        this.salesOrder = { ...this.salesOrder, ...data };
        this.jsonPopupVisible = false;
      } catch (e) {
        alert("Invalid JSON");
      }
    },
    exampleObject() {
    }
  }
}
</script>





<style scoped>
.sales-order-form {
  font-family: "Segoe UI", Arial, sans-serif;
  color: #bf8cbe;
  background-color: #181825;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}

/* .sales-order-form  */h1 {
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #dfa8cd;
}

input[type="text"],
input[type="number"],
input[type="date"],
textarea {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: #362e5f;
  color: white;
}

textarea {
  height: 100px;
}

.button-container {
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #362e5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #504073;
}

button:active {
  background-color: #2b2141;
}

.required {
  color: red;
}

.info-icon {
  margin-left: 10px;
  cursor: pointer;
  width: 14px;
  height: 14px;
}

.info-panel {
  background-color: #504073;
  color: white;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
  z-index: 10;
  width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  line-height: 1.4;
}

.json-button {
  display: block;
  margin-left: auto;
  margin-bottom: 20px;
  background-color: #362e5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  text-align: right;
}

.json-button:hover {
  background-color: #504073;
}

.json-button:active {
  background-color: #2b2141;
}

.json-popup {
  background-color: #504073;
  color: white;
  border-radius: 4px;
  padding: 20px;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  z-index: 10;
  width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.json-popup textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: none;
  background-color: #362e5f;
  color: white;
  padding: 8px;
}
</style>



