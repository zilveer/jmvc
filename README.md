[![bitHound Overall Score](https://www.bithound.io/github/fedeghe/jmvc/badges/score.svg)](https://www.bithound.io/github/fedeghe/jmvc)  

JMVC
====

Description
-----------
JMVC is a javascript module that implement the MVC architecture and is enhanced with basic utilities.

Getting started
---------------
Copy the content of the repository in the root of an Apache virtual host,  
 otherwise **absolutely only for development** fire up the inner node minimal dummy server executing  
`node server.js`  
from the `srv/` folder, then add  
/*`foo.dev    127.0.0.1`  *
to your *hosts* file
edit the *srv/config.json* file to fill out the true path for the webroot  
visit *http://www.foo.dev:8080*  
If you feel more comfortable with port 80, amend it in the *srv/config.json* file, but remember that if port is under 1024, only root will start the server successfully)

Start looking at the *app/controllers/index.js* controller.
Start writing your own controllers, models and views.


Samples
-------
The whole <a href="http://www.jmvc.org/" target="_blank">JMVC homepage</a> matches **exactly** the repository content,
the <a href="http://www.jmvc.org/demo.jmvc" target="_blank">demo controller</a> will break the ice.

Api
---
The <a href="http://www.jmvc.org/api" target="_blank">JMVC api</a> section needs to be completed, even some signatures are inconsistent. Soon will be completed and
even all the test will be available.

Features
--------
- One global variable
- Cross-browser (at the moment JMVC is not completely IE friendly, as almost everyone)
- Includes many useful utilities: ajax, dom manipulation, event binding, etc...
- Default _index_ controller and action (configurable)
- In views you can write special variable placeholders in a View to render another View on the fly or to assign a value to a View`s variable
- Dinamically load other scripts and stylesheets, both parsable, so they can depend on Your variables
- Optimize Extensions dependencies using the JMVC.require function
- Get all parameters from url
- Easily extend the JMVC object with your code
- Allow any file extension You prefer in the url... I know You noticed the .jmvc extension in this page url
- Handle 404 Status for requests not matching a route rendering an error View and redirecting after three seconds to the default route
- Easily enque callbacks to some predefined hooks :onBeforeRender, onAfterRender, onBeforeParse, onAfterParse (i18n works thanks to a hook)
- Allow private function in controllers, and some *magics*: controller before & after, action before & after, wildcard action.
- Many ready to use extensions, wrappers and widget.
- File sizes
  - 11.5 KB jmvc.min.js (gzipped and packed version, base62 encode, shrinked variables)
  - 24.6 KB jmvc.js (gzipped, development version, fully commented)

For further informations visit <a href="http://www.jmvc.org/info" target="_blank">jmvc.org/info.jmvc</a>
