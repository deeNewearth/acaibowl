import React,{useEffect} from 'react';
import LitJsSdk from 'lit-js-sdk';
import constate from 'constate';

export const [LitProvider,
    useLit] = constate(
        useLoadLit,
        v => v.ctx,
    );


function useLoadLit(){

    useEffect(()=>{
        try{
            debugger;
            const litNodeClient = new LitJsSdk.LitNodeClient();
            litNodeClient.connect();
   
        }catch(error:any){
            console.error(`failed to load lit ${error}`);
        }
    },[]);

    return {
        ctx:2
    }

}