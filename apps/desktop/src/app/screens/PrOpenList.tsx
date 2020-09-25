import React, { useEffect, useState } from 'react';
import { PrItem } from '../components/PrItem';
import { dismissItem, getPR, login } from '../db';
import { useURLParams } from '../router';

export function PrOpenList(){
    const [prs, setPrs] = useState([]);
    const [prs2, setPrs2] = useState([]);
    const [order, setOrder] = useState('updated_at');
    const search = useURLParams('search');
    
    useEffect(() => {
        async function staff() {
            try {

                await login();
                const prs = await getPR();

                setPrs(prs);
                setPrs2([...prs]);
            } catch (err) {
                console.error("Failed to log in", err);
            }
        }
        staff();
    }, []);

    useEffect(() => {
        let filtrados;
        if (!search || search.length === 0) {
            filtrados = [...prs2];
        } else {
            filtrados = prs2.filter((item) => {
                return item.key.includes(search) || item.user.includes(search);
            });
        }

        if (order.length > 0) {
            if (order === 'key') {
                filtrados.sort((a, b) => a.key.localeCompare(b.key));
            } else {
                filtrados.sort((a, b) => {
                    const aa = b[order].getTime() - a[order].getTime();
                    return aa;
                });
            }
        }

        setPrs(filtrados);
    }, [search, order, prs2]);

    const onDismiss = (item) => {
        dismissItem(item).then(() => {
            const prss = prs2.filter((it) => it.key !== item.key);
            setPrs2(prss);
        });
    };
    
    return (
        <>
            <div className="mt-1">
                <div className="flex flex-wrap -mx-6">
                    <div className="w-full px-6 sm:w-1/5 xl:w-1/5">
                        <div className="flex items-center px-1 py-2 shadow-sm rounded-md bg-white justify-center">
                            <div className="p-2 rounded-full bg-purple-600 bg-opacity-75">
                                <svg className="h-4 w-4 text-white" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z" fill="currentColor" />
                                    <path d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z" fill="currentColor" />
                                    <path d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z" fill="currentColor" />
                                    <path d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z" fill="currentColor" />
                                    <path d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z" fill="currentColor" />
                                    <path d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z" fill="currentColor" />
                                </svg>
                            </div>

                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700"> { prs.length } </h4> 
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-6 px-6 sm:w-1/5 xl:w-1/5 sm:mt-0">
                        <div className="flex items-center px-1 py-2 shadow-sm rounded-md bg-white justify-center">
                            <div className="p-2 rounded-full bg-blue-600 bg-opacity-75 text-white font-bold">
                                                OK
                            </div>

                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700"> { prs.filter(pr => pr.metadata.ready).length } </h4> 
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-6 sm:w-1/5 xl:w-1/5 xl:mt-0">
                        <div className="flex items-center px-1 py-2 shadow-sm rounded-md bg-white justify-center">
                            <div className="p-2 rounded-full bg-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" fill="currentColor"/></svg>
                            </div>

                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">{ prs.filter(pr => pr.metadata.testOk).length }</h4> 
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-6 sm:w-1/5 xl:w-1/5 xl:mt-0">
                        <div className="flex items-center px-1 py-2 shadow-sm rounded-md bg-white justify-center">
                            <div className="p-2 rounded-full bg-red-600">
                                <svg className="h-4 w-4 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z" fill="currentColor" stroke="currentColor" stroke-width="2" strokeLinejoin="round" />
                                    <path d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z" stroke="currentColor" stroke-width="2" />
                                </svg>
                            </div>

                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">{ prs.filter(pr => pr.metadata.testFail).length }</h4> 
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-6 sm:w-1/5 xl:w-1/5 xl:mt-0">
                        <div className="flex items-center px-1 py-2 shadow-sm rounded-md bg-white justify-center">
                            <div className="p-2 rounded-full bg-yellow-600">
                                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M9 12H6V10H9V12M13.5 10H10.5V12H13.5V10M18 10H15V12H18V10M18 6H6V9H18V6M20 5H4L4 19L20 19L20 5L20 5M20 3C21.1 3 22 3.9 22 5V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3H20M9 13H6V15H9V13M13.5 13H10.5V15H13.5V13M18 13H15V15H18V13M9 16H6V18H9V16M13.5 16H10.5V18H13.5V16M18 16H15V18H18V16Z" />
                                </svg>
                            </div>

                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">{ prs.filter(pr => pr.metadata.script).length }</h4> 
                            </div>
                        </div>
                    </div>



                                    

                </div>
            </div> 

            <div className="mt-4">

            </div>

            <div className="flex flex-col">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setOrder('key')}>ID</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setOrder('updated_at')}>UPDATE</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setOrder('created_at')}>CREADA</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">API</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">APP</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">TEST</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {
                                    prs.map(
                                        (item) => 
                                            <PrItem 
                                                key={item.key} 
                                                item={item} onDismiss={onDismiss}></PrItem>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}