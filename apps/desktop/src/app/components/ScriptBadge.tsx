import React from 'react';

export function ScriptBadge({ item }) {
    const repos = ['app', 'api', 'andes-test-integracion'];

    const canDismiss = repos.reduce((estado, repo) => {
        return estado || (item[repo] && item[repo].label && item[repo].label.includes('script'));
    }, false);

    if (canDismiss) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                SCRIPT
            </span>
        );
    }
    return null;

}