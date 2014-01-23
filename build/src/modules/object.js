/*---------------
OBJECT sub-module
---------------*/
/**
 * [object description]
 * @type {Object}
 */
_.object = {
    /**
     * [map description]
     * @param  {[type]}   o  [description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    map : function (o, fn) {
        var ret = '', j;
        for (j in o) {
            if (o.hasOwnProperty(j)) {
                ret += fn(o, j, ret);
            }
        }
        return ret;
    }
};
/**
 * [object description]
 * @type {Object}
 */

JMVC.object = {
    /**
     * Clones an object
     * 
     * @param Literal obj
     * @returns cloned Object
     */
    clone : function (obj) {
        var temp,
            key;
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        temp = obj.constructor();
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = this.clone(obj[key]);
            }
        }
        return temp;
    },
    /**
     * [ description]
     * @param  {[type]} obj1 [description]
     * @param  {[type]} obj2 [description]
     * @param  {[type]} ret  [description]
     * @param  {[type]} i    [description]
     * @return {[type]}      [description]
     */
    compare : function (obj1, obj2, ret, i) {
        if (typeof ret === 'undefined') {ret = true; }
        if (!ret) {return 0; }
        if (obj1 + '' !== obj2 + '') {
            return false;
        }
        for (i in obj1) {
            ret = ret && obj2[i] && this.compare(obj1[i], obj2[i], ret);
            if (!ret) {return false; }
        }
        for (i in obj2) {
            ret = ret && obj1[i] && this.compare(obj2[i], obj1[i], ret);
            if (!ret) {return false; }
        }
        return ret;
    },
    /**
     * [ description]
     * @param  {[type]} obj    [description]
     * @param  {[type]} field) {return      (typeof obj === 'object' && obj[field] [description]
     * @return {[type]}        [description]
     */
    contains : function (obj, field) {
        return (typeof obj === 'object' && field in obj);
    },
    /**
     * [ description]
     * @param  {[type]} obj [description]
     * @param  {[type]} ext [description]
     * @return {[type]}     [description]
     */
    extend : function (o, ext) {
        var obj = this.clone(o), j;
        for (j in ext) {
            if (ext.hasOwnProperty(j) && !(j in obj)) {
                obj[j] = ext[j];
            }
        }
        return obj;
    },
    /**
     * [ description]
     * @param  {[type]} obj1 [description]
     * @param  {[type]} obj2 [description]
     * @return {[type]}      [description]
     */
    jCompare : function (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },
    /**
     * [keys description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    keys : function (obj) {
        var res = [], i;
        for (i in obj) {
            res.push(i);
        }
        return res;
    },
    /**
     * [ description]
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    toAttr : function (obj) {
        return _.object.map(obj, function (o, i) {
            return ' ' + i + (o[i] ? '="' + o[i] + '"' : '');
        });
    },
    /**
     * [ description]
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    toCss : function (obj, straight) {
        return _.object.map(obj, function (ob, i) {
            return !!straight ?
                i + '{' + ob[i] + '} '
            :
                i + ' {' + _.object.map(ob[i],
                    function (o, j) {
                        return j + ':' + o[j] + ';';
                    }
                ) + '} ';
        });
    },
    /**
     * [ description]
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    toQs : function (obj) {
        return _.object.map(obj, function (o, i, r) {
            return (r ? '&' : '?') + encodeURIComponent(i) + '=' + encodeURIComponent(o[i]);
        });
    },
    /**
     * [obj2str description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    toStr : function (obj) {
        return _.object.map(obj, function (o, i) {
            return i + ':' + o[i] + ';';
        });
    },
    /**
     * [values description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    values : function (obj) {
        var res = [], i;
        for (i in obj) {
            res.push(obj[i]);
        }
        return res;
    },
};
//-----------------------------------------------------------------------------