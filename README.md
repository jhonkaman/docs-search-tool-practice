# Docs Search Tool Practice

This repo is a prototype for a tool that will allow devs to ask their AI agent where in the docs they can read more about a topic. The goal is to have the agent return the exact fragment/jump link they should visit.

Here's a sample prompt you can use with the tool:

> Where would I learn more about the root route in Tanstack? Use `node fuse-search-tool.js "<json-file-path>" "<search term>"` to find the answer.

Currently, we have JSON files for the Svelte docs and the TanStack Start docs.

## Try It

To try this tool, download or clone this repo. Then run `npm i` to install the packages (the main dependency right now is Fuse.js).

Then try running the sample prompt or modifying it to search for a different topic in the Svelte or TanStack Start docs.

## How This Was Made

Here's how I gathered the data for the TanStack Start pages (the process for Svelte was very similar).

First, I visited https://tanstack.com/start/latest and ran this in the browser console (I had to inspect the sidebar to figure out the right CSS selector to use).

```js
console.log(
  [...document.querySelectorAll('div.text-base:nth-child(2) a')]
    .map(a => a.href)
    .join('\n')
);
```

Then I copied the output into `tanstack.md`. This is all of the main page URLs.

Then I used `scrape-to-js-array-tanstack.js` to create `tanstack-jump-links.json`, which contains all of the fragment/jump links.

Then I used `fuse-test-dynamic.js` to try asking the agent where I can read about certain topics.

## Goal

I think the ultimate goal is to turn the search tool into an agent skill. I would also like to work on turning the JSON file into a standard that documentation sites can adopt to make it easier for devs to find information.

## Alternatives

I considered whether llms.txt or Context7 solved this problem already, but I think those tools are more about returning Markdown for the agent to consume.
