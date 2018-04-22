var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as stringify_ from 'json-stringify-pretty-compact';
import { isArray, isObject, isString } from 'vega-util';
var stringify = stringify_.default || stringify_;
export var DEFAULT_OPTIONS = {
    /**
     * X offset.
     */
    offsetX: 10,
    /**
     * Y offset.
     */
    offsetY: 10,
    /**
     * ID of the tooltip element.
     */
    id: 'vg-tooltip-element',
    /**
     * ID of the tooltip CSS style.
     */
    styleId: 'vega-tooltip-style',
    /**
     * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
     *
     * There are two predefined themes: "light" (default) and "dark".
     */
    theme: 'light',
    /**
     * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
     */
    disableDefaultStyle: false,
    /**
     * HTML sanitizer function that removes dangerous HTML to prevent XSS.
     *
     * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
     */
    sanitize: escapeHTML,
};
var STYLE = "\n.vg-tooltip {\n  visibility: hidden;\n  padding: 8px;\n  position: fixed;\n  z-index: 1000;\n  font-family: sans-serif;\n  font-size: 11px;\n  border-radius: 3px;\n  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);\n\n  /* The default theme is the light theme. */\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black;\n}\n.vg-tooltip.visible {\n  visibility: visible;\n}\n.vg-tooltip h2 {\n  margin-top: 0;\n  margin-bottom: 10px;\n  font-size: 13px;\n}\n.vg-tooltip table {\n  border-spacing: 0;\n}\n.vg-tooltip td {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n.vg-tooltip td.key {\n  color: #808080;\n  max-width: 150px;\n  text-align: right;\n  padding-right: 4px;\n}\n.vg-tooltip td.value {\n  max-width: 200px;\n  text-align: left;\n}\n\n/* Dark and light color themes */\n.vg-tooltip.dark-theme {\n  background-color: rgba(32, 32, 32, 0.9);\n  border: 1px solid #f5f5f5;\n  color: white;\n}\n.vg-tooltip.dark-theme td.key {\n  color: #bfbfbf;\n}\n\n.vg-tooltip.light-theme {\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black;\n}\n.vg-tooltip.light-theme td.key {\n  color: #808080;\n}\n";
/**
 * Escape special HTML characters.
 *
 * @param value A string value to escape.
 */
export function escapeHTML(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 * @param sanitize A sanitization function that removes dangerous HTML.
 */
function formatValue(value, sanitize) {
    if (isArray(value)) {
        return "[" + value.map(function (v) { return sanitize(isString(v) ? v : stringify(v)); }).join(', ') + "]";
    }
    if (isObject(value)) {
        var content = '';
        var _a = value, title = _a.title, rest = __rest(_a, ["title"]);
        if (title) {
            content += "<h2>" + title + "</h2>";
        }
        content += '<table>';
        for (var _i = 0, _b = Object.keys(rest); _i < _b.length; _i++) {
            var key = _b[_i];
            var val = rest[key];
            if (isObject(val)) {
                val = stringify(val);
            }
            content += "<tr><td class=\"key\">" + sanitize(key) + ":</td><td class=\"value\">" + sanitize(val) + "</td></tr>";
        }
        content += "</table>";
        return content;
    }
    return sanitize(String(value));
}
/**
 * The tooltip handler class.
 */
var Handler = /** @class */ (function () {
    /**
     * Create the tooltip handler and initialize the element and style.
     *
     * @param opt Tooltip Options
     */
    function Handler(options) {
        this.options = __assign({}, DEFAULT_OPTIONS, options);
        this.call = this.handler.bind(this);
        // append a default stylesheet for tooltips to the head
        if (!this.options.disableDefaultStyle && !document.getElementById(this.options.styleId)) {
            var style = document.createElement('style');
            style.setAttribute('id', this.options.styleId);
            style.innerHTML = STYLE;
            document.querySelector('head').appendChild(style);
        }
        // append a div element that we use as a tooltip unless it already exists
        var el = document.getElementById(this.options.id);
        if (el) {
            this.el = el;
        }
        else {
            this.el = document.createElement('div');
            this.el.setAttribute('id', this.options.id);
            this.el.classList.add('vg-tooltip');
            document.querySelector('body').appendChild(this.el);
        }
    }
    /**
     * The handler function.
     */
    Handler.prototype.handler = function (handler, event, item, value) {
        // console.log(handler, event, item, value);
        if (event.vegaType === undefined) {
            this.el.classList.remove('visible', this.options.theme + "-theme");
            return;
        }
        // set the tooltip content
        this.el.innerHTML = formatValue(value, this.options.sanitize);
        // make the tooltip visible
        this.el.classList.add('visible', this.options.theme + "-theme");
        // position the tooltip
        var tooltipWidth = this.el.getBoundingClientRect().width;
        var x = event.clientX + this.options.offsetX;
        if (x + tooltipWidth > window.innerWidth) {
            x = event.clientX - this.options.offsetX - tooltipWidth;
        }
        var tooltipHeight = this.el.getBoundingClientRect().height;
        var y = event.clientY + this.options.offsetY;
        if (y + tooltipHeight > window.innerHeight) {
            y = +event.clientY - this.options.offsetY - tooltipHeight;
        }
        this.el.setAttribute('style', "top: " + y + "px; left: " + x + "px");
    };
    return Handler;
}());
export { Handler };
/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function (view, opt) {
    var handler = new Handler(opt);
    view.tooltip(handler.call);
    return handler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEtBQUssVUFBVSxNQUFNLCtCQUErQixDQUFDO0FBRTVELE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV4RCxJQUFNLFNBQVMsR0FBSSxVQUFrQixDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUM7QUFFNUQsTUFBTSxDQUFDLElBQU0sZUFBZSxHQUFHO0lBQzdCOztPQUVHO0lBQ0gsT0FBTyxFQUFFLEVBQUU7SUFFWDs7T0FFRztJQUNILE9BQU8sRUFBRSxFQUFFO0lBRVg7O09BRUc7SUFDSCxFQUFFLEVBQUUsb0JBQW9CO0lBRXhCOztPQUVHO0lBQ0gsT0FBTyxFQUFFLG9CQUFvQjtJQUU3Qjs7OztPQUlHO0lBQ0gsS0FBSyxFQUFFLE9BQU87SUFFZDs7T0FFRztJQUNILG1CQUFtQixFQUFFLEtBQUs7SUFFMUI7Ozs7T0FJRztJQUNILFFBQVEsRUFBRSxVQUFVO0NBQ3JCLENBQUM7QUFJRixJQUFNLEtBQUssR0FBRywyc0NBOERiLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxxQkFBcUIsS0FBYTtJQUN0QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gscUJBQXFCLEtBQVUsRUFBRSxRQUFtQztJQUNsRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLE1BQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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