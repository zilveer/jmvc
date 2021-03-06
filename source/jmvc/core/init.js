
/*
 INIT
 */
/* eslint-disable */
$$core/onError.js$$
/* eslint-enable */

/* eslint-disable no-unused-vars */

// store starting time, that's not truly the starting time but
// it's really next to the real value
var timeBegin = +new Date(),

    // version (vars.json)
    JMVC_VERSION = '$version$',

    // review (vars.json)
    JMVC_DATE = '__DATE__',

    // review (vars.json)
    JMVC_TIME = '__TIME__',

    // inner jmvc literal, will contain almost all the functions used to
    // compose the $JMVC object and thus the returning JMVC
    jmvc = {},

    // url separator
    US = '/',

    /*
    in some cases is useful to automatically distinguish between a
    developing url and production url (ex: analytics extension)
    will be returned in a var container accessible from the JMVC object
    through JMVC.vars.baseurl & JMVC.vars.devurl
    */
    DEV_URL = WDL.protocol + US + US + 'www.jmvc.dev',
    PROD_URL = WDL.protocol + US + US + 'www.jmvc.org',
    DEV_URL_STATIC = WDL.protocol + US + US + 'static.jmvc.dev',
    PROD_URL_STATIC = WDL.protocol + US + US + 'static.jmvc.org',

    /**
     * paths for
     * extensions: used as basepath by JMVC.require
     * test: tests
     * lang: lang files
     * @type {Object}
     */
    PATHS = {

        /**
         * extensions path, used as base path in the JMVC.require function
         * @type {[type]}
         */
        ext: US + 'app' + US + 'extensions' + US,

        /**
         * test suite path, every controller matching "test_foocontroller"
         * will automatically load the test suite and
         *
         * foocontroller.js will be
         * searched into the /app/controller/test directory
         * @type {[type]}
         */
        test: US + 'app' + US + 'testsuite' + US,

        /**
         * path for lang files, loaded with the JMVC.lang function
         * @type {[type]}
         */
        lang: US + 'app' + US + 'i18n' + US,

        /**
         * path for engy component files, engy requires widgzard v.2
         * @type {[type]}
         */
        engyComponents: US + 'app' + US + 'components' + US
    },

    /**
     * extensions for relevant mvc files
     */
    JMVC_EXT = {
        controller: '.js',
        model: '.js',
        view: '.html',
        interface: '.interface.js'
    },

    /*
     * all these extensions can be used in the url
     * pay attention to the order
     *
     * @type {Array}
     */
    URL_ALLOWED_EXTENSIONS = [
        'asp', 'do', 'deinemutter', 'exe', 'html', 'htm',
        'java', 'jmvc', 'jsp', 'js', 'jeti', 'j', 'ninja',
        'milfhunter', 'milf', 'mvc', 'ohmygod', 'omg', 'php', 'wtf',
        'whathafuck', 'trojan'
    ],
    //
    /**
     * default values for controller & action
     * @type {Object}
     */
    JMVC_DEFAULT = {
        controller: 'index',
        action: 'index'
    },

    /**
     * dispather function result
     * here will be stored relevant results returned from the dispatcher function
     * used to parse the current url for getting all is needed to now how to get
     * the right response
     */
    dispatched,

    /* MVC basic constructors */
    Controller,
    Model,
    View,
    Interface,

    /**
     * the parser object, used for replacing all available placeholders
     * (views, views variables, chunks, snippets)
     */
    Parser,

    // Some useful constructors
    Pipe,
    Event,
    Promise,
    Errors,
    Channel,
    Extension,
    FunctionQueue,

    // in case some modules need to be always
    // loaded here's the place to set them
    Modules = [
        'vendors/google/analytics/analytics',
        'core/lib/widgzard/widgzard'
        // 'core/cookie/cookie'
    ],

    // preloader
    preload,

    // hooks literal used to execute callbacks as far as some relevant event are fired
    // starting fron the request and ending with the document rendering end
    hooks = {},

    // a literal to store loaded lang files
    defaultlang = 'en',

    currentlang = defaultlang,

    //
    // getmode used in the require function
    // ajaxsync         : use xhr to get the source and evals
    // ajaxasync         : no...it does not work for the moment
    // script       : creates a script tag with the right url to the source, unsafe sync
    // scriptghost  : same as script but removes all injected script from the DOM after load, same problem
    // NOTE > it seems like script mode load faster but ...
    getmode = 'ajaxsync', // {ajax, script, scriptghost}
    //
    // ===========================================
    //
    returnTrue = function () { return true; },
    returnFalse = function () { return false; };
    // -----------------------------------------------------------------------------
