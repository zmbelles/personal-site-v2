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
