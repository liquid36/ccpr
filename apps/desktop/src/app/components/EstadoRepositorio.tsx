import React from 'react';

export function EstadoRepositorio({ item, repo }: any) {
    const s = item[repo];

    if (!s) {
        return <>---</>;
    }


    const message = s.merged ? 'MERGED' : (s.closed ? 'CLOSE' : 'OPEN');
    const isSuccess = s.check !== 'fail';
    const color = message === 'MERGED' ? 'purple' : (message === 'CLOSE' ? 'red' : (isSuccess ? 'green' : 'red'));

    let icon = null;
    if (message === 'OPEN' && s.approved) {
        icon = [
            ...Array(s.approved).keys()
        ].map(
            (_, index) => <Check key={index} />
        );
    }

    return (
        <a className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${color}-100 text-${color}-800`}
            href={`https://github.com/andes/${repo}/pull/${s.number}`} target="blank" title={s.title} >
            {message} {icon}
        </a>
    );
}

function Check() {
    return <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-green-900" width="12" height="12" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg>;
}