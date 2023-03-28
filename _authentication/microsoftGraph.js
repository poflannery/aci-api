
//

const graph = require("../_config/microsoftGraph");

//
const microsoftGraph = async function (req,res,next) {
    let user = await graph.api('/chats').post({
        chatType: 'oneOnOne',
        members: [
            {
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: ['owner'],
                'user@odata.bind': "https://graph.microsoft.com/v1.0/users(\'fa7cb4b4-c59c-472a-9a50-3a866256c5e7\')"
            },
            {
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: ['owner'],
                'user@odata.bind': "https://graph.microsoft.com/v1.0/users(\'1cc0eb08-c254-495e-b2c5-36ce1cdb3141\')"
            }
        ]
    })

    return res.http(200).log(user)

    
};
//
//
//
//
module.exports = microsoftGraph