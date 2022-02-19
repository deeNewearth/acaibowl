import React, { useState } from 'react';
import { usePostData, useUpdateData } from '../utils/postData';
import { Image, Button, Spinner } from 'react-bootstrap';

import { IAsyncResult, ShowError, fetchJsonAsync } from '../utils';
import "./rarStyles.scss";

import { NFTStorage, Blob } from 'nft.storage'
import { pack } from 'ipfs-car/pack';

const endpoint = new URL('https://api.nft.storage'); // the default
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJiMDY3ZjcwYzdhNGFCNURjQjk5RjJENjkzZGY2ODAwMUI2ODlEZjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NTI3OTY3MjgxOSwibmFtZSI6ImFjYWlCb3dsLXRlc3QifQ.iBr5lrdbLBsJiDDfdI5DkVv792k62HrzRFf9Xlr0qKs';

export default function SaveTorarible() {
    const [minted, setMinted] = useState<IAsyncResult<string>>();
    const postData = usePostData();

    const updatePost = useUpdateData();

    return <div className='rarible'>
        {(postData?.result?.images || []).map((img, i) => <div className='d-flex align-items-center justify-content-evenly' key={i}>

            <div className='thumbHolder'>
                <Image src={img.url} fluid thumbnail />

            </div>

            <div className='ntaction'>
                {postData?.result?.mintInfo && 
    
                    postData?.result?.mintInfo[`pin_img_${img.id}`] &&

                    <small className='ipfsaddress'>{postData?.result?.mintInfo[`pin_img_${img.id}`]}</small>
                }



                {minted?.isLoading && <Spinner animation='border' variant='info' />}

                {minted?.error && <ShowError error={minted?.error} />}

                <Button variant="info" disabled={!!minted?.isLoading} onClick={async () => {
                    try {
                        setMinted({ isLoading: true });

                        const storage = new NFTStorage({ endpoint, token });

                        const filename = img.url.substring(img.url.lastIndexOf('/') + 1);

                        debugger;
                        const blob = await (await fetch(img.url)).blob();
                        const file = new File([blob], filename, { type: blob.type});

                        /*
                        const cid = await storage.storeBlob(blob);
                        console.log({ cid });
                        const status = await storage.status(cid);
                        console.log(status);
                        */

                        const metadata = await storage.store({
                            name: filename,
                            description: 'My wordpress image',
                            image: file
                        });
                        console.log(metadata.url);

                        await updatePost(`pin_img_${img.id}`,metadata.url);

                        setMinted({result:metadata.url});


                    } catch (error: any) {
                        setMinted({ error });
                    }
                }}> lazy mint with Rarible</Button>
            </div>

        </div>)}
    </div>;
}