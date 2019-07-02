
const fs = require('fs');

module.exports =  function persistSubmission(db,submission){
    submission.id = db.length;
    db.push(submission);
    return submission;
}
