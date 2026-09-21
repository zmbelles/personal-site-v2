<template>
  <div>
    <TransactionBuilder :spec="spec" :heading="heading" :lede="lede" />

    <FormFaq :path="spec.path">
      Need to see what was ordered before the vendor billed you? The
      <router-link to="/forms/purchase-order">purchase order generator</router-link>
      confirms it before you place the order, and it reads the same JSON.
    </FormFaq>

    <CoffeeRail>
      No account, no watermark, no limit on line items, just one person
      building things in his own time. If this saved you an afternoon, a coffee
      goes a long way.
    </CoffeeRail>
  </div>
</template>

<script>
import CoffeeRail from "@/components/support/CoffeeRail.vue";
import FormFaq from "../shared/FormFaq.vue";
import TransactionBuilder from "../shared/TransactionBuilder.vue";
import { vendorBillSpec } from "../shared/specs.js";

export default {
  name: "VendorBillView",
  components: { CoffeeRail, FormFaq, TransactionBuilder },
  data() {
    return {
      spec: vendorBillSpec,
      heading: "Free bill / vendor bill generator",
      lede:
        "Bill a customer, or record what a vendor billed you: payment terms " +
        "that set the due date, tax and discount lines, and a running balance " +
        "due. Download a PDF or print it. No sign-up, nothing leaves your browser.",
    };
  },
};
</script>
