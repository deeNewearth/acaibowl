import React,{useEffect} from 'react';
import LitJsSdk from 'lit-js-sdk';
import constate from 'constate';

export const [LitProvider,
    useLit] = constate(
        useLoadLit,
        v => v.ctx,
    );

type wpMintInfo = {
    wpTokenId: string;
    wpTxHash: string;
    wpTokenAddr: string;
    wpAuthSig: string;
    wpMintingAddr: string;

}

function useLoadLit(){

    let litNodeClient:any = null;
    let wpChain = 'mumbai';
    let myMint: wpMintInfo;

    async function mint(postId:string){
        const {
            txHash,
            tokenId,
            tokenAddress,
            mintingAddress,
            authSig
        } = await LitJsSdk.mintLIT({ chain: wpChain, quantity: 1 })
        myMint = {
        wpTokenId: tokenId,
        wpTxHash: txHash,
        wpTokenAddr:  tokenId,
        wpAuthSig: authSig,
        wpMintingAddr: mintingAddress
        } 
    }

    async function checkAccess(postId:string){

        const savedData = {
            arg1:'888',
        }

        //litNodeClient.??????? o find access

        return false;
    }


    useEffect(()=>{

        (async ()=>{
            try{
                debugger;
                litNodeClient = new LitJsSdk.LitNodeClient();
                litNodeClient.connect();
                let j = 4;

                await mint('8');

                const r =await checkAccess('8');
       
            }catch(error:any){
                console.error(`failed to load lit ${error}`);
            }
                
        })();

    },[]);

    return {
        ctx:2
    }

}