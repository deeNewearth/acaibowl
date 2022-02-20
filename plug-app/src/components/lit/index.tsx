import React, { useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk';
import constate from 'constate';

import { mintFormInitial } from '../rarible/helper';

import { IAsyncResult, ShowError, fetchJsonAsync } from '../utils';

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
} | undefined;

type wpResourceId = {
  baseUrl: string;
  path: string;
  orgId: string;
  role: string;
  extraData: string;
}


function useLoadLit() {

  let litNodeClient: any = null;
  const wpChain = 'mumbai';
  let myMint: wpMintInfo;
  let myResourceId: wpResourceId;
  let wpJwt: string;

  const wpAccessControlConditions = [
    {
      contractAddress: LitJsSdk.LIT_CHAINS[wpChain].contractAddress,
      standardContractType: 'ERC1155',
      chain: wpChain,
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

  type MyMinted = {
    txHash:string,
    tokenId:string,
    tokenAddress:string,
    mintingAddress:string,
    authSig:string
  };

  async function mint(postId: string) {

    debugger;

    /*
    const {
      txHash,
      tokenId,
      tokenAddress,
      mintingAddress,
      authSig
    } = await LitJsSdk.mintLIT({ chain: 'rinkeby', quantity: 1 });
    */

    const minted:MyMinted = await LitJsSdk.mintLIT({ chain: 'rinkeby', quantity: 1 });

    return minted;

    /*
    myMint = {
      wpTokenId: tokenId,
      wpTxHash: txHash,
      wpTokenAddr: tokenId,
      wpAuthSig: authSig,
      wpMintingAddr: mintingAddress
    };

    wpAccessControlConditions[0].parameters = [
      ':userAddress',
      myMint.wpTokenId.toString() // do we need to toString?? in their examples
    ];
    */
  }

  async function checkAccess(postId: string) {
    debugger;
    //await provisionAccess();
    //await requestJwt();
    const retVal: boolean = await verifyJwt();
    if (!retVal) {
      console.error('unable to verify jwt');
    } else {
      console.debug(wpJwt);
    }

    const savedData = {
      arg1: '888',
    }

    //litNodeClient.??????? o find access

    return false;
  }

  function getResData(minted:MyMinted){
    
    const accessControlConditions = [
      {
        contractAddress: minted.tokenAddress,
        standardContractType: 'ERC1155',
        chain: "rinkeby",
        method: 'balanceOf',
        parameters: [
          ':userAddress',
          minted.tokenId
        ],
        returnValueTest: {
          comparator: '>',
          value: '0'
        }
      }
    ]




    const myResourceId = {
      baseUrl: 'http://localhost:56395', // in original, it was 'my-dynamic-content-server.com'. Neither one works 'http://localhost:56395'
      path: "/gallery", // this would normally be your url path, like "/webpage.html" for example
      orgId: "",
      role: "",
      extraData: "here is some extra data"
    }

    return {accessControlConditions,myResourceId};

  }

  // successful test - this is one of the stock tests that came with the downloaded package    
  async function provisionAccess(minted:MyMinted) {
    debugger;

    const {accessControlConditions,myResourceId} = getResData(minted);


    await litNodeClient.saveSigningCondition({
      accessControlConditions,
      chain: "rinkeby",
      authSig:minted.authSig,
      resourceId: myResourceId
    });

    console.debug('we are providiosned');
    debugger;

  }

  // successful test - this is one of the stock tests that came with the downloaded package    
  async function requestJwt(minted:MyMinted) {

    debugger;
    const {accessControlConditions,myResourceId} = getResData(minted);

    const jwt = await litNodeClient.getSignedToken({
      accessControlConditions,
      chain: "rinkeby",
      authSig:minted.authSig,
      resourceId: myResourceId
    });

    const k = jwt;
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

  useEffect(() => {

    (async () => {
      try {
        debugger;


        /*
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'rinkeby' });
        const h = authSig;


        const h1 = await fetchJsonAsync<{}>(fetch('https://ethereum-api.rarible.org/v0.1/nft/items/0x60f80121c31a0d46b5279700f9df786054aa5ee5:717802'));
*/
/*
        litNodeClient = new LitJsSdk.LitNodeClient();
        litNodeClient.connect();

        const minted = await mint('1');
        await provisionAccess(minted);

        await requestJwt(minted);
*/

        /*


        await provisionAccess(authSig);

        await requestJwt(authSig);

        //await mint('8');

        //throw new Error('i m bad');

        //const r =await checkAccess('8');
        */

      } catch (error: any) {
        const k = error;
        debugger;
        console.error(`failed to load lit ${error}`);
      }

    })();

  }, []);

  return {
    ctx: 2
  }

}