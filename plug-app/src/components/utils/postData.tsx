import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Form, Spinner} from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './index';
import constate from "constate";

type MinInfoList ={[key:string]:string};

export type MintInfo = {
    postId:string;
    rest_auth_nonce:string;
    images:{id:string;url:string}[]|undefined;
    mintInfo:MinInfoList|undefined;
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
    const postDataRef = useRef<MinInfoList>();

    const updateData = useCallback(async (key:string,data:string)=>{

        
        const newMintInfo = {...postDataRef.current};
        
        newMintInfo[key] = data;

        const mintInfoSerialized = JSON.stringify(newMintInfo);


        const done = await fetchJsonAsync<{
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

        const result = {...postData?.result,mintInfo:newMintInfo} as any;

        

        postDataRef.current = newMintInfo;
        setPostData({result});

        

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

                postDataRef.current = result.mintInfo;
                setPostData({result});

            }catch(error:any){
                setPostData({error});
            }
        })();

    },[]);

    return {postData,updateData};

}

