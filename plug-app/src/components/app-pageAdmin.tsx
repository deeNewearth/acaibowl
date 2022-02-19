import React, {useState, useEffect} from 'react';
import {Form, Spinner} from 'react-bootstrap';
import { IAsyncResult, ShowError, fetchJsonAsync } from './utils';
import { LitProvider, useLit} from './lit';

import {Button, Modal} from 'react-bootstrap';


export default function PageAdmin({rest_auth_nonce}:{
    rest_auth_nonce:string
}){

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    
    
    useEffect(()=>{
        (async()=>{
            try{
                //setContent({isLoading:true});

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
                //setContent({error});
            }
        })();

    },[])



    return <div>
        <Button variant='primary' onClick={()=>setShow(true)}>Mint as NFT</Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
}