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
}|undefined;

type wpResourceId = {
    baseUrl: string;
    path: string;
    orgId: string;
    role: string;
    extraData: string;
  }

  
function useLoadLit(){

    let litNodeClient:any = null;
    const wpChain = 'mumbai';
    let myMint: wpMintInfo;
    let myResourceId: wpResourceId;
    let wpJwt: string;

    const wpAccessControlConditions = [
        {
          contractAddress: LitJsSdk.LIT_CHAINS[wpChain].contractAddress,
          standardContractType: 'ERC1155',
          chain:wpChain,
          method: 'balanceOf',
          parameters: [
            ':userAddress',
            ''//myMint.wpTokenId.toString() // do we need to toString?? in their examples
          ],
          returnValueTest: {
            comparator: '>',
            value: '0'
          }
        }
      ]
    

    async function mint(postId:string){
        const {
            txHash,
            tokenId,
            tokenAddress,
            mintingAddress,
            authSig
        } = await LitJsSdk.mintLIT({ chain: wpChain, quantity: 1 });

        myMint = {
            wpTokenId: tokenId,
            wpTxHash: txHash,
            wpTokenAddr:  tokenId,
            wpAuthSig: authSig,
            wpMintingAddr: mintingAddress
        };

        wpAccessControlConditions[0].parameters= [
            ':userAddress',
            myMint.wpTokenId.toString() // do we need to toString?? in their examples
        ];
    }

    async function checkAccess(postId:string){
        await provisionAccess();
        await requestJwt();
        const retVal: boolean = await verifyJwt();
        if (!retVal) {
            console.error('unable to verify jwt');
        } else {
            console.debug(wpJwt);
        }

        const savedData = {
            arg1:'888',
        }

        //litNodeClient.??????? o find access

        return false;
    }
    // successful test - this is one of the stock tests that came with the downloaded package    
    async function provisionAccess() {
        const randomUrlPath = "/" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const myResourceId = {
          baseUrl: 'my-dynamic-content-server.com', // in original, it was 'my-dynamic-content-server.com'. Neither one works 'http://localhost:56395'
          path: randomUrlPath, // this would normally be your url path, like "/webpage.html" for example
          orgId: "",
          role: "",
          extraData: "here is some extra data"
        }
        await litNodeClient.saveSigningCondition({
          accessControlConditions: wpAccessControlConditions,
          chain: wpChain,
          authSig: myMint?.wpAuthSig,
          resourceId: myResourceId
        })
    }
  
      // successful test - this is one of the stock tests that came with the downloaded package    
      async function requestJwt() {
        
        wpJwt = await litNodeClient.getSignedToken({
          accessControlConditions: wpAccessControlConditions,
          chain: wpChain,
          authSig: myMint?.wpAuthSig,
          resourceId: myResourceId
        })
      }
  
      // successful test - this is one of the stock tests that came with the downloaded package    
      async function verifyJwt() {
        const data = await fetch('/verify?jwt=' + wpJwt).then(resp => resp.json());
        if (data.length > 0) {
            return true;
        } else {
            return false;
        }
      }

    useEffect(()=>{

        (async ()=>{
            try{
                //debugger;
                litNodeClient = new LitJsSdk.LitNodeClient();
                litNodeClient.connect();
                
                await mint('8');

                //throw new Error('i m bad');

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