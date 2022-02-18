import React, {FunctionComponent} from 'react';

export function useQueryParams(){

    if(!window?.location?.search)
        return {};

    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams);
} 

interface IAsyncResultBase {
    isLoading?: boolean;
    loadingPrompt?:string;
    error?: Error;
}

export interface IAsyncResult<T> extends IAsyncResultBase {
    result?: T;
}

export const ShowError: FunctionComponent<{ error: Error | undefined }> = ({ error }) => {
    if (!error)
        return <>&nbsp;</>;

    let errStr = error.message ?? `failed :${error}`;
    if(errStr.length>150){
        errStr = errStr.slice(0,150);
    }

    return <div className='text-center  py-2'>
        <span className='text-danger'> {errStr}</span>
    </div>;
}

export async function fetchJsonAsync<T>(responsePromise: Promise<Response>) {
    const responce = await checkFetchErrorAsync(responsePromise);

    return (await responce.json()) as T;
}

export async function fetchStringAsync(responsePromise: Promise<Response>) {
    const responce = await checkFetchErrorAsync(responsePromise);
    return (await responce.text());
}



export async function checkFetchErrorAsync(responsePromise: Promise<Response>) {

    const response = await responsePromise;

    if (!response.ok) {

        console.error("checkFetchError NON OK response");

        if (!response.headers)
            console.error('checkFetchError called with non http response');

        try {
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.indexOf('application/json') != -1) {
                const err = await response.json();
                throw new Error(err?.Message || err?.message || 'unknown error');
            } else if (contentType && contentType.indexOf('text/plain') != -1) {
                const err = await response.text();

                throw new Error(response.statusText + ' : ' + err);
            }
        } catch (err) {
            console.debug('we don\'t have error body');

        }


        {
            throw new Error(response.statusText);
        }

    }
    else
        return response;
}



