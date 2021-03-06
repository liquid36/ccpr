import * as Realm from "realm-web"; 
export const REPO_LIST = ['app', 'api', 'andes-test-integracion'];

const app = new Realm.App({ id: "andes-test-integracion-wofcs" });

export async function login() {
    if (!app.currentUser) {
        const credentials = Realm.Credentials.emailPassword('a@a.com', 'asdasd');
        await app.logIn(credentials);
    }
}

function allHasTag(item, label) {
    return REPO_LIST.reduce((estado, repo) => {
        return estado && (!item[repo] || (item[repo].label && item[repo].label.includes(label)));
    }, true);
}

function hasTag(item, label) {
    return REPO_LIST.reduce((estado, repo) => {
        return estado || (item[repo] && item[repo].label && item[repo].label.includes(label));
    }, false);
}

export async function getPR(done = false) {
    const mongo = app.services.mongodb('mongodb-atlas');
    const mongoCollection = mongo.db("test").collection("pull_request");
    const doneQuery = !done ? { $exists: false } : true;

    const prs = await mongoCollection.find({ done: doneQuery });

    prs.forEach((item) => {
        const isDone = REPO_LIST.reduce((estado, repo) => {
            return estado && (!item[repo] || (item[repo].closed || item[repo].merged));
        }, true);

        const metadata = {
            jiraHref: `https://proyectos.andes.gob.ar/browse/${item.key}`,
            isDone: isDone || item.done,
            script: hasTag(item, 'script'),
            testOk: allHasTag(item, 'test ok'),
            testFail: hasTag(item, 'test fail'),
            repoState: {},
            ready: false,
            close: false
        };

        REPO_LIST.forEach(repo => {
            if (!item[repo]) return;

            const s = item[repo];
            const changesRequested = s.label && s.label.includes('changes requested');
            const state = s.merged ? 'MERGED' : (s.closed ? 'CLOSE' : 'OPEN');
            const isSuccess = s.check !== 'fail';
            const color = state === 'MERGED' ? 'purple' : (state === 'CLOSE' ? 'red' : (isSuccess && !changesRequested  ? 'green' : 'red'));

            metadata.repoState[repo] = {
                state,
                approved: s.approved,
                color,
                ready: (s.approved >= 2 && state === 'OPEN' && color === 'green' ) || repo === 'andes-test-integracion'
            };
        });

        metadata.ready = REPO_LIST.reduce((estado, repo) => {
            return estado && (!item[repo] || metadata.repoState[repo].ready);
        }, true)  && metadata.testOk;
        
        metadata.close = REPO_LIST.reduce((estado, repo) => {
            return estado && (!item[repo] || metadata.repoState[repo].state === 'CLOSE');
        }, true);

        item.metadata = metadata;

        item.done_at = item.done_at || new Date(2020, 8, 11);
        
    });

    return prs;
}

export async function dismissItem(item) {
    const mongo = app.services.mongodb('mongodb-atlas');
    const mongoCollection = mongo.db("test").collection("pull_request");


    return mongoCollection.updateMany(
        { key: item.key },
        { $set: { done: true, done_at: dateToEJSON(new Date()) } },
        {}
    );
}


export async function runTest(item) {
    const mongo = app.services.mongodb('mongodb-atlas');
    const mongoCollection = mongo.db("test").collection("pull_request");
    return mongoCollection.updateMany(
        { key: item.key },
        {
            $set: {
                condorpiedra: {
                    run: true,
                    run_at: dateToEJSON(new Date())
                }
            }
        },
        {}
    );
}

function dateToEJSON(date) {
    return { $date: { $numberLong: '' + date.getTime() } };
}