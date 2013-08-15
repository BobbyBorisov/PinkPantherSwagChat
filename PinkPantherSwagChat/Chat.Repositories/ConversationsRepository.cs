using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chat.DataLayer;
using Chat.Models;

namespace Chat.Repositories
{
    public class ConversationsRepository : EfRepository<Conversation>
    {
        private ChatDatabaseContext chatContext;

        public ConversationsRepository(ChatDatabaseContext context) : base(context)
        {
            this.chatContext = context;
        }


        public Conversation GetByUsers(string firstUsername, string secondUsername)
        {
            var conversation = chatContext.Conversations.Include("FirstUser").Include("SecondUser").Include("Messages")
                .FirstOrDefault(c =>
                    (c.FirstUser.Username == firstUsername && c.SecondUser.Username == secondUsername)
                    ||
                    (c.FirstUser.Username == secondUsername && c.SecondUser.Username == firstUsername));

            if(conversation == null)
            {
                return null;
            }

            var newConversation = new Conversation()
            {
                Id = conversation.Id,
                FirstUser = conversation.FirstUser,
                SecondUser = conversation.SecondUser,
            };

            newConversation.Messages = conversation.Messages.Select(m => new Message()
                                                                             {
                                                                                 Sender = m.Sender,
                                                                                 Date = m.Date,
                                                                                 Content = m.Content
                                                                             }).ToList();

            return newConversation;
        }
    }
}
