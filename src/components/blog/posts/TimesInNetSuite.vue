<template>
  <div class="blog-page">
    <h1>Using Times New Roman in NetSuite Advanced PDF's</h1>
    <p class="publication-date">Published on: December 18, 2023 at 8:45pm CST</p> <!-- Publication date -->
    <section class="introduction">
      <h2>Introduction</h2>
      <p>
        While Times New Roman is a classic font, its use in NetSuite Advanced
        PDFs requires appropriate licensing, especially for commercial purposes.
        Licenses for this and other fonts can go for as much as $350/year. This
        guide explores the nuances of font licensing and introduces Noto Serif
        as an excellent alternative.
      </p>
    </section>

    <section class="content">
      <h2>Understanding Font Licensing</h2>
      <p>
        Times New Roman, though popular, is a licensed font. Using it without
        proper permissions can lead to legal issues, particularly in commercial
        contexts. Here you'll find an example of a legally safe alternative,
        NoToSerif, and how to use it inside your Advanced PDF in NetSuite.
      </p>
      <p>
        Noto Serif is often considered a close alternative to Times New Roman
        due to its classic, serif styling. Both fonts feature serifed
        characters, which give them a traditional and formal appearance suitable
        for a wide range of documents. Additionally, Noto Serif provides
        excellent readability, especially in Advanced PDF's, making it ideal for
        body text in digital media. Its well-balanced design, with clear
        distinction in letterforms, makes it a great choice for those seeking a
        similar aesthetic to Times New Roman without the licensing restrictions.
      </p>

      <h2>How to Include and Use Noto Serif in NetSuite Advanced PDFs</h2>
      <p>
        <strong>Step 1:</strong> Noto Serif is a freely available font that
        closely resembles Times New Roman. It's an ideal choice for those
        seeking a similar aesthetic without the licensing concerns.
      </p>
      <p>
        <strong>Step 2:</strong> To include Noto Serif in your PDFs, use the
        following link in your template's head section:
      </p>
      <pre><code class="language-markup">
        &lt;link name="NotoSerif" type="font" subtype="opentype" src="${nsfont.notoserif_regular}" bytes="2"&gt;&lt;/link&gt;
      </code></pre>
      <p>
        <strong>Step 3:</strong> Once Noto Serif is included, use it in your
        template. For example, to apply Noto Serif to a table cell (&lt;td&gt;):
      </p>
      <pre><code class="language-markup">
        &lt;td align="center" colspan="6" style="padding-top: 10px; padding-bottom: 10px;" class="headerinfo"&gt;
          &lt;span style="font-family: 'NotoSerif'; font-size: 11pt;"&gt;${ordernum}&lt;/span&gt;
        &lt;/td&gt;
      </code></pre>
      <p>
        In this example, the font-family is set to 'NotoSerif', and the font
        size is specified as 11pt. The ${ordernum} is a placeholder for a
        dynamic value that will be replaced in the actual document.
      </p>
      <p>
        you can also, of course, extract the font-family into your own css if
        you wish.
      </p>
    </section>

    <section class="conclusion">
      <h2>Conclusion</h2>
      <p>
        By opting for Noto Serif in your NetSuite Advanced PDFs, you can achieve
        a professional and classic look similar to Times New Roman, while
        staying clear of potential licensing issues. Noto Serif offers
        versatility and legal peace of mind for your business documents.
      </p>
    </section>
  </div>
</template>

<script>
import Prism from 'prismjs';
import '@/themes/prism-night-owl.css';
import 'prismjs/components/prism-markup'; // For HTML
export default {
  name: "CustomFontsPage",
  mounted() {
    Prism.highlightAll();
  },
};
</script>

<style scoped>
.blog-page {
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.6;
  color: #bf8cbe; /* Light-colored text for readability */
  background-color: #181825; /* Dark background */
  max-width: 800px; /* Constrain width */
  margin: 0 auto; /* Center the container */
  padding: 20px;
  border-radius: 8px;
}

h1,
h2 {
  color: #dfa8cd; /* Light color for headers */
}

h1 {
  margin-bottom: 30px;
}

h2 {
  margin-bottom: 15px;
}

.introduction,
.content,
.conclusion {
  background-color: #362e5f; /* Dark purple background for sections */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}
.publication-date {
    font-size: 0.9em;
    color: #a8a8a8; /* Choose a suitable color */
    margin-bottom: 20px;
  }

/* Additional styling and responsiveness can be added as needed */
</style>
