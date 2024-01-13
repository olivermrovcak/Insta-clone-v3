import React from 'react';
import ReactPlayer from 'react-player';

export default function AttachmentRender({url}: any) {
    if (!url) return <></>;

    if (url.includes("mp4")) {
        return <div className='relative !z-[1] rounded-xl overflow-y-hidden my-2'>
            <ReactPlayer
                url={url}
                className=' !z-[0]'
                width='100%'
                height='100%'
                controls // This prop is to display video controls like play, pause, etc.
            />
        </div>
    }

    return (
        <>
            <img className="rounded-xl  w-full my-2" src={url} alt=""/>
        </>
    );
};

