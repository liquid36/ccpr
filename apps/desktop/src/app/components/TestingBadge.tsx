import React from 'react';

export function TestingBadge({ item }) {
    const repos = ['app', 'api', 'andes-test-integracion'];

    const hasTestingOK = repos.reduce((estado, repo) => {
        return estado && (!item[repo] || item[repo].label && item[repo].label.includes('test ok'));
    }, true);

    const hasTestingFail = repos.reduce((estado, repo) => {
        return estado || (item[repo] && item[repo].label && item[repo].label.includes('test fail'));
    }, false);

    if (hasTestingOK) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-white">
                TEST OK
            </span>
        );
    } else if (hasTestingFail) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-white">
                TEST FAIL
            </span>
        );
    }
    return null;

}