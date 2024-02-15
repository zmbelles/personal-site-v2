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
import GPTInNetSuite from "@/components/blog/posts/GPTGettingDumber";
import { nextTick } from "vue"; // Import nextTick from Vue
const routes = [
	{
		path: "/",
		component: Home,
		name: "Home",
		meta: {
			title: "Home",
			metaTags: [
				{ charset: "UTF-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1.0",
				},
				{ "http-equiv": "X-UA-Compatible", content: "IE=edge" },
				{
					name: "description",
					content:
						"Zachary is a professional NetSuite Developer specializing in SuiteScript design and implementation with JavaScript and underlying frameworks.",
				},
				{
					name: "keywords",
					content:
						"NetSuite, Advanced PDF, Custom Fonts, NetSuite Fonts, PDF Templates, Business Customization, Document Design, Times New Roman, Times, ERP, Formula 1, GPT, LLM, SuiteScript, BattleShip, TicTacToe, Tic-Tac-Toe, Tic Tac Toe",
				},
				{ name: "author", content: "Zachary Belles" },
				{ name: "robots", content: "index, follow" },
				{
					property: "og:title",
					content: "Home",
				},
				{
					property: "og:description",
					content:
						"Zachary is a professional NetSuite Developer specializing in SuiteScript design and implementation with JavaScript and underlying frameworks.",
				},
				{
					property: "og:url",
					content: "https://zacharybelles.com/",
				},
				{ property: "og:site_name", content: "zacharybelles.com" },
				{
					name: "twitter:title",
					content: "Home",
				},
				{
					name: "twitter:description",
					content:
						"Zachary is a professional NetSuite Developer specializing in SuiteScript design and implementation with JavaScript and underlying frameworks.",
				},
			],
		},
	},
	{
		path: "/resume",
		component: ResumePage,
		name: "Resume",
		meta: { title: "Resume" },
	},
	{
		path: "/blog",
		component: BlogPage,
		name: "Blog",
		meta: { title: "Blog" },
	},
	{
		path: "/blog/times-in-netsuite",
		component: AdvPdf,
		name: "Upgrade your Advanced PDF's",
		meta: {
			title: "Using Times New Roman in NetSuite Advanced PDFs",
			metaTags: [
				{ charset: "UTF-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1.0",
				},
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
					content:
						"https://zacharybelles.com/blog/times-in-netsuite/",
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
			title: "Promises in NetSuite",
			metaTags: [
				{ charset: "UTF-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1.0",
				},
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
					content:
						"https://zacharybelles.com//blog/promises-in-netsuite/",
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
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1.0",
				},
				{ "http-equiv": "X-UA-Compatible", content: "IE=edge" },
				{
					name: "description",
					content:
						"Explore ethical and practical implications of using OpenAI's GPT-4 for SuiteScript development. Maximize productivity while ensuring data privacy.",
				},
				{
					name: "keywords",
					content:
						"NetSuite, SuiteScript, ChatGPT, SuiteApps, Automated Intelligence, Large Language Model, LLM, Data Mining, GPT-4, OpenAI, AI Ethics, Data Privacy, Software Development",
				},
				{ name: "author", content: "Zachary Belles" },
				{ name: "robots", content: "index, follow" },
				{ name: "geo.region", content: "US-IL" }, // Example for local optimization
				{ name: "geo.placename", content: "Naperville" },
				{ name: "geo.position", content: "41.7508;-88.1535" },
				{ name: "ICBM", content: "41.7508, -88.1535" },
				// Social media and open graph tags
				{
					property: "og:title",
					content:
						"The N/GPT Module: Navigating SuiteScript with OpenAI’s GPT-4 Engine",
				},
				{ property: "og:type", content: "article" },
				{
					property: "og:url",
					content: "https://zacharybelles.com/blog/gpt-in-netsuite/",
				},
				{
					property: "og:image",
					content: "@/assets/gpt-in-netsuite.png",
				},
				{
					property: "og:description",
					content:
						"Explore ethical and practical implications of using GPT-4 for SuiteScript. Learn best practices for AI integration.",
				},
				// Twitter card data
				{ name: "twitter:card", content: "summary_large_image" },
				{
					name: "twitter:title",
					content: "Navigating SuiteScript with GPT-4",
				},
				{
					name: "twitter:description",
					content:
						"Maximize productivity with GPT-4 in SuiteScript development while ensuring data privacy. Learn more.",
				},
				{
					name: "twitter:image",
					content: "@/assets/gpt-in-netsuite.png",
				},
			],
		},
	},
	{
		path: "/login",
		component: LoginPage,
		name: "login",
		meta: { title: "Login" },
	},
	{
		path: "/contact",
		component: ContactPage,
		name: "contact",
		meta: { title: "Contact Me" },
	},
	{
		path: "/games",
		component: GamesPage,
		name: "games",
		meta: { title: "Games" },
	},
	{
		path: "/games/match",
		component: ButtonMatch,
		name: "match",
		meta: { title: "Match Game" },
	},
	{
		path: "/games/battleship",
		component: BattleShip,
		name: "battleship",
		meta: { title: "Battleship" },
	},
	{
		path: "/games/tic-tac-toe",
		component: TicTacToe,
		name: "tictactoe",
		meta: { title: "Hyper TicTacToe" },
	},
];

const router = createRouter({
	hash: createWebHistory(),
	routes,
});
router.afterEach((to) => {
	nextTick(() => {
		document.title = to.meta.title || "Zachary Belles"; // Fallback title if no meta title is set
	});
});
export default router;
