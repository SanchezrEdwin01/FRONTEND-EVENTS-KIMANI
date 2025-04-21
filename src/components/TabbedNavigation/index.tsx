import React, {memo} from 'react'
import cn from "classnames";
import "./index.scss";

type Tab = {
    onClick: (e: Event) => void;
    title: string;
};
type Props = {
    tabs: Array<Tab>;
    active: string;
    children: Children;
};

const TabbedNavigation = ((props: Props) => {
    const { tabs, active } = props;
    return (
        <nav className="tabs">
            {tabs?.map((tab, key) => (
                <div
                    key={key}
                    className={cn([
                       "tab",
                        { "active": tab?.title === active },
                    ])}
                    onClick={(e) => tab?.onClick && tab?.onClick(e)}>
                    {tab?.title}
                </div>
            ))}
        </nav>
    );
});
export default memo(TabbedNavigation);