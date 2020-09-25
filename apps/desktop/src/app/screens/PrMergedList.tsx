import { differenceInDays, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ScriptBadge } from '../components/ScriptBadge';
import { getPR, login } from '../db';
import { useURLParams } from '../router';

export function PrMergedList () {
    const [prs, setPrs] = useState([]);
    const [prs2, setPrs2] = useState([]);
    const [order, setOrder] = useState('done_at');
    const search = useURLParams('search');
    
    useEffect(() => {
        async function staff() {
            try {

                await login();
                const prs = await getPR(true);

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
        filtrados = filtrados.filter(pr => !pr.metadata.close);

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

    return (
        <div className="flex flex-col">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setOrder('key')}>ID</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setOrder('created_at')}>CREADA</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setOrder('done_at')}>MERGE</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer">DEMORA</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">API</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">APP</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">TEST</th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th> 
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {
                                prs.map(
                                    (item) => 
                                        <MergedItem 
                                            key={item.key} 
                                            item={item}></MergedItem>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    );

}

function MergedItem({item}) { 
    return (
        <tr key={item.key}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">

                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={item.user_avatar || 'assets/profile.png'} alt="" />
                    </div>

                    <div className="ml-4">
                        <a href={'https://proyectos.andes.gob.ar/browse/' + item.key} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            {item.key}
                            {/* { (item['app'] || item['api'] || item['andes-test-integracion']).title  } */}
                        </a>
                        <div className="text-sm leading-5 text-gray-500">
                            {item.user}
                        </div>
                    </div>
                </div>

            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-600">
                { format(item.created_at, 'dd/MM') }
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-600">
                {  format(item.done_at, 'dd/MM') }
            </td>


            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-600">
                { differenceInDays(item.done_at, item.created_at) }
            </td>

            


            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {
                    item.api &&  <a href={`https://github.com/andes/api/pull/${item.api.number}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">  { '#' + item.api.number } </a>
                }
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                { 
                    item.app && <a href={`https://github.com/andes/app/pull/${item.app.number}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">  { '#' + item.app.number } </a>
                        
                }
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                { 
                    item['andes-test-integracion'] && <a href={`https://github.com/andes/andes-test-integracion/pull/${item['andes-test-integracion'].number}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">  { '#' + item['andes-test-integracion'].number } </a>
                }

            </td>
 
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <ScriptBadge item={item}></ScriptBadge>
            </td>

        </tr>
    );
}