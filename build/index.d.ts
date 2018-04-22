import { TooltipHandler, View } from 'vega-typings';
export declare const DEFAULT_OPTIONS: {
    offsetX: number;
    offsetY: number;
    id: string;
    styleId: string;
    theme: string;
    disableDefaultStyle: boolean;
    sanitize: typeof escapeHTML;
};
export declare type Options = typeof DEFAULT_OPTIONS;
/**
 * Escape special HTML characters.
 *
 * @param value A string value to escape.
 */
export declare function escapeHTML(value: string): string;
/**
 * The tooltip handler class.
 */
export declare class Handler {
    /**
     * The handler function. We bind this to this function in the constructor.
     */
    call: TooltipHandler;
    /**
     * Complete tooltip options.
     */
    private options;
    /**
     * The tooltip html element.
     */
    private el;
    /**
     * Create the tooltip handler and initialize the element and style.
     *
     * @param opt Tooltip Options
     */
    constructor(options?: Partial<Options>);
    /**
     * The handler function.
     */
    private handler(handler, event, item, value);
}
/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function (view: View, opt?: Partial<Options>): Handler;
