   _  __  __ __     __ ____ 
  (_)|  \/  |\ \   / //  __|
  | || |\/| | \ \ / / | |    
  | || |  | |  \ v /  | |__ 
 _/ ||_|  |_|   \_/   \____|
|__/                      

Description: jmvc module

Author: Federico Ghedina


Installation
------------
Thanks to a basic .htaccess JMVC access point is an index.html which loads in the head the main script
and is meant to have empty body, in fact the whole body will be rewritten (see index.html)
NOTE: the `src` attribute of the script must be the absolute url for jmvc.js
All you have to do is, write controllers, models and views.


Features
--------
- cross-browser
- no global variables so no collisions are possible
- url dispatching
- load views and models (synchronous ajax requests, otherwise model eval is late) from a controller
- default controller and action (inherited 'index')
- each view, model or controller has his own hash as private registry to contain variables.
- in views you can write special variable placeholders for other views or for view's variable:
  >	$variable_name$ for variable
  >	{{my_view}} for a view
  > {{my_view name=`Federico` surname=`Ghedina`}}
  these will be replaced with the element content (recursively parsed, within 10 nesting level)
- dynamically load other scripts and stylesheets 
- the content produced by default affects the content of the body, but You can choose to affect
	the content of a node with an ID attribute.
	You can edit the head with some limitations using JMVC.head methods (or your scripts)
- 7.1Kb (packed)
- total warranty for completely seo unfriendly pages
- automatic extra parameters from url
- automatic extra parameters from querystring
- add action routes in the controller
- easily extend the inner main object with your code, from a controller or globally


For further informations visit http://www.jmvc.org/info
