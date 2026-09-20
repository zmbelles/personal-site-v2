<template>
  <div>
    <TransactionBuilder :spec="spec" :heading="heading" :lede="lede" />

    <FormFaq :path="spec.path">
      Need to bill the order once it ships? The
      <router-link to="/forms/invoice">invoice generator</router-link>
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
import { salesOrderSpec } from "../shared/specs.js";

export default {
  name: "SalesOrderView",
  components: { CoffeeRail, FormFaq, TransactionBuilder },
  data() {
    return {
      spec: salesOrderSpec,
      heading: "Free sales order generator",
      lede:
        "Build a sales order line by line: quantities, units, weights and " +
        "shipping, then download a PDF or print it. No sign-up, nothing leaves " +
        "your browser, and the layout mirrors a NetSuite sales order print.",
    };
  },
};
</script>
