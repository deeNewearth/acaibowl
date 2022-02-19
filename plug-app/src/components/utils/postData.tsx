import React, {useState, useEffect, useCallback} from 'react';
import {Form, Spinner} from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './index';
import constate from "constate";

export type MintInfo = {
    postId:string;
    rest_auth_nonce:string;
    images:{id:string;url:string}[]|undefined;
    mintInfo:{[key:string]:string}|undefined;
}

export const [PostDataProvider, usePostData, useUpdateData] = constate(
    useLoadPost,
    v => v.postData, 
    v=>v.updateData
  );


function useLoadPost({rest_auth_nonce, images,mintInfo,postId}:{
    rest_auth_nonce:string;
    images:string;
    mintInfo:string;
    postId:string;
}){

    const [postData, setPostData] = useState<IAsyncResult<MintInfo>>();  

    const updateData = useCallback(async (key:string,data:string)=>{

        debugger;
        const newMintInfo = {...postData?.result?.mintInfo};
        newMintInfo[key] = data;

        const mintInfoSerialized = JSON.stringify(newMintInfo);


        const result = await fetchJsonAsync<{
            status:string;
            user:string;
            error?:string;
        }>(fetch(`/?rest_route=/acaibowl/v1/pageAdmin`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': rest_auth_nonce,
              },
            body:JSON.stringify({mintInfoSerialized,postId:postData?.result?.postId})
        }));


        setPostData({result:{...postData?.result,mintInfo:newMintInfo} as any});

        debugger;

    },[postData]);
    

    useEffect(()=>{
        (async()=>{
            try{

                setPostData({isLoading:true});

                const result:MintInfo = {
                    rest_auth_nonce,postId,
                    images: images && JSON.parse(images) || undefined,
                    mintInfo: mintInfo && JSON.parse(mintInfo) || undefined
                }

                setPostData({result});

            }catch(error:any){
                setPostData({error});
            }
        })();

    },[]);

    return {postData,updateData};

}

