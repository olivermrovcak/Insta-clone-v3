import {RefObject} from "react";

export const onScroll = (callback: () => void, ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
        const {scrollTop, scrollHeight, clientHeight} = ref.current;
        if (scrollHeight - scrollTop - clientHeight < 150) {
                callback();
        }
    }
};