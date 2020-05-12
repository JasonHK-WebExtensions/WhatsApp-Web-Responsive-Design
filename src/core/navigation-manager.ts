import EventEmitter from "eventemitter3";

import { Page } from "./page";

export class NavigationManager extends EventEmitter<NavigationManagerEventsMap>
{
    private readonly _observer: MutationObserver;
    private _currentPage: Page = Page.UNKNOWN;

    public get currentPage(): Page { return this._currentPage; }

    public constructor()
    {
        super();

        this._observer = new MutationObserver(this._onMutation.bind(this));
    }

    public disable(): void
    {
        this._observer.disconnect();
    }

    public enable(target: Node): void
    {
        this._observer.observe(
            target,
            {
                subtree: true,
                childList: true,
            });
    }

    private _navigate(page: Page): void
    {
        if (page !== this._currentPage)
        {
            this._currentPage = page;
            this.emit("navigate", page, this);
        }
    }

    private _onMutation(mutations: MutationRecord[]): void
    {
        for (const mutation of mutations)
        {
            for (const node of mutation.addedNodes)
            {
                if (node instanceof HTMLElement)
                {
                    if (node.classList.contains("app-wrapper-web") || (node.id === "startup"))
                    {
                        let isLoadingPage = (node.id === "startup");

                        if (!isLoadingPage)
                        {
                            for (const child of node.childNodes)
                            {
                                if ((child instanceof HTMLElement) && (child.id === "startup"))
                                {
                                    isLoadingPage = true;
                                    break;
                                }
                            }
                        }

                        if (isLoadingPage)
                        {
                            this._navigate(Page.LOADING_PAGE);
                        }
                    }
                    else if (node.classList.contains("landing-wrapper"))
                    {
                        this._navigate(Page.LANDING_PAGE);
                    }
                    else if (node.classList.contains("app"))
                    {
                        this._navigate(Page.MAIN_PAGE);
                    }
                }
            }
        }
    }
}

interface NavigationManagerEventsMap
{
    navigate: [Page, NavigationManager];
}
