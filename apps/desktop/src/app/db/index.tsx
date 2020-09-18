import * as Realm from "realm-web";
const EJSON = require('ejson');

const app = new Realm.App({ id: "andes-test-integracion-wofcs" });

export async function login() {
    if (!app.currentUser) {
        const credentials = Realm.Credentials.emailPassword('a@a.com', 'asdasd');
        await app.logIn(credentials)
    }
}


export async function getPR() {
    const mongo = app.services.mongodb('mongodb-atlas');
    const mongoCollection = mongo.db("test").collection("pull_request");
    const prs = await mongoCollection.find({ done: { $exists: false } });
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