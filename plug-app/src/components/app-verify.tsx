import React, { useState, useEffect } from 'react';
import { Form, Spinner, Button } from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './utils';
//import { LitProvider, useLit} from './lit';
import LitJsSdk from 'lit-js-sdk';

type WPContent = {
    status?: string,
    error?: string,
    content?: string,
    address?: string,
    nounce?: string,
    hasAccess?: boolean,
    idsToCheck?: string[],
};

export default function GateHolder({ postId }: {
    postId: string;
}) {
    /*
    return <LitProvider>
        <Gate {...{postId}}/>
    </LitProvider>;
    */

    return <Gate {...{ postId }} />;
}

export function Gate({ postId }: {
    postId: string;
}) {
    
    const [content, setContent] = useState<IAsyncResult<WPContent>>();

    //const k = useLit();

    
    if (content?.isLoading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (content?.result?.hasAccess) {
        return <div>
            <div dangerouslySetInnerHTML={{ __html: content?.result?.content || "" }} />
        </div>;

    } else {
        return <div>

            <h2>The content is gated</h2>

            {content?.error && <ShowError error={content.error} />}

            <Button variant="info" onClick={async () => {
                try {
                    setContent({ isLoading: true });

                    const authSig: {
                        address: string;
                    } = await LitJsSdk.checkAndSignAuthMessage({ chain: 'rinkeby' });

                    debugger;

                    //                const result = await fetchJsonAsync<WPContent>(fetch(`/?rest_route=/acaibowl/v1/content/${encodeURIComponent(postId)}`));

                    const result = await fetchJsonAsync<WPContent>(fetch(`/?rest_route=/acaibowl/v1/content`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ postId, address: authSig.address })
                    }));




                    setContent({ result });

                } catch (error: any) {



                    if (!error) {
                        error = new Error('failed to connect');
                    }
                    setContent({ error });
                }
            }}>
                Get access using Wallet
            </Button>

        </div>;
    }

}