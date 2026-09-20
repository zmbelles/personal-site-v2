<template>
  <div>
    <TransactionBuilder :spec="spec" :heading="heading" :lede="lede" />

    <FormFaq :path="spec.path">
      Building the NetSuite version instead?
      <router-link to="/blog/times-in-netsuite">
        Getting a Times New Roman look in Advanced PDFs
      </router-link>
      covers the font side, and the
      <router-link to="/forms/sales-order">sales order generator</router-link>
      is the same layout with shipping fields.
    </FormFaq>

    <CoffeeRail>
      No account, no watermark, no limit on line items — just one person
      building things in his own time. If this saved you an afternoon, a coffee
      goes a long way.
    </CoffeeRail>
  </div>
</template>

<script>
import CoffeeRail from "@/components/support/CoffeeRail.vue";
import FormFaq from "../shared/FormFaq.vue";
import TransactionBuilder from "../shared/TransactionBuilder.vue";
import { invoiceSpec } from "../shared/specs.js";

export default {
  name: "InvoiceView",
  components: { CoffeeRail, FormFaq, TransactionBuilder },
  data() {
    return {
      spec: invoiceSpec,
      heading: "Free invoice generator",
      lede:
        "Fill in the fields, watch the sheet build itself, then download a PDF " +
        "or print it. No sign-up, nothing leaves your browser, and the layout is " +
        "the one I start from when I build Advanced PDF templates in NetSuite.",
    };
  },
};
</script>
