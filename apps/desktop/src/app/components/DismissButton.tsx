import React from 'react';

export function DismissButton({ item, onPress }: any) {
    const repos = ['app', 'api', 'andes-test-integracion'];

    const canDismiss = repos.reduce((estado, repo) => {
        return estado && (!item[repo] || (item[repo].closed || item[repo].merged));
    }, true);

    if (canDismiss) {
        return (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={onPress}>
                CERRAR
            </button>
        );
    }
    return null;

}