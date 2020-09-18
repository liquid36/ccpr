import * as fetch from 'node-fetch';
import MongoClient from 'mongodb';
import  { URLSearchParams } from 'url';
import { environment } from '../environments/environment';
 

const runJenkins = (ticket) => {
    const api = ticket.api ? ticket.key : 'master';
    const app = ticket.app ? ticket.key : 'master';
    const test = ticket['andes-test-integracion'] ? ticket.key : 'master';


    const params = new URLSearchParams();
    params.append('APP_BRANCH', app);
    params.append('API_BRANCH', api);
    params.append('TEST_BRANCH', test);
    const url = `${environment.JENKINS_HOST}/buildWithParameters?token=${environment.JENKINS_TOKEN}`;
    fetch(url, { method: 'POST', body: params }).then((res) => {
        console.log('Running', app, api, test, res.ok);
    });
};

const getNextRun = () => {
    const url = `${environment.JENKINS_HOST}/api/json`;
    fetch(url).then((res) => {
        return res.json();
    }).then((res) => {
        return res.nextBuildNumber;
    });
};

async function main() {
    const client = await MongoClient.connect(environment.MONGO_HOST);
    const db = client.db('test');
    const PullRequest = db.collection('pull_request');

    const watcher = PullRequest.watch(
        [
            { $match: { operationType: 'update', 'updateDescription.updatedFields.condorpiedra.run_at': { $exists: true } } }
        ],
        { fullDocument: 'updateLookup' }
    );

    watcher.on('change', async (next) => {
        const ticket = next.fullDocument;
        // const nextRun = await getNextRun();
        runJenkins(ticket);
    });
}

main();
