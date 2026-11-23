This is the first entry in the build log. Everything on this board is plain HTML, CSS and JavaScript, so there is no build step and nothing to install.

## How posts work

Each post is a Markdown file in the `posts/` folder, plus one entry in `config.js` that gives it a title, date, tags and a one-line summary. The file name has to match the `slug` in that entry.

1. Create `posts/my-new-post.md` and write the post.
2. Add an entry to the `posts` list in `config.js` with `slug: "my-new-post"`.
3. Commit and push. GitHub Pages redeploys in about a minute.

## What you can write

Headings, **bold**, *italics*, `inline code`, [links](https://example.com), lists, quotes, horizontal rules and fenced code blocks all work.

```c
// blink an LED: the hello world of hardware
void loop(void) {
    gpio_toggle(LED_PIN);
    delay_ms(500);
}
```

> Write about what broke and what you changed. That is the part worth reading.

Images go in `posts/img/` and are added like this: `![diagram of the setup](posts/img/setup.png)`.

---

Delete this post and the draft home lab post once you have your own.
