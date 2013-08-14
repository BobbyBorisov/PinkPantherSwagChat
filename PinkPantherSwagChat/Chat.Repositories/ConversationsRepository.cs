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
            return chatContext.Conversations
                .FirstOrDefault(c =>
                    (c.FirstUser.Username == firstUsername && c.SecondUser.Username == secondUsername)
                    ||
                    (c.FirstUser.Username == secondUsername && c.SecondUser.Username == firstUsername));

        }
    }
}
