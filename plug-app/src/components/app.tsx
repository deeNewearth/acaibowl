import React, {useState, useEffect} from 'react';
import {Form, Spinner} from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './utils';
import { LitProvider, useLit} from './lit';

type WPContent = {
    status?: string,
    error?: string,
    content?: string,
    address?: string,
    nounce?: string
};

export default function GateHolder({postId}:{
    postId:string;
}){
    return <LitProvider>
        <Gate {...{postId}}/>
    </LitProvider>;
}

export function Gate({postId}:{
    postId:string;
}){
    const [allowed, setAllowed] =useState(false);
    const [content,setContent] = useState<IAsyncResult<WPContent>>();

    const k = useLit();

    useEffect(()=>{
        if(!allowed || !!content?.result){
            return;
        }

        (async()=>{
            try{
                setContent({isLoading:true});

                const result = await fetchJsonAsync<WPContent>(fetch(`/?rest_route=/acaibowl/v1/content/${encodeURIComponent(postId)}`));

                debugger;

                setContent({result});

            }catch(error:any){
                setContent({error});
            }
        })();

    },[allowed])

    if(!allowed){
        return <div>

            <h2>The content is gated</h2>

            <Form.Check type="checkbox" checked={!allowed}  label="allow the content" onClick={()=>setAllowed(!allowed)} />
        </div>;
    }

    if(content?.isLoading){
        return <Spinner animation="border" variant="primary"/>;
    }

    if(content?.error)
        return <ShowError error={content.error} />;

    return <div>
        <div dangerouslySetInnerHTML={{ __html: content?.result?.content||"" }} />
    </div>;
}