<template>
  <div>
    <TransactionBuilder :spec="spec" :heading="heading" :lede="lede" />

    <FormFaq :path="spec.path">
      Need to record what the vendor billed you for this order? The
      <router-link to="/forms/vendor-bill">bill / vendor bill generator</router-link>
      is the same layout with payment terms and a balance due, and it reads the
      same JSON.
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
import { purchaseOrderSpec } from "../shared/specs.js";

export default {
  name: "PurchaseOrderView",
  components: { CoffeeRail, FormFaq, TransactionBuilder },
  data() {
    return {
      spec: purchaseOrderSpec,
      heading: "Free purchase order generator",
      lede:
        "Tell a vendor exactly what to send: line items with quantities, units " +
        "and weights, a ship-to address and a need-by date. Download a PDF or " +
        "print it. No sign-up, nothing leaves your browser.",
    };
  },
};
</script>
