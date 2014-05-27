// type : LIB
//


/**
 * Widgzard extension
 * 
 * Create an arbitrary dom tree json based allowing for each node to 
 * specify a callback that will be called onky when every inner callback
 * will declare to have finished his work.
 *
 * @author Federico Ghedina
 */
JMVC.extend('core/widgzard', function () {
    "use strict";

    JMVC.head.addStyle(JMVC.vars.extensions + 'core/lib/widgzard/widgzard.min.css');

    // clearer class that should provide right
    // css float clearing
    // 
    var clearerClassName = 'clearer',
        noop = function () {},
        load,
        htmlspecialchars;

    /**
     * Main object constructor represeting any node created
     * @param {[type]} conf the object that has the information about the node
     *                      that will be created
     * @param {[type]} trg  the DomNODE where the element will be appended to
     * @param {[type]} mapcnt an object used to allow the access from any node
     *                        to every node that has the gindID attribute
     */
    function Node(conf, trg, mapcnt) {

        // save a reference to the instance
        // 
        var self = this,

            // the tag used for that node can be specified in the conf
            // otherwise will be a div (except for 'clearer') 
            // 
            tag = conf.tag || "div";

        // save a reference to the target parent for that node
        // by means of the callback promise chain, in fact the 
        // real parent for the node can even be different as 
        // specified in the conf.target value
        // 
        this.target = trg;

        // create the node
        // 
        this.node = document.createElement(tag);

        // save a reference to the node configuration
        // will be useful on append to append to conf.target
        // if specified
        //
        this.conf = conf;

        // save a reference to the node callback if speficied
        // otherwise create a function that do nothing but
        // freeing the parent promise from waiting
        //
        this.node.cb = conf.cb || function () {
            // autoresolve
            self.node.resolve();
        };

        // save a reference to a brand new Promise
        // the Promise.node() will be called as far as
        // all the child elements cb have called 
        // this.done OR this.resolve
        // 
        this.node.promise = new JMVC.Promise();

        // When called Promise.done means that 
        // the parent callback can be called
        // delegating the parent context
        //
        this.node.promise.then(trg.cb, trg);

        // as said at the begibbibg every node keeps a reference
        // to a function that allow to get a reference to any
        // node that in his configuration has a 'wid' value
        // specified
        //
        this.map = mapcnt.map;
        this.node.getNode = mapcnt.getNode;

        // how many elements are found in the content field?
        // that counter is fundamental for calling this node
        // callback only when every child callback has done
        // 
        this.node.len = conf.content ? conf.content.length : 0;

        // through these two alias from within a callback
        // (where the DOMnode is passed as context)
        // the have to declare that has finished
        // if the count is nulled it means that the promise 
        // is done, thus it`s safe to call its callback
        //
        this.node.done = this.node.resolve = function () {
          
            // if all the child has called done/resolve
            // it`s time to honour the node promise,
            // thus call the node callback
            // 
            --self.target.len == 0 && self.node.promise.done();
        };
    }

    /**
     * Set neo attributes
     * @param {DOMnode} node  the node
     * @param {Object} attrs  the hash of attributes->values
     */
    Node.prototype.setAttrs = function (node, attrs) {
        // if set, append all attributes (*class)
        // 
        if (typeof attrs !== 'undefined') { 
            for (var j in attrs) {
                if (j !== 'class') {
                    node.setAttribute(j, attrs[j]);
                } else {
                    node.className = attrs[j];
                }
            }
        }
        return this;
    };

    /**
     * Set node inline style
     * @param {DOMnode} node  the node
     * @param {Object} style  the hash of rules
     */
    Node.prototype.setStyle = function (node, style) {

        // 'listStyleType'.replace(/([A-Z])/g, function (s){return '-' + s.toLowerCase()})

        // if set, append all styles (*class)
        //
        if (typeof style !== 'undefined') { 
            for (var j in style) {
                node.style[j.replace(/^float$/, 'cssFloat')] = style[j];
            }
        }
        return this;
    };

    /**
     * Set node data
     * @param {DOMnode} node  the node
     * @param {Object} data   the hash of properties to be attached
     */
    Node.prototype.setData = function (node, data) {
        node.data = data || {};
        return this;
    };
    
    /**
     * add method for the Node
     */
    Node.prototype.add = function () {

        var conf = this.conf,
            node = this.node,
            j;

        // set attributes & styles & data
        // 
        this.setAttrs(node, conf.attrs)
            .setStyle(node, conf.style)
            .setData(node, conf.data);

        // if `html` key is found on node conf 
        // inject its value
        //
        typeof conf.html !== 'undefined' && (node.innerHTML = conf.html);

        // if the node configuration has a `grindID` key
        // (and a String value), the node can be reached 
        // from all others callback invoking
        // this.getNode(keyValue)
        //
        typeof conf.wid !== 'undefined' && (this.map[conf.wid] = node);

        // if the user specifies a node the is not the target 
        // passed to the constructor we use it as destination node
        // (node that in the constructor the node.target is always
        // the target passed)
        // 
        (conf.target || this.target).appendChild(node);

        // if the node configuration do not declares content array
        // then the callback is executed.
        // in the callback the user is asked to explicitly declare
        // that the function has finished the work invoking
        // this.done() OR this.resolve()
        // this is the node itself, those functions are attached
        // 
        !conf.content && node.cb.call(node);

        return this.node;
    };



    /**
     * Public function to render Dom from Json
     * @param  {Object} params the configuration json that contains all the 
     *                         information to build the dom within the target
     *                         node, and to manage the callback tree
     * @param  {[type]} target the root DOMnode where the structure
     *                         will be attached
     * @return {undefined}
     */
    function render (config, clean) {

        // reference to the requested target, if present
        var target;

        if (!config) {
            throw new Error({message : 'ERROR : Check parameters for render function'});
        }

        // or body
        target = config.target || document.body;

        // noop cb if not given
        //
        (config.cb && typeof config.cb === 'function') || (config.cb = noop);

        // a literal used to save a reference 
        // to all the elements that need to be 
        // reached afterward calling this.getNode(id)
        // from any callback
        // 
        var inner = {
            map : {},
            getNode : function (id) {
                return inner.map[id] || false;
            }
        };


        // rape Node prototype funcs
        // to set attributes & styles
        // and attached data
        // 
        Node.prototype
            .setAttrs(target, config.attrs)
            .setStyle(target, config.style)
            .setData(target, config.data);
        
        // clean if required
        if (!!clean) {
            target.innerHTML = '';
        }
        
        // initialize the root node to reflect what will be done
        // by the Node contstructor to every build node: 
        // 
        // - len : the lenght of the content array
        // - cb : exactly the callback
        // 
        target.len = config.content.length;
        target.cb = config.cb || function () {};

        // allow to use getNode from root
        // 
        target.getNode = inner.getNode;

        // start recursion
        // 
        // start recursion
        // 
        (function recur(cnf, trg){
            
            // change the class if the element is simply a "clearer" String
            // 
            if (cnf.content) {
                var nodes = [],
                    postpro = !!cnf.sameHeight,
                    h = 0,
                    skip = false;

                for (var n, i = 0, l = cnf.content.length; i < l; i++) {

                    if (cnf.content[i] === clearerClassName) {
                        skip = true;
                        cnf.content[i] = {
                            tag : 'br',
                            attrs : {'class' : clearerClassName}
                        };
                    }
                    n = new Node(cnf.content[i], trg, inner).add();
                    
                    if (postpro && !skip) {
                        nodes.push(n);
                        h = Math.max(h, JMVC.css.height(n));
                    }
                    
                    recur(cnf.content[i], n);
                }

                if (postpro) {
                    for (var j = 0, l = nodes.length; j < l; j++) {
                        nodes[j].style.height = h + 'px';
                    }
                }
            }
            
        })(config, target);


        /*
        REPLACE WITH THAT FUNCTION IF sameHeight IS NOT USEFUL
        
        (function recur(cnf, trg){
            
            // change the class if the element is simply a "clearer" String
            // 
            if (cnf.content) {

                for (var i = 0, l = cnf.content.length; i < l; i++) {

                    if (cnf.content[i] === 'clearer') {
                        cnf.content[i] = {
                            tag : 'br',
                            attrs : {'class':'clearer'}
                        };
                    }
                    
                    recur(
                        cnf.content[i],
                        new Node(cnf.content[i], trg, inner).add()
                    );
                }
            }
        })(params, target);
        */
    }


    load = function (src) {
        var s = document.createElement('script');
        document.getElementsByTagName('head')[0].appendChild(s);
        s.src = src;
        
        // when finished remove the script tag
        //
        s.onload = function () {
            s.parentNode.removeChild(s);
        }
    };

    htmlspecialchars = function (c) {
        return '<pre>' +
            c.replace(/&(?![\w\#]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;'); +
            '</pre>';
    };


    // publish module
    return {
        render : render,
        load : load,
        htmlspecialchars : htmlspecialchars
    };

}); 