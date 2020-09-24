import { formatDistanceToNow, format } from 'date-fns'; 
import React from 'react';
import { DismissButton } from './DismissButton';
import { EstadoRepositorio } from './EstadoRepositorio';
import { RunTest } from './RunTest';
import { ScriptBadge } from './ScriptBadge';
import { TestingBadge } from './TestingBadge';

export function PrItem({ item, onDismiss }) {
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
                {  formatDistanceToNow(item.updated_at) }
                {/* {item.updated_at.toLocaleDateString()}
                <br />
                {item.updated_at.getHours()}: {item.updated_at.getMinutes()}HS */}
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-600">
                { format(item.created_at, 'dd/MM') }
                {/* {item.created_at.toLocaleDateString()}
                <br />
                {item.created_at.getHours()}: {item.created_at.getMinutes()}HS */}
            </td>


            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <EstadoRepositorio item={item} repo="api" />
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <EstadoRepositorio item={item} repo="app" />
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <EstadoRepositorio item={item} repo="andes-test-integracion" />

            </td>
 
            <td>
                <TestingBadge item={item}></TestingBadge>
                <ScriptBadge item={item}></ScriptBadge>
            </td>

            <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                <DismissButton item={item} onPress={() => onDismiss(item) }></DismissButton>
                {/* <RunTest item={item}></RunTest> */}
            </td>
        </tr>
    );
}