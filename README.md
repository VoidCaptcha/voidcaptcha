VoidCaptcha - Sends the bots into the void
==========================================
**VoidCaptcha** is a free and open source self-hosted multi-solution CAPTCHA library, which provides 
different well-known and tested types and modes such as text and image recognition, slider puzzles, 
proof-of-work (PoW) technique and more.

**VoidCaptcha** is highly configurable and allows to create a perfect CAPTCHA solution, suitable for 
your website-specific target visitors. You can also change the design and appearance to fit your 
native theme and corporate design and you don't have to worry about GDPR or any other privacy law, 
because **you host everything on your own server**. We do not provide a public SaaS solution, 
however we still provide some "private" SaaS access for a few european companies and people.

**Still not convinced?**
- Visit [voidcaptcha.com](https://voidcaptcha.com) for more details
- Read more about [all the Features of VoidCaptcha](https://voidcaptcha.com/features)
- Play around in our [online Playground](https://playground.voidcaptcha.com)
- Find a solution [to integrate VoidCaptcha on your Website](https://playground.voidcaptcha.com/integrate)
- Ask for help [on our official Forum](https://help.voidcaptcha.com) or [write us a mail](mailto:help@voidcaptcha.com)


VoidCaptcha Packages
--------------------
**This repository contains the JavaScript part of VoidCaptcha**, to get VoidCaptcha working you need 
an corresponding back-end library or a respective plugin / module for your Content Management 
System or Application Framework. The following list contains all official libraries and extensions:

**Front-End**
- `[X]` [VoidCaptcha - Frontend JavaScript Library](https://github.com/VoidCaptcha/voidcaptcha) <- **You're here**

**Back-End Libraries**
- `[ ]` [VoidCaptcha - node.js Library](https://github.com/VoidCaptcha/voidcaptcha.js)
- `[ ]` [VoidCaptcha - PHP Library](https://github.com/VoidCaptcha/voidcaptcha.php)
- `[ ]` [VoidCaptcha - Python Library](https://github.com/VoidCaptcha/voidcaptcha.py)

**CMS Plugins**
- `[ ]` PHP: [VoidCaptcha for OctoberCMS](https://github.com/VoidCaptcha/oc-voidcaptcha-plugin)
- `[ ]` PHP: [VoidCaptcha for WordPress](https://github.com/VoidCaptcha/wp-voidcaptcha-plugin)
- `[ ]` Python: [VoidCaptcha for DjangoCMS](https://github.com/VoidCaptcha/django-cms-voidcaptcha)
- `[ ]` Python: [VoidCaptcha for Wagtail](https://github.com/VoidCaptcha/wagtail-voidcaptcha)

**Framework Extensions**
- `[ ]` PHP: [VoidCaptcha for Laravel/Lumen](https://github.com/VoidCaptcha/laravel-voidcaptcha)
- `[ ]` PHP: [VoidCaptcha for SlimPHP](https://github.com/VoidCaptcha/slim-voidcaptcha)
- `[ ]` Python: [VoidCaptcha for Django](https://github.com/VoidCaptcha/django-voidcaptcha)


Available CAPTCHAs
------------------
**VoidCaptcha** differentiates between active and passive CAPTCHAs. Active types always require some 
kind of user interaction, while passive ones do the work in the background. **VoidCaptcha** requires 
at least one active CAPTCHA type, at least as a fallback when the passive ones do not reach an 
appropriate 'humanity score'.

**Active Types**
- `VoidCaptcha_Image` - Find images to a similar one or a description.
- `VoidCaptcha_Slider` - Slide a piece of an image to the right position.
- `VoidCaptcha_Text` - A simple obscure styled text-image.

**Passive Types**
- `VoidCaptcha_Detect` - Detected common browser details and track user interactions (GDPR friendly).
- `VoidCaptcha_Pow` - Proof-of-Work technique.


Available Versions
------------------
PureCAPTCHA is written fully in TypeScript and compiled in a few different versions:

- `js/pure-captcha[.min].js` - ES5-compiled vanilla JavaScript
- `js/pure-captcha-20[.min].js` - ES2020-compiled vanilla JavaScript (Supports modern browsers only)
- `es/pure-captcha[.min].js` - ES6-compiled ES-Module
- `es/pure-captcha-20[.min].js` - ES2020-compiled ES-Module (Supports modern browsers only)
- `webc/pure-captcha[.min].js` - ES6-compiled WebComponent
- `webc/pure-captcha-20[.min].js` - ES2020-compiled WebComponent (Supports modern browsers only)


Copyright & License
-------------------
VoidCaptcha, all official VoidCaptcha packages and the official VoidCaptcha websites 
(https://void-captcha.com) has been written and are currently maintained by [rat.md](https://rat.md).

All VoidCaptcha packages are published under the MIT license, see LICENSE.md for more details.
