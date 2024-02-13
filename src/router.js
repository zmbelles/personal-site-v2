import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/HomePage.vue";
import ResumePage from "@/components/ResumePage.vue";
import BlogPage from "@/components/blog/BlogPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import ContactPage from "@/components/ContactPage.vue";
import GamesPage from "@/components/GamesPage.vue";
import ButtonMatch from "@/components/games/ButtonMatch.vue";
import BattleShip from "@/components/games/BattleShip/BattleShipModel.vue";
import AdvPdf from "@/components/blog/posts/TimesInNetSuite.vue";
import TicTacToe from "@/components/games/TicTacToe.vue";
import PromisesInNetSuite from "@/components/blog/posts/PromisesInNetSuite";
import GPTInNetSuite from '@/components/blog/posts/GPTGettingDumber';
const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/resume", component: ResumePage, name: "Resume" },
  { path: "/blog", component: BlogPage, name: "Blog" },
  {
    path: "/blog/times-in-netsuite",
    component: AdvPdf,
    name: "Upgrade your Advanced PDF's",
    meta: {
      title: "Using Times New Roman in NetSuite Advanced PDFs",
      metaTags: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        {
          name: "description",
          content:
            "Learn how to enhance your NetSuite documents with NoToSerif fonts.",
        },
        {
          name: "keywords",
          content:
            "NetSuite, Advanced PDF, Custom Fonts, NetSuite Fonts, PDF Templates, Business Customization, Document Design, Times New Roman, Times, ERP",
        },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Using Times New Roman in NetSuite Advanced PDFs",
        },
        {
          property: "og:description",
          content:
            "Learn how to enhance your NetSuite documents with NoToSerif fonts.",
        },
        {
          property: "og:url",
          content: "https://zacharybelles.com/blog/times-in-netsuite/",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "zacharybelles.com" },
        {
          name: "twitter:title",
          content: "Using Times New Roman in NetSuite Advanced PDFs",
        },
        {
          name: "twitter:description",
          content:
            "Learn how to enhance your NetSuite documents with NoToSerif fonts. Click to learn how",
        },
      ],
    },
  },
  {
    path: "/blog/promises-in-netsuite",
    component: PromisesInNetSuite,
    name: "Using Promises in Your SuiteScripts",
    meta: {
      title: "Using Promises in NetSuite SuiteScripts",
      metaTags: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        {
          name: "description",
          content:
            "Discover the power of Promises in JavaScript for efficient SuiteScript development in NetSuite.",
        },
        {
          name: "keywords",
          content:
            "NetSuite, SuiteScript, JavaScript, Promises, Asynchronous Programming, Coding, Scripting, ERP, SuiteScripts Best Practices",
        },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Using Promises in NetSuite SuiteScripts",
        },
        {
          property: "og:description",
          content:
            "Discover the power of Promises in JavaScript for efficient SuiteScript development in NetSuite.",
        },
        {
          property: "og:url",
          content: "https://zacharybelles.com//blog/promises-in-netsuite/",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "zacharybelles.com/" },
        {
          name: "twitter:title",
          content: "Using Promises in NetSuite SuiteScripts",
        },
        {
          name: "twitter:description",
          content:
            "Learn how to use Promises in JavaScript for efficient SuiteScript development in NetSuite.",
        },
      ],
    },
  },
  {
    path: "/blog/gpt-in-netsuite",
    component: GPTInNetSuite,
    name: "The N/GPT Module: Navigating SuiteScript with OpenAI’s GPT-4 engine",
    meta: {
      title: "The N/GPT Module: Navigating SuiteScript with OpenAI’s GPT-4 engine",
      metaTags: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "description", content: "Explore ethical and practical implications of using OpenAI's GPT-4 for SuiteScript development. Maximize productivity while ensuring data privacy." },
        { name: "keywords", content: "NetSuite, SuiteScript, GPT-4, OpenAI, AI Ethics, Data Privacy, Software Development" },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        { name: "geo.region", content: "US-IL" }, // Example for local optimization
        { name: "geo.placename", content: "Chicago" },
        { name: "geo.position", content: "41.714956;-88.428169" },
        { name: "ICBM", content: "41.714956, -88.428169" },
        // Social media and open graph tags
        { property: "og:title", content: "The N/GPT Module: Navigating SuiteScript with OpenAI’s GPT-4 Engine" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: "https://zacharybelles.com/blog/gpt-in-netsuite/" },
        { property: "og:image", content: "@/assets/gpt-in-netsuite.png" },
        { property: "og:description", content: "Explore ethical and practical implications of using GPT-4 for SuiteScript. Learn best practices for AI integration." },
        // Twitter card data
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Navigating SuiteScript with GPT-4" },
        { name: "twitter:description", content: "Maximize productivity with GPT-4 in SuiteScript development while ensuring data privacy. Learn more." },
        { name: "twitter:image", content: "@/assets/gpt-in-netsuite.png" },
      ],
    },
  },  
  { path: "/login", component: LoginPage, name: "login" },
  { path: "/contact", component: ContactPage, name: "contact" },
  { path: "/games", component: GamesPage, name: "games" },
  { path: "/games/match", component: ButtonMatch, name: "match" },
  { path: "/games/battleship", component: BattleShip, name: "battleship" },
  { path: "/games/tic-tac-toe", component: TicTacToe, name: "tictactoe" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
