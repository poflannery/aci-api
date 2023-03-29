const pushNoticeClient = async function (req,res,next) {
    // when sending something to the client, it will grab the user's email address from the graph api.
    // it will use that email to send. 
    // use this for Client Email Notifications
    return res.http(200).log('client')
};
const pushNoticeEmployee = async function (req,res,next) {
    // this email will be sent from a predetermined email (engineering) for the employee. 
    // use this for Client Email Notifications
    return res.http(200).log('employee')
};
const setEmailJob = async function (req,res,next) {
    // fields will be determined based on the email template created.
    // only client emails will be added to the jobs, so no need to worry about different templates.
    // create a single template to use.
    // set a job into the database with all fields and ready to be sent.
    // create a cron job to run a function in the code - the function will go into the database
    // and run the email function on each job that is due for new Date()
    // then it will mark as sent and if it fails, it will mark it as failed. 
    // then the next cron job, it will delete anything that is older than new Date() and has sent. 
    // if the database is showing as failed, it will try again.
    // each failure it will make a note and on the third time, it will send a notice to the owner. Failed to send email.
    return res.http(200).log('jobTask')
};
const removeEmailJob = async function (req,res,next) {
    // it will retrieve a job using the id of the document, then it will delete it from the system jobs.
    return res.http(200).log('remove Job')
};

module.exports = {
    pushNoticeClient,
    pushNoticeEmployee,
    setEmailJob,
    removeEmailJob
}