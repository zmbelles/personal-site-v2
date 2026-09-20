<template>
  <!--
    Drawn rather than typed: the ☕ emoji renders as a flat grey blob in the
    monochrome fallback font on Windows, and it cannot take currentColor.
  -->
  <svg
    class="ci"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 10h13v5.5A4.5 4.5 0 0 1 12.5 20h-4A4.5 4.5 0 0 1 4 15.5V10Z" />
    <path d="M17 11.5h1.25a2.25 2.25 0 0 1 0 4.5H17" />
    <path d="M8 3v2.5M12 2.5V5.5M16 3v2.5" />
  </svg>
</template>

<style scoped>
.ci {
  width: 1em;
  height: 1em;
  flex: none;
}
</style>
