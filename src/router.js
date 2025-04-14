import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/HomePage.vue";
import ResumePage from "@/components/ResumePage.vue";
import BlogPage from "@/components/blog/BlogPage.vue";
import FormPage from "@/components/forms/FormPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import HappyBirthday from "@/components/HappyBirthday.vue";
import ContactPage from "@/components/ContactPage.vue";
import GamesPage from "@/components/GamesPage.vue";
import ButtonMatch from "@/components/games/ButtonMatch.vue";
import BattleShip from "@/components/games/BattleShip/BattleShipModel.vue";
import AdvPdf from "@/components/blog/posts/TimesInNetSuite.vue";
import TicTacToe from "@/components/games/TicTacToe.vue";
import PromisesInNetSuite from "@/components/blog/posts/PromisesInNetSuite";
import GPTInNetSuite from '@/components/blog/posts/GPTGettingDumber';
import FirstYearLessons from '@/components/blog/posts/FirstYearLessons';
import SalesOrder from '@/components/forms/sales_order/SalesOrder_View.vue';
import InvoiceForm from '@/components/forms/invoice/Invoice_View.vue';
import BeIntentional from "./components/blog/posts/BeIntentional.vue";
import FindANiche from "./components/blog/posts/FindANiche.vue";
import RemoteWork from "./components/blog/posts/RemoteWork.vue";
import { nextTick } from 'vue'; // Import nextTick from Vue
const routes = [
  { path: "/", component: Home, name: "Home", meta: { title: "Home" } },
  {
    path: "/resume",
    component: ResumePage,
    name: "Resume",
    meta: { title: "Resume" },
  },
  { path: "/blog", component: BlogPage, name: "Blog", meta: { title: "Blog" } },
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
      title:
        "The N/GPT Module: Navigating SuiteScript with OpenAI’s GPT-4 engine",
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
    path: "/blog/first-year-lessons",
    component: FirstYearLessons,
    name: "Lessons from My First Year as a NetSuite Developer",
    meta: {
      title:
        "Lessons from My First Year as a NetSuite Developer: Trials, Triumphs, and Takeaways",
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
            "Discover key insights and valuable lessons learned during my first year as a NetSuite developer, including handling mistakes, work-life balance, and career satisfaction.",
        },
        {
          name: "keywords",
          content:
            "NetSuite, Developer, Professional Development, Career Lessons, ERP, SuiteScript, Work-Life Balance, Software Development, Mistakes, Career Advice",
        },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content:
            "Lessons from My First Year as a NetSuite Developer: Trials, Triumphs, and Takeaways",
        },
        {
          property: "og:description",
          content:
            "Discover key insights and valuable lessons learned during my first year as a NetSuite developer, including handling mistakes, work-life balance, and career satisfaction.",
        },
        {
          property: "og:url",
          content: "https://zacharybelles.com/blog/first-year-lessons/",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "zacharybelles.com" },
        {
          property: "og:image",
          content: "@/assets/first-year-lessons.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Lessons from My First Year as a NetSuite Developer",
        },
        {
          name: "twitter:description",
          content:
            "Discover key insights and valuable lessons learned during my first year as a NetSuite developer, including handling mistakes, work-life balance, and career satisfaction.",
        },
        {
          name: "twitter:image",
          content: "@/assets/first-year-lessons.png",
        },
        { name: "geo.region", content: "US-IL" },
        { name: "geo.placename", content: "Naperville" },
        { name: "geo.position", content: "41.7508;-88.1535" },
        { name: "ICBM", content: "41.7508, -88.1535" },
      ],
    },
  },
  {
    path: "/blog/be-intentional",
    name: "BeIntentional",
    component: BeIntentional,
    meta: {
      title: "Be Intentional: Tips for Software Developers in 2024",
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
            "Explore essential tips for software developers in 2024, focusing on intentional programming, understanding client needs, and following documentation best practices.",
        },
        {
          name: "keywords",
          content:
            "Software Development, NetSuite, Programming Best Practices, Developer Tips, Intentional Programming, SaaS Applications, Career Advice, 2024 Tips",
        },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Be Intentional: Tips for Software Developers in 2024",
        },
        {
          property: "og:description",
          content:
            "Explore essential tips for software developers in 2024, focusing on intentional programming, understanding client needs, and following documentation best practices.",
        },
        {
          property: "og:url",
          content: "https://zacharybelles.com/blog/be-intentional/",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "zacharybelles.com" },
        {
          property: "og:image",
          content: "@/assets/beIntentional.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Be Intentional: Tips for Software Developers in 2024",
        },
        {
          name: "twitter:description",
          content:
            "Explore essential tips for software developers in 2024, focusing on intentional programming, understanding client needs, and following documentation best practices.",
        },
        {
          name: "twitter:image",
          content: "@/assets/be-intentional.png",
        },
        { name: "geo.region", content: "US-IL" },
        { name: "geo.placename", content: "Naperville" },
        { name: "geo.position", content: "41.7508;-88.1535" },
        { name: "ICBM", content: "41.7508, -88.1535" },
      ],
    },
  },
  {
    path: "/blog/find-a-niche",
    name: "FindANiche",
    component: FindANiche,
    meta: {
      title: "Find a Niche and Fill It: Standing Out in a Saturated Tech Job Market",
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
            "Learn how specializing in a niche skill set can help you stand out in a crowded job market for developers. Discover the benefits of focusing on ERP systems like NetSuite, understanding market demands, and aligning your career path with in-demand technologies.",
        },
        {
          name: "keywords",
          content:
            "Software Development, Tech Job Market, Niche Specialization, ERP Systems, NetSuite Developers, Career Advice, 2024 Tips",
        },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Find a Niche and Fill It: Standing Out in a Saturated Tech Job Market",
        },
        {
          property: "og:description",
          content:
            "Learn how specializing in a niche skill set can help you stand out in a crowded job market for developers. Discover the benefits of focusing on ERP systems like NetSuite, understanding market demands, and aligning your career path with in-demand technologies.",
        },
        {
          property: "og:url",
          content: "https://zacharybelles.com/blog/find-a-niche/",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "zacharybelles.com" },
        {
          property: "og:image",
          content: "@/assets/findANiche.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Find a Niche and Fill It: Standing Out in a Saturated Tech Job Market",
        },
        {
          name: "twitter:description",
          content:
            "Learn how specializing in a niche skill set can help you stand out in a crowded job market for developers. Discover the benefits of focusing on ERP systems like NetSuite, understanding market demands, and aligning your career path with in-demand technologies.",
        },
        {
          name: "twitter:image",
          content: "@/assets/find-a-niche.png",
        },
        { name: "geo.region", content: "US-IL" },
        { name: "geo.placename", content: "Naperville" },
        { name: "geo.position", content: "41.7508;-88.1535" },
        { name: "ICBM", content: "41.7508, -88.1535" },
      ],
    },
  },  
  {
    path: "/blog/remote-work-good-bad-ugly",
    component: RemoteWork,
    name: "Remote Work: The Good, the Bad, and the Ugly",
    meta: {
      title: "Remote Work: The Good, the Bad, and the Ugly",
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
            "Explore the realities of remote work in software engineering, from productivity and collaboration to corporate expectations.",
        },
        {
          name: "keywords",
          content:
            "Remote Work, Software Engineering, Work from Home, Productivity, Collaboration, NetSuite, Remote Job, Office vs Remote, Tech Industry",
        },
        { name: "author", content: "Zachary Belles" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Remote Work: The Good, the Bad, and the Ugly",
        },
        {
          property: "og:description",
          content:
            "Explore the realities of remote work in software engineering, from productivity and collaboration to corporate expectations.",
        },
        {
          property: "og:url",
          content: "https://zacharybelles.com/blog/remote-work-good-bad-ugly/",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "zacharybelles.com/" },
        {
          name: "twitter:title",
          content: "Remote Work: The Good, the Bad, and the Ugly",
        },
        {
          name: "twitter:description",
          content:
            "Explore the realities of remote work in software engineering, productivity, and corporate expectations.",
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
    path: "/happy-birthday",
    component: HappyBirthday,
    name: "Happy Birthday",
    meta: { title: "Happy Birthday, Will" },
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
  {
    path: "/forms",
    component: FormPage,
    name: "forms",
    meta: { title: "Forms" },
  },
  {
    path: "/forms/sales-order",
    component: SalesOrder,
    name: "sales-order",
    meta: { title: "sales-order" },
  },
  {
    path: "/forms/invoice",
    component: InvoiceForm,
    name: "invoice",
    meta: { title: "invoice" },
  },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});
router.afterEach((to) => {
	nextTick(() => {
		document.title = to.meta.title || 'Zachary Belles'; // Fallback title if no meta title is set
	});
});
export default router;
