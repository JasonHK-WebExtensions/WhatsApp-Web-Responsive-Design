import { CORE_SCRIPT_PATH } from "./constants";
import { injectScript } from "./inject-script";

injectScript(browser.runtime.getURL(CORE_SCRIPT_PATH));
