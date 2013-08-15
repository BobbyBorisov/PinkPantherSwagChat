using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Chat.DataLayer;
using Chat.Models;
using Chat.Repositories;

namespace Chat.Services.Controllers
{
    public class ConversationsController : ApiController
    {
        private ConversationsRepository conversationsRepository;
        private UsersRepository usersRepository;

        public ConversationsController()
        {
            var context = new ChatDatabaseContext();
            this.conversationsRepository = new ConversationsRepository(context);
            this.usersRepository = new UsersRepository(context);
        }

        [HttpPost]
        [ActionName("start")]
        public Conversation Start([FromBody]Conversation conversationData)
        {
            User[] users = new User[2];
            users[0] = conversationData.FirstUser;
            users[1] = conversationData.SecondUser;

            var conversation = GetByUsers(users);
            if(conversation == null)
            {
                conversationsRepository.Add(new Conversation()
                                                {
                                                    FirstUser = usersRepository.GetByUsername(users[0].Username),
                                                    SecondUser = usersRepository.GetByUsername(users[1].Username)
                                                });

                return GetByUsers(users);
            }

            return conversation;
        }

       
        private Conversation GetByUsers(User[] users)
        {
            var firstUsername = users[0].Username;
            var secondUsername = users[1].Username;

            var conversation = conversationsRepository.GetByUsers(firstUsername, secondUsername);
            return conversation;
        }
    }
}
