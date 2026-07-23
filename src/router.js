import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
import applyMeta from "@/seo/applyMeta.js";

import Home from "@/components/HomePage.vue";
import ResumePage from "@/components/ResumePage.vue";
import BlogPage from "@/components/blog/BlogPage.vue";
import FormPage from "@/components/forms/FormPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import HappyBirthday from "@/components/HappyBirthday.vue";
import ContactPage from "@/components/ContactPage.vue";
import GamesPage from "@/components/GamesPage.vue";
import NotFound from "@/components/NotFound.vue";
import ButtonMatch from "@/components/games/ButtonMatch.vue";
import BattleShip from "@/components/games/BattleShip/BattleShipModel.vue";
import AdvPdf from "@/components/blog/posts/TimesInNetSuite.vue";
import TicTacToe from "@/components/games/TicTacToe.vue";
import PromisesInNetSuite from "@/components/blog/posts/PromisesInNetSuite";
import GPTInNetSuite from "@/components/blog/posts/GPTGettingDumber";
import FirstYearLessons from "@/components/blog/posts/FirstYearLessons";
import SalesOrder from "@/components/forms/sales_order/SalesOrder_View.vue";
import InvoiceForm from "@/components/forms/invoice/Invoice_View.vue";
import BeIntentional from "@/components/blog/posts/BeIntentional.vue";
import FindANiche from "@/components/blog/posts/FindANiche.vue";
import RemoteWork from "@/components/blog/posts/RemoteWork.vue";
import JobQuestion from "@/components/blog/posts/JobQuestion.vue";
import SeatingChart from "@/components/tools/seating/SeatingChartPage.vue";

// Titles, descriptions, Open Graph data and structured data all live in
// src/seo/pages.json, keyed by path — see src/seo/head.cjs.
const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/resume", component: ResumePage, name: "Resume" },
  { path: "/contact", component: ContactPage, name: "contact" },

  { path: "/blog", component: BlogPage, name: "Blog" },
  { path: "/blog/question-that-got-me-the-job", component: JobQuestion },
  {
    path: "/blog/times-in-netsuite",
    component: AdvPdf,
    name: "Upgrade your Advanced PDF's",
  },
  {
    path: "/blog/promises-in-netsuite",
    component: PromisesInNetSuite,
    name: "Using Promises in Your SuiteScripts",
  },
  {
    path: "/blog/gpt-in-netsuite",
    component: GPTInNetSuite,
    name: "The N/GPT Module: Navigating SuiteScript with OpenAI’s GPT-4 engine",
  },
  {
    path: "/blog/first-year-lessons",
    component: FirstYearLessons,
    name: "Lessons from My First Year as a NetSuite Developer",
  },
  { path: "/blog/be-intentional", component: BeIntentional, name: "BeIntentional" },
  { path: "/blog/find-a-niche", component: FindANiche, name: "FindANiche" },
  {
    path: "/blog/remote-work-good-bad-ugly",
    component: RemoteWork,
    name: "Remote Work: The Good, the Bad, and the Ugly",
  },

  { path: "/seating-chart", component: SeatingChart, name: "seating-chart" },

  { path: "/games", component: GamesPage, name: "games" },
  { path: "/games/match", component: ButtonMatch, name: "match" },
  { path: "/games/battleship", component: BattleShip, name: "battleship" },
  { path: "/games/tic-tac-toe", component: TicTacToe, name: "tictactoe" },

  { path: "/forms", component: FormPage, name: "forms" },
  { path: "/forms/sales-order", component: SalesOrder, name: "sales-order" },
  { path: "/forms/invoice", component: InvoiceForm, name: "invoice" },

  { path: "/login", component: LoginPage, name: "login" },
  { path: "/happy-birthday", component: HappyBirthday, name: "Happy Birthday" },

  { path: "/:pathMatch(.*)*", component: NotFound, name: "not-found" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  nextTick(() => applyMeta(to.path));
});

export default router;
