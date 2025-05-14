import html2pdf from 'html2pdf.js';

export async function invoiceFactory(invoice) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; padding: 20px; width: 794px; box-sizing: border-box;">
      <div class="content-container" style="background-color: white; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div class="header" style="display: flex; justify-content: center; align-services: center; position: relative; height: 100px;">
          <div class="logo-container" style="position: absolute; top: 0; left: 0; margin: 10px;">
          <img 
            src="${invoice.logoDataUrl || new URL('@/assets/Ryan_Logo.png', import.meta.url)}" 
            alt="Company Logo"
            style="max-width: 250px; max-height: 100px; width: auto; height: auto; object-fit: contain; display: block;">
          </div>
          <div class="invoice-title" style="font-size: 22px; font-weight: bold;">INVOICE</div>
        </div>

        <!-- Billing and Shipping Section -->
        <div class="bill-ship" style="display: flex; justify-content: space-between; margin-top: 20px;">
          <div style="width: 45%;">
            <strong>Bill To:</strong>
            <p>${invoice.billto.name}</p>
            <p>${invoice.billto.addr1}</p>
            <p>${invoice.billto.cityStateZip}</p>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="section" style="margin-top: 20px;">
          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td><strong>Due Date:</strong></td>
              <td>${invoice.billDate}</td>
            </tr>
            <tr>
              <td><strong>Today's Date:</strong></td>
              <td>${invoice.todaysDate}</td>
            </tr>
          </table>
        </div>

        <!-- services Table -->
        <table class="services" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #d9dadd; padding: 8px; background-color: #d9dadd;">Service</th>
              <th style="border: 1px solid #d9dadd; padding: 8px; background-color: #d9dadd;">Quantity</th>
              <th style="border: 1px solid #d9dadd; padding: 8px; background-color: #d9dadd;">Unit</th>
              <th style="border: 1px solid #d9dadd; padding: 8px; background-color: #d9dadd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.services
              .map(
                (service) => `
                  <tr>
                    <td style="border: 1px solid #d9dadd; padding: 8px;">${service.name}</td>
                    <td style="border: 1px solid #d9dadd; padding: 8px;">${service.quantity}</td>
                    <td style="border: 1px solid #d9dadd; padding: 8px;">EA</td>
                    <td style="border: 1px solid #d9dadd; padding: 8px;">${service.price.toFixed(2)}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>

        <!-- Total Section -->
        <div class="total" style="margin-top: 20px; text-align: right;">
          <p><strong>Total:</strong> $${invoice.total.toFixed(2)}</p>
        </div>
        <!-- Memo / Notes Section -->
        <div class="notes-section" style="margin-top: 30px; border: 1px solid #ccc; padding: 15px; background-color: #fafafa;">
          <strong>Notes:</strong>
          <p style="margin-top: 8px; white-space: pre-wrap;">
            ${invoice.memo || '—'}
          </p>
        </div>
        <!-- Footer Section -->
        <div class="footer" style="background-color: #f4f4f4; padding: 15px; text-align: center; margin-top: 30px; border-top: 2px solid #333333; box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);">
          <div class="footer-content" style="font-size: 10pt; color: #000000; margin-bottom: 10px; line-height: 1.4; text-align: center;">
            <p>${invoice.companyName}</p>
            <p style="font-weight: bold;">If you have any questions about this invoice, please contact us at:</p>
            <p>
              <span style="font-weight: bold;">Email:</span> ${invoice.companyEmail}
              &nbsp;|&nbsp;
              <span style="font-weight: bold;">Phone:</span> ${invoice.companyPhone}
            </p>
          </div>
          <div class="footer-slogan" style="font-size: 12pt; font-weight: bold; color: #0073e6;">
            ${invoice.slogan}
          </div>
        </div>
      </div>
    </div>
  `;

  // Generate the PDF
  html2pdf()
    .set({
      margin: 0,
      filename: `${invoice.companyName}_invoice.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' },
    })
    .from(container)
    .save();
}
