import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/HomePage.vue";
import ResumePage from "@/components/ResumePage.vue";
import BlogPage from "@/components/BlogPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import ContactPage from "@/components/ContactPage.vue";
import GamesPage from "@/components/GamesPage.vue";
import ButtonMatch from "@/components/games/ButtonMatch.vue";
import BattleShip from "@/components/games/BattleShip/BattleShipModel.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/resume", component: ResumePage, name: "Resume" },
  { path: "/blog", component: BlogPage, name: "Blog" },
  { path: "/login", component: LoginPage, name: "login" },
  { path: "/contact", component: ContactPage, name: "contact" },
  { path: "/games", component: GamesPage, name: "games" },
  { path: "/games/match", component: ButtonMatch, name: "match" },
  { path: "/games/battleship", component: BattleShip, name: "battleship" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
