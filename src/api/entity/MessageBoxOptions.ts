export default interface MessageBoxOptions {
    /**
     * Content of the message box.
     */
    message: string;
    /**
     * Can be `"none"`, `"info"`, `"error"`, `"question"` or `"warning"`. On Windows,
     * `"question"` displays the same icon as `"info"`, unless you set an icon using
     * the `"icon"` option. On macOS, both `"warning"` and `"error"` display the same
     * warning icon.
     */
    type?: string;
    /**
     * Array of texts for buttons. On Windows, an empty array will result in one button
     * labeled "OK".
     */
    buttons?: string[];
    /**
     * Index of the button in the buttons array which will be selected by default when
     * the message box opens.
     */
    defaultId?: number;
    /**
     * Pass an instance of AbortSignal to optionally close the message box, the message
     * box will behave as if it was cancelled by the user. On macOS, `signal` does not
     * work with message boxes that do not have a parent window, since those message
     * boxes run synchronously due to platform limitations.
     */
    signal?: AbortSignal;
    /**
     * Title of the message box, some platforms will not show it.
     */
    title?: string;
    /**
     * Extra information of the message.
     */
    detail?: string;
    /**
     * If provided, the message box will include a checkbox with the given label.
     */
    checkboxLabel?: string;
    /**
     * Initial checked state of the checkbox. `false` by default.
     */
    checkboxChecked?: boolean;
    icon?: string;
    /**
     * Custom width of the text in the message box.
     *
     * @platform darwin
     */
    textWidth?: number;
    /**
     * The index of the button to be used to cancel the dialog, via the `Esc` key. By
     * default this is assigned to the first button with "cancel" or "no" as the label.
     * If no such labeled buttons exist and this option is not set, `0` will be used as
     * the return value.
     */
    cancelId?: number;
    /**
     * On Windows Electron will try to figure out which one of the `buttons` are common
     * buttons (like "Cancel" or "Yes"), and show the others as command links in the
     * dialog. This can make the dialog appear in the style of modern Windows apps. If
     * you don't like this behavior, you can set `noLink` to `true`.
     */
    noLink?: boolean;
    /**
     * Normalize the keyboard access keys across platforms. Default is `false`.
     * Enabling this assumes `&` is used in the button labels for the placement of the
     * keyboard shortcut access key and labels will be converted so they work correctly
     * on each platform, `&` characters are removed on macOS, converted to `_` on
     * Linux, and left untouched on Windows. For example, a button label of `Vie&w`
     * will be converted to `Vie_w` on Linux and `View` on macOS and can be selected
     * via `Alt-W` on Windows and Linux.
     */
    normalizeAccessKeys?: boolean;
}