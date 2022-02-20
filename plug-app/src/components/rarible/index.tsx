import React, { useState, useRef } from 'react';
import { usePostData, useUpdateData } from '../utils/postData';
import { Image, Button, Spinner } from 'react-bootstrap';

import { IAsyncResult, ShowError, fetchJsonAsync } from '../utils';
import "./rarStyles.scss";
import { createRaribleSdk, RaribleSdk } from "@rarible/protocol-ethereum-sdk";
import { Web3Ethereum } from "@rarible/web3-ethereum";

import Web3 from "web3";

import { NFTStorage } from 'nft.storage';

import { useConnectCalls, chainByName } from '../web3';

import { Rairable } from './helper';
import { mint } from '@rarible/protocol-ethereum-sdk/build/nft/mint';


const endpoint = new URL('https://api.nft.storage'); // the default
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJiMDY3ZjcwYzdhNGFCNURjQjk5RjJENjkzZGY2ODAwMUI2ODlEZjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NTI3OTY3MjgxOSwibmFtZSI6ImFjYWlCb3dsLXRlc3QifQ.iBr5lrdbLBsJiDDfdI5DkVv792k62HrzRFf9Xlr0qKs';


export default function SaveTorarible() {
    const [minted, setMinted] = useState<IAsyncResult<string>>();
    const postData = usePostData();
    const updatePost = useUpdateData();

    //const sdk = useRef<Rairable>();
    const { connect } = useConnectCalls();

    const mySdk = async () => {
        //if (!sdk.current) {
        const { web3, account } = await connect(chainByName('rinkeby'))
        const sdk = new Rairable(web3, 'rinkeby');

        return { sdk, account };
        //}

        //return sdk.current;
    }

    return <div className='rarible'>
        {(postData?.result?.images || []).map((img, i) => {

            let ipfsPin = postData?.result?.mintInfo && postData?.result?.mintInfo[`pin_img_${img.id}`] || undefined;
            let tokenId = postData?.result?.mintInfo && postData?.result?.mintInfo[`nft_img_${img.id}`] || undefined;
            let itemId = postData?.result?.mintInfo && postData?.result?.mintInfo[`nft_item_img_${img.id}`] || undefined;

            let sellOrder = postData?.result?.mintInfo && postData?.result?.mintInfo[`sell_img_${img.id}`] || undefined;

            return <div className='d-flex align-items-center justify-content-evenly' key={i}>

                <div className='thumbHolder m-2'>
                    <Image src={img.url} fluid thumbnail />
                </div>

                <div className='ntaction'>

                    {ipfsPin && <small className='ipfsaddress'>{ipfsPin}</small>}

                    {minted?.isLoading && <Spinner animation='border' variant='info' />}

                    {minted?.error && <ShowError error={minted?.error} />}

                    {sellOrder ? <div><a href={`https://rinkeby.rarible.com/token/${itemId}`} target="_blank">
                        View on Rarible
                    </a></div> :
                        <Button variant="info" disabled={!!minted?.isLoading} onClick={async () => {
                            try {
                                setMinted({ isLoading: true });

                                if (!ipfsPin) {
                                    const storage = new NFTStorage({ endpoint, token });

                                    const filename = img.url.substring(img.url.lastIndexOf('/') + 1);

                                    
                                    const blob = await (await fetch(img.url)).blob();
                                    const file = new File([blob], filename, { type: blob.type });

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

                                    await updatePost(`pin_img_${img.id}`, metadata.url);

                                    ipfsPin = metadata.url

                                }

                                const { sdk, account } = await mySdk();

                                if (!tokenId) {
                                    const minted = await sdk.mint(account, ipfsPin);
                                    tokenId = minted?.tokenId||'';
                                    itemId = minted?.itemId||'';
                                    console.log(`got token id ${tokenId}`);
                                    await updatePost(`nft_img_${img.id}`, tokenId);
                                    await updatePost(`nft_item_img_${img.id}`, itemId);
                                }


                                sellOrder = await sdk.createSellOrder(account, tokenId, '10');

                                await updatePost(`sell_img_${img.id}`, sellOrder || 'done');

                                setMinted({ result: tokenId });


                            } catch (error: any) {
                                setMinted({ error });
                            }
                        }}>
                            lazy mint with Rarible
                        </Button>
                    }
                </div>

            </div>;
        })}
    </div>;
}