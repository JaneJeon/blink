---
title: Application Structure
sidebar_label: Application Structure
---

_Note: all of the links below are examples! You do not have to set up the domains in this specific way - i.e. using subdomains. Just know that the 3 parts all **can** be hosted in separate domains._

Lynx has three separate components: the server, the frontend SPA, and the CDN (this is also known as the holy trinity). You can hook up analytics to your CDN of choice, but that does not depend on Lynx, and therefore, it is outside of Lynx's stack and you are free to choose whatever analytics solution you want rather than relying solely on the link shortener for analytics.

The CDN is the one that users actually get to interact with. It caches all of the link redirects (https://ex.co/12345 => https://example.com) and serves them ON the "short" domain (https://ex.co). While you technically _could_ serve them on a non-root domain (https://lynx.ex.co), you'd typically expose the CDN on the root domain and fetch the redirects from the Lynx server.

For simplicity's sake (in hosting), the server handles both the redirects (https://ex.co/12345 => https://example.com/fooBar), _and_ the APIs for handling link shortening & user management (the API is hosted at `/api`). Now, you might be thinking, "hang on, isn't CDN the one that serves the redirects?" And the answer is yes! But so does the Lynx server, so that you can host the server on its own _without_ the need for an external CDN - it'll just be slower and have no analytics, _but_ it is simpler to set up.

So when a user hits the CDN (https://ex.co/12345) for the first time, it doesn't know which link to serve. Thus, it hits the "origin server", which is the Lynx server in this case. So it hits the server, which is hosted on a different domain (https://lynx-server.example.com), and requests the link https://lynx-server.example.com/12345. The server then returns a redirect to https://example.com/fooBar, and then that information is served & cached by the CDN.

The frontend only serves as the dashboard for Lynx, and it is hosted separately; but as it is an SPA/static file, it can be easily hosted on S3/netlify/vercel/surge, for free! This also allows you to serve up the dashboard on a different domain from the CDN or the Lynx server (https://lynx-dashboard.example.com) as long as it can talk to the backend. So when you set up the dashboard, it will talk to the `/api` portion of the Lynx server (https://lynx-server.example.com/api) for shortening links and storing user information!
