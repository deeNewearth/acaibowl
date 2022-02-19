import React,{useEffect} from 'react';
import LitJsSdk from 'lit-js-sdk';
import constate from 'constate';

export const [LitProvider,
    useLit] = constate(
        useLoadLit,
        v => v.ctx,
    );


function useLoadLit(){

    let litNodeClient:any = null;

    async function mint(postId:string){

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