/*
  See https://developer.github.com/webhooks/event-payloads for
  examples of payloads.

  Try running in the console below.
*/

const expludeActions = {
    assigned: true,
    converted_to_draft: true,
    created: true,
    edited: true,
    locked: true,
    ready_for_review: true,
    review_requested: true,
    synchronize: true,
    unassigned: true,
    unlocked: true
}

exports = async function (payload) {
    if (expludeActions[payload.action]) {
        return 200;
    }
    const mongodb = context.services.get("mongodb-atlas");
    const webhook = mongodb.db("test").collection("webhook");
    const PullRequest = mongodb.db("test").collection("pull_request");

    const date = new Date();

    if (payload.pull_request && !payload.review) {
        let { action } = payload;
        const pr = payload.pull_request;

        const number = payload.pull_request.number;
        
        const user = pr.user.login;
        const user_avatar = pr.user.avatar_url;
        
        const branch = pr.head.ref;
        const repo = payload.pull_request.base.repo.name;

        let extras$ = {};
        if (action === 'labeled') {
            const label = payload.label.name;
            extras$['$addToSet'] = { [repo + '.label']: label };

        }
        if (action === 'unlabeled') {
            const label = payload.label.name;
            extras$['$pull'] = { [repo + '.label']: label };
        }

        if (action === 'closed' && payload.pull_request.merged) {
            action = 'merged';
        }

        await PullRequest.updateOne(
            { key: branch },
            {
                $setOnInsert: {
                    key: branch,
                    user: user,
                    user_avatar: user_avatar,
                    created_at: date
                },
                $set: {
                    [repo + '.title']: payload.pull_request.title,
                    [repo + '.number']: number,
                    [repo + '.' + action]: date,
                    updated_at: date
                },
                ...extras$
            },
            { "upsert": true }
        );


    } else if (payload.check_suite) {
        const repo = payload.repository.name;
        const state = payload.check_suite.conclusion;
        const branch = payload.check_suite.head_branch;

        await PullRequest.updateOne(
            { key: branch },
            {
                $set: {
                    [repo + '.check']: state,
                    updated_at: date
                }
            }
        );

    } else if (payload.review) {
      const repo = payload.repository.name;
      const branch = payload.pull_request.head.ref;
      const state = payload.review.state;
      
      if (state === 'approved') {
          await PullRequest.updateOne(
              { key: branch },
              {
                  $inc: {
                      [repo + '.approved']: 1,
                  },
                  $set: {
                      updated_at: date
                  }
              }
          );
      }
      
      
    }
    
    
    payload.event_date = new Date();
    await webhook.insertOne(payload);
    return 200;

};