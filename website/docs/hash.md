---
title: Shortening Links
sidebar_label: Shortening Links
---

You can shorten links by pasting it into the search bar. If that link is already shortened, then the shortener will simply return that shortened link instead. Note that the links are normalized and "cleaned up" (e.g. strip off www, force https) before being compared, so http://www.example.com and https://example.com would both map to the same shortened URL.

Links can have up to two shortened versions. One is the auto-generated link ("shortened URL") that will only be made up of alphabets (`a-zA-Z`) and numbers (`0-9`). However, you can optionally create a "branded URL" with any hash (the trailing part of the URL) that you want - as long as it doesn't conflict with existing URLs! So when shortening http://www.example.com, not only do you get the shortened URL - https://ex.co/aBcD3 - but you can also choose a different, custom hash - say, https://ex.co/hello_world, or https://ex.co/💯🔥wootwoot - consisting of ANY UTF-8 characters (including emojis, non-English letters, and the likes) to point to that original URL!
