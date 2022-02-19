import React, {useState, useEffect} from 'react';
import {Form, Spinner} from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './utils';
import { LitProvider, useLit} from './lit';

import {Button, Modal} from 'react-bootstrap';
import {usePostData} from '../components/utils/postData';

import Asrarible from '../components/rarible';


export default function PageAdmin(){

    const [show, setShow] = useState(true);
    const postData = usePostData();
    
    useEffect(()=>{
        (async()=>{
            try{
                //setPostData({isLoading:true});

                /*
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
                }));
                */
                /*
                user:
ID: 1
allcaps: {switch_themes: true, edit_themes: true, activate_plugins: true, edit_plugins: true, edit_users: true, …}
cap_key: "wp_capabilities"
caps:
administrator: true
[[Prototype]]: Object
data: {ID: '1', user_login: 'admin', user_pass: '$P$BX27Qq2020a5Yrb1w0xI3ySngYZKCY1', user_nicename: 'admin', user_email: 'test@test.com', …}
filter: null
roles: ['administrator']
                */

                //setContent({result});

            }catch(error:any){
                //setPostData({error});
            }
        })();

    },[]);

    if(postData?.isLoading){
        return <Spinner animation='border' variant="primary"/>
    }

    if(postData?.error){
        return <ShowError error={postData.error}/>;
    }

    return <div>
        <Button variant='primary' onClick={()=>setShow(true)}>Mint as NFT</Button>

        <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Connect to Web3</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Asrarible/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>setShow(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
}