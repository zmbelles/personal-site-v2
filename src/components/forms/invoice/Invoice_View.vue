<template>
    <div class="sales-order-form">
      <h1>Open-Source Invoice</h1>
      <button class="json-button" @click="toggleJsonPopup">Paste JSON</button>
      <form @submit.prevent="submitForm">
        <div class="form-container">
          <div class="form-group">
            <label for="companyName">
              Name of Company: <span class="required">*</span>
            </label>
            <input type="text" id="companyName" v-model="invoice.companyName" required>
          </div>

          <div class="form-group">
            <label for="total">
              Total: <span class="required">*</span>
              <img src="@/assets/icons8-info.svg" class="info-icon" @click="showInfo('total')" alt="info">
            </label>
            <input type="number" id="total" v-model="invoice.total" required>
          </div>

          <div class="form-group">
            <label for="billDate">Due Date:</label>
            <input type="date" id="billDate" v-model="invoice.billDate">
          </div>

          
          <div class="form-group">
            <label for="billDate">Today's Date:</label>
            <input type="date" id="billDate" v-model="invoice.todaysDate">
          </div>

          <div class="form-group">
            <label for="billTo">
              Bill To Name and Address: <span class="required">*</span>
              <img src="@/assets/icons8-info.svg" class="info-icon" @click="showInfo('billTo')" alt="info">
            </label>
            <textarea id="billTo" v-model="billToInput" @input="updateBillTo"></textarea>
          </div>

          <div class="form-group">
            <label for="memo">Memo/Service Notes (optional):</label>
            <textarea id="memo" v-model="invoice.memo"></textarea>
          </div>
          <div class="form-group">
            <label for="memo">Company Phone:<span class="required">*</span></label>
            <input type="tel" id="customerPhone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" v-model="invoice.companyPhone" />
          </div>
          <div class="form-group">
            <label for="memo">Company Email:<span class="required">*</span></label>
            <input type="email" id="customerEmail" v-model="invoice.companyEmail" />
          </div>
          <div class="form-group">
            <label for="memo">Company Slogan:<span class="required">*</span></label>
            <input type="text" id="slogan" v-model="invoice.slogan" />
          </div>
          <div class="form-group">
            <label for="companyLogo">Upload Company Logo:</label>
            <input type="file" id="companyLogo" @change="handleLogoUpload" accept="image/*" />
            <div v-if="invoice.logoDataUrl" class="logo-preview">
              <img :src="invoice.logoDataUrl" alt="Company Logo" />
            </div>
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select v-model="invoice.status" id="status" class="form-control">
              <option>Open</option>
              <option>Paid in Full</option>
            </select>
          </div>
        </div>
        <div class="services-section">
          <h2>Services</h2>
          <button type="button" @click="addService" class="add-button">Add New Service</button>
          <div class="service-list">
            <table>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Quantity</th>
                  <th>Unit of Measure</th>
                  <th>Price per Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(service, index) in invoice.services" :key="index" class="service-entry">
                  <td><input type="text" v-model="service.name" /></td>
                  <td><input type="number" v-model="service.quantity" /></td>
                  <td><input type="text" v-model="service.unit" /></td>
                  <td><input type="number" v-model="service.price" /></td>
                  <td><button type="button" @click="removeService(index)" class="remove-button">Remove</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <br><br><br>
        <div class="button-container">
          <button type="button" @click="generatePDF">Get printable template</button>
        </div>
      </form>
  
      <div v-if="infoPanelVisible" class="info-panel">
        <div v-html="infoText"></div>
        <button @click="infoPanelVisible = false">Close</button>
      </div>
  
      <div v-if="jsonPopupVisible" class="json-popup">
        <h2>Paste JSON</h2>
        <button @click="copyExampleJson">Copy Example Object</button>
        <button @click="jsonPopupVisible = false">Close</button>
        <div class="json-editor" contenteditable="true" @input="onJsonInput" ref="jsonEditor"></div>
        <button @click="populateFromJson">Populate</button>
      </div>
    </div>
  </template>
  
  <script>
  import invoice from './invoice_Class.js';
  import Prism from 'prismjs';
  import '@/themes/prism-night-owl.css';
  import 'prismjs/components/prism-json';
  import { invoiceFactory } from './invoice_Factory.js';
  
  export default {
    data() {
      return {
        invoice: new invoice(),
        billToInput: '',
        shipToInput: '',
        infoText: '',
        infoPanelVisible: false,
        jsonPopupVisible: false,
        jsonInput: ''
      };
    },
    methods: {
      submitForm() {
        console.log("Submitted data:", this.invoice);
      },
      generatePDF() {
        console.log("Generating PDF...", this.invoice);

        if (!this.invoice.todaysDate) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based
          const dd = String(today.getDate()).padStart(2, '0');
          this.invoice.todaysDate = `${yyyy}-${mm}-${dd}`;
        }
        invoiceFactory(this.invoice);
      },
      showInfo(field) {
        const infoTexts = {
          documentNumber: 'The unique identifier for the Invoice document.',
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
          total: 'The total amount for the Invoice.'
        };
        this.infoText = infoTexts[field];
        this.infoPanelVisible = true;
      },
      toggleJsonPopup() {
        this.jsonPopupVisible = !this.jsonPopupVisible;
        this.$nextTick(() => {
          this.highlightJson();
        });
      },
      populateFromJson() {
        try {
          const data = JSON.parse(this.jsonInput);
          this.invoice = Object.assign(new invoice(), data);
          this.billToInput = `${this.invoice.billto.name}\n${this.invoice.billto.addr1}\n${this.invoice.billto.cityStateZip}`;
          this.jsonPopupVisible = false;
        } catch (e) {
          alert("Invalid JSON");
        }
      },
      copyExampleJson() {
        const exampleJson = JSON.stringify({
          companyName: 'Example Company',
          documentNumber: '123456',
          billto: {
            name: 'Example Customer',
            addr1: '456 Example Ave',
            cityStateZip: 'Example City, EX 78910'
          },
          shipto: {
            name: 'Example Receiver',
            addr1: '789 Receiver Blvd',
            cityStateZip: 'Receiver City, RE 11223'
          },
          total: 1000.00,
          services: [
            { name: 'Service 1', quantity: 2, price: 50.00 },
            { name: 'Service 2', quantity: 1, price: 900.00 }
          ],
          billDate: '2024-01-01',
          memo: 'Example memo'
        }, null, 2);
        this.jsonInput = exampleJson;
        this.$nextTick(() => {
          this.highlightJson();
        });
      },
      updateBillTo() {
        this.invoice.setBillto(this.billToInput);
      },
      updateShipTo() {
        this.invoice.setShipto(this.shipToInput);
      },
      addService() {
        this.invoice.services.push({ name: '', quantity: 1, unit: 'EA', price: 0 });
      },
      removeService(index) {
        this.invoice.services.splice(index, 1);
      },
      highlightJson() {
        const element = this.$refs.jsonEditor;
        const cursorPosition = this.saveCursorPosition(element);
        element.innerHTML = Prism.highlight(this.jsonInput, Prism.languages.json, 'json');
        this.restoreCursorPosition(element, cursorPosition);
      },
      onJsonInput(event) {
        this.jsonInput = event.target.innerText;
        this.highlightJson();
      },
      saveCursorPosition(element) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
          return null;
        }
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        const start = preCaretRange.toString().length;
        return { start, end: start };
      },
      restoreCursorPosition(element, position) {
        if (!position) return;
        const selection = window.getSelection();
        const range = document.createRange();
        let charIndex = 0;
        const nodeStack = [element];
        let node, foundStart = false, stop = false;
  
        while (!stop && (node = nodeStack.pop())) {
          if (node.nodeType === 3) {
            const nextCharIndex = charIndex + node.length;
            if (!foundStart && position.start >= charIndex && position.start <= nextCharIndex) {
              range.setStart(node, position.start - charIndex);
              foundStart = true;
            }
            if (foundStart && position.end >= charIndex && position.end <= nextCharIndex) {
              range.setEnd(node, position.end - charIndex);
              stop = true;
            }
            charIndex = nextCharIndex;
          } else {
            let i = node.childNodes.length;
            while (i--) {
              nodeStack.push(node.childNodes[i]);
            }
          }
        }
  
        selection.removeAllRanges();
        selection.addRange(range);
      },
      handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.invoice.logoDataUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      addCompanyPhone() {

      }
    },
    watch: {
      jsonInput() {
        this.highlightJson();
      }
    }
  }
  </script>
  
  <style scoped>
  .sales-order-form {
    font-family: "Segoe UI", Arial, sans-serif;
    color: #bf8cbe;
    background-color: #181825;
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 8px;
    position: relative;
  }
  
  .sales-order-form h1 {
    color: #dfa8cd;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .form-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Two equal columns */
    gap: 20px; /* Space between rows and columns */
  }

  .form-group {
    width: 100%; /* Ensure each group spans its column */
  }

  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #dfa8cd;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="date"],
  input[type="tel"],
  input[type="email"],
  textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: none;
    background-color: rgb(201, 201, 201);
    color: black;
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
  
  .json-popup .json-editor {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: none;
    background-color: #362e5f;
    color: white;
    padding: 8px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    overflow-y: auto;
    text-align: left;
  }
  
  .services-section {
    margin-top: 30px;
  }
  
  .services-section h2 {
    color: #dfa8cd;
    margin-bottom: 15px;
  }
  
  .service-list {
    background-color: #362e5f;
    border-radius: 8px;
    padding: 15px;
  }
  
  .service-entry {
    margin-bottom: 15px;
    border-bottom: 1px solid #504073;
    padding-bottom: 10px;
  }
  
  .service-entry:last-child {
    border-bottom: none;
  }
  
  .remove-button {
    background-color: #b700ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 14px;
  }
  
  .remove-button:hover {
    background-color: #d200ff;
  }
  
  .remove-button:active {
    background-color: #5c067d;
  }
  
  .add-button {
    background-color: #4a4e69;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 16px;
    margin-bottom: 10px;
    display: block;
    text-align: left;
  }
  
  .add-button:hover {
    background-color: #6c757d;
  }
  
  .add-button:active {
    background-color: #343a40;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  /* Existing styles omitted for brevity */
  
  thead th {
    color: white;
    padding: 10px;
    text-align: left;
  }
  
  tbody td {
    padding: 10px;
  }
  
  tbody input {
    width: 90%;
    text-align: left;
  }
  
  /* New styles for column widths */
  thead th:nth-child(1), /* service Name */
  tbody td:nth-child(1) {
    width: 30%;
    position: relative;
  }
  
  thead th:nth-child(1)::before {
    content: " ";
    white-space: pre; /* Ensure the space is respected */
  }
  
  thead th:nth-child(2), /* Quantity */
  tbody td:nth-child(2),
  thead th:nth-child(3), /* Unit of Measure */
  tbody td:nth-child(3),
  thead th:nth-child(4), /* Price per service */
  tbody td:nth-child(4),
  thead th:nth-child(5), /* Actions */
  tbody td:nth-child(5) {
    width: 14%;
    text-align: center; /* Center-align the header cells */
  }
  </style>
  
  
  