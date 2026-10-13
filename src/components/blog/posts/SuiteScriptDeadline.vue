<template>
    <div class="blog-page">
      <h1>SuiteScript 1.0, 2.0, and 2.x Are on the Clock: Planning for 2028.2</h1>
      <p class="publication-date">Published on: October 13, 2026</p>

      <div class="introduction">
        <p>
          If you've opened a NetSuite account lately and seen a banner nagging you about SuiteScript 2.1, it's not
          just noise. Oracle has published an official timeline for retiring every version of SuiteScript except 2.1.
          By the <strong>2028.2 release</strong>, SuiteScript 1.0, SuiteScript 2.0, and anything annotated
          <code>@NApiVersion 2.0</code> or <code>@NApiVersion 2.x</code> are expected to lose support entirely. If your
          account has been running custom scripts for more than a few years, there's a good chance some of them are
          on that list. Here's what Oracle has actually said, what changes between versions, and how I'd go about
          paying down that tech debt without breaking the business in the process.
        </p>
      </div>

      <div class="content">
        <h2>What Oracle Has Announced</h2>
        <p>
          Oracle's help center now has a full section called
          <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_7161922360.html" target="_blank" rel="noopener">Transitioning to SuiteScript 2.1</a>,
          and it lays out a release-by-release timeline:
        </p>
        <table class="timeline">
          <thead>
            <tr><th>Release</th><th>What happens</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>2026.2</td>
              <td>SuiteScript 2.1 becomes the standard for new <em>and</em> existing scripts.</td>
            </tr>
            <tr>
              <td>2027.1</td>
              <td>SuiteScript 1.0 enters end-of-life support. Only critical issues get fixed. Anything else, you'll be
                told to convert the script to 2.1 first.</td>
            </tr>
            <tr>
              <td>2028.1</td>
              <td>1.0 scripts can no longer be deployed in <em>new</em> accounts (existing accounts can still deploy
                them). 2.0 and 2.x scripts run on the 2.1 runtime by default.</td>
            </tr>
            <tr>
              <td>2028.2</td>
              <td>All new and existing scripts must use SuiteScript 2.1.</td>
            </tr>
          </tbody>
        </table>
        <p>
          We're already past 2026.2, so in Oracle's eyes 2.1 is the standard right now. The 2028.1 milestone is the one
          I'd circle in red. That's when your 2.0 and 2.x scripts start running on the 2.1 engine whether you've
          tested them there or not. If something is going to break, that's when you'll find out. Better to find out in
          a sandbox on your own schedule than in production during a month-end close.
        </p>

        <h2>Why This Isn't Just a Find-and-Replace</h2>
        <p>
          For 2.0 and 2.x scripts, Oracle is clear that the SuiteScript API itself is the same. <code>N/record</code>
          is still <code>N/record</code>. What changes is the <strong>JavaScript runtime underneath it</strong>. 2.1
          runs on a modern engine with modern ECMAScript, and that engine is less forgiving about some habits the old
          engine let slide. Oracle's
          <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html" target="_blank" rel="noopener">Differences Between SuiteScript 2.0 and 2.1</a>
          page is the authoritative list, but the ones I'd look for first are:
        </p>
        <ul>
          <li><strong>Strict mode.</strong> Assigning to a variable you never declared used to quietly create a global.
            In 2.1 it throws.</li>
          <li><strong>Invalid JSON.</strong> <code>JSON.parse</code> on payloads the old engine tolerated (trailing
            commas, for example) can now fail. Keep an eye on anything parsing third-party or hand-built JSON.</li>
          <li><strong>Error objects.</strong> <code>JSON.stringify</code> only picks up enumerable properties, so
            stringifying an error can drop the <code>message</code>. If you log or return errors that way, you may
            suddenly be logging <code>{}</code>.</li>
          <li><strong>Old engine-only syntax.</strong> <code>for each...in</code>, conditional <code>catch</code>
            blocks, and <code>toSource()</code> were never standard JavaScript, and they don't carry over.</li>
          <li><strong>Reserved words.</strong> 2.1 is stricter about variables and properties named after reserved
            words.</li>
          <li><strong>Formatting and parsing.</strong> Local date string formats, <code>parseInt</code>, decimals with
            trailing zeros, and RESTlet POST/return types all have documented differences. These are the sneaky ones
            because nothing throws an error. The output just comes out different.</li>
          <li><strong>Debugging.</strong> 2.1 scripts use the browser debugger instead of the SuiteScript
            debugger.</li>
        </ul>
        <p>
          1.0 is a different story. It's not a runtime tweak, it's a rewrite. Every <code>nlapi*</code> global has
          to be replaced with the right module (<code>nlapiLoadRecord</code> becomes <code>record.load</code>,
          <code>nlapiSearchRecord</code> becomes <code>N/search</code>, and so on). Script types and entry points are
          structured differently, and Oracle notes that some 1.0 APIs don't map directly to anything in 2.1 at all.
          For those you'll need a different approach, not just a new function name.
        </p>

        <h2>Step 1: Know What You Have</h2>
        <p>
          You can't plan what you haven't counted. The quickest look is <strong>Customization &gt; Scripting &gt;
          Scripts</strong>, filtered by <strong>API Version</strong>. For something you can share with the team and
          re-run as you make progress, build a saved search on script records where <strong>API Version is not
          2.1</strong>, with Name, ID, Script Type, API Version, Owner, and Description as result columns. Once
          you have that list, add the columns Oracle won't give you:
        </p>
        <ul>
          <li><strong>Is it deployed and running?</strong> Check deployment status and recent execution logs.</li>
          <li><strong>What business process does it touch?</strong> Billing, revenue, approvals, integrations.</li>
          <li><strong>Who owns it?</strong> Your team, a former consultant, or a SuiteApp vendor.</li>
          <li><strong>Where does the source of truth live?</strong> An SDF project in source control, or only the
            File Cabinet.</li>
        </ul>
        <p>
          Those last two matter more than people expect. Scripts that come from installed SuiteApps and bundles are
          the vendor's job to update, so your job is to ask them for a 2.1 plan in writing. Scripts that a former
          consultant uploaded straight into the File Cabinet are yours, whether you knew it or not.
        </p>

        <h2>Step 2: Triage Before You Migrate</h2>
        <p>
          Oracle gives three options for every legacy script: <strong>update</strong> it,
          <strong>test</strong> it on the 2.1 runtime first, or <strong>retire</strong> it. Retiring is the most
          underrated of those three. Most accounts I've worked in have scripts that are undeployed, duplicated by a
          newer script, or doing something that's now native NetSuite functionality or a workflow. Every script you
          delete is one you never have to migrate, test, or support again.
        </p>
        <p>
          For what's left, rank by risk: business-critical and high-volume scripts first, then integrations and
          anything with complex dependencies (shared libraries especially, since one library can be loaded by a dozen
          scripts), then the long tail of small helpers.
        </p>

        <h2>Step 3: Let the Runtime Tell You What Breaks (2.0 and 2.x)</h2>
        <p>
          This is the single most useful tool Oracle gives you. Under <strong>Setup &gt; Company &gt; Preferences
          &gt; General Preferences</strong> there are two account preferences: <em>Execute SuiteScript 2.0 Server
          Scripts as 2.1</em> and <em>Execute SuiteScript 2.x Server Scripts as 2.1</em>. Flip them in a
          <strong>sandbox</strong>, and your existing server scripts run on the 2.1 engine with no code changes. You
          can switch them back at any time.
        </p>
        <p>
          Then run your real processes end to end and watch the execution logs. If a script runs clean, produces the
          same results, and logs no 2.1 compatibility errors, change its header and move on:
        </p>
        <pre><code class="language-javascript">/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], (record, log) => {
    const beforeSubmit = (context) => {
        // same logic, now officially on 2.1
    };
    return { beforeSubmit };
});</code></pre>
        <p>
          A couple of caveats: the preference covers server scripts only, so client scripts need their own testing
          in the browser. And with the preference on, NetSuite still validates the file against <em>2.0</em> syntax
          rules on upload. You can't start using arrow functions or <code>const</code> until the annotation actually
          says 2.1.
        </p>

        <h2>Step 4: Rewrite 1.0 Deliberately</h2>
        <p>
          For 1.0 scripts, I'd resist the urge to do a line-by-line translation. These scripts are often a decade
          old, and the business process they were written for has usually moved on. Treat each one as a small
          project: write down what it's <em>supposed</em> to do, confirm that with whoever owns the process, then
          build the 2.1 version against that. That's also your chance to fix the things that have probably been
          bugging you for years, like hardcoded internal IDs, searches with no governance checks, and scheduled
          scripts that should really be Map/Reduce.
        </p>

        <h2>Step 5: Use the Tools, but Review Everything</h2>
        <p>
          Oracle has shipped AI tooling aimed squarely at this problem: a <strong>SuiteScript Agent Skill</strong>
          for upgrading 1.0, 2.0, and 2.x scripts and custom objects to 2.1, and the <strong>SuiteCloud Developer
          Assistant</strong> for refactoring and SDF updates. They're genuinely useful for the mechanical parts like
          API mapping and converting <code>var</code> to <code>const</code>. Oracle's own guidance is that every
          generated change has to be reviewed before it goes to production, and I'd go further: the tool doesn't know
          that your sales order script quietly depends on a custom field a workflow sets earlier in the same save.
          Somebody who understands your account does.
        </p>

        <h2>Step 6: Make It Stick</h2>
        <ul>
          <li><strong>Get it into source control.</strong> If your scripts only live in the File Cabinet, use the
            migration as the excuse to pull them into an SDF project. You'll want the history the first time a
            migrated script behaves differently.</li>
          <li><strong>Test entry points, not just files.</strong> Oracle's checklist calls out sublists, searches,
            record operations, data handling, and error handling. Every entry point in a script needs to be exercised,
            including the ones that only fire on edit or delete.</li>
          <li><strong>Roll out in batches.</strong> Move a handful of scripts, watch execution logs and performance
            for a week, then do the next group. Ten changes at once means you won't know which one caused the
            problem.</li>
          <li><strong>Stop adding to the pile.</strong> Every new script, from today on, gets
            <code>@NApiVersion 2.1</code>. Make it part of code review.</li>
          <li><strong>Use Release Preview.</strong> Each release between now and 2028.2 is a chance to catch problems
            in a preview sandbox before your production account is upgraded.</li>
        </ul>
      </div>

      <div class="conclusion">
        <h2>Need a Hand With It?</h2>
        <p>
          Two years sounds like plenty of runway, but between inventory, triage, rewrites, testing, and a release
          cycle that only moves twice a year, 2028.2 will be here sooner than it looks. Teams that start now get to
          migrate on their own schedule. Teams that wait get to do it during a release preview with a deadline
          bearing down.
        </p>
        <p>
          If you'd rather not untangle a decade of SuiteScript on your own, that's exactly the kind of work I do.
          Whether it's auditing your account to figure out what you're dealing with, rewriting a handful of critical
          1.0 scripts, or working through the whole backlog, I'm happy to help wherever you need it.
          <router-link to="/contact">Reach out here</router-link> and let's talk about what's in your account.
        </p>
      </div>
    </div>
  </template>

  <script>
  import Prism from 'prismjs';
  import '@/themes/prism-night-owl.css';
  import 'prismjs/components/prism-javascript';
  export default {
    name: "SuiteScriptDeadlinePost",
    mounted() {
      Prism.highlightAll();
    },
  };
  </script>

  <style scoped>
  .timeline {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 1.4em;
    font-size: 0.95rem;
  }
  .timeline th,
  .timeline td {
    text-align: left;
    vertical-align: top;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
  }
  .timeline th {
    color: var(--text);
    font-weight: 600;
  }
  .timeline td:first-child {
    font-family: var(--font-mono);
    color: var(--mauve);
    white-space: nowrap;
  }
  </style>
