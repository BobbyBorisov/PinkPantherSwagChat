using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chat.DataLayer;
using Chat.Models;

namespace Chat.Repositories
{
    public class MessagesRepository : EfRepository<Message>
    {
        private ChatDatabaseContext chatContext;

        public MessagesRepository(ChatDatabaseContext context) : base(context)
        {
            this.chatContext = context;
        }

        public override void Add(Message item)
        {
            var conversation = chatContext.Conversations.Attach(item.Conversation);
            item.Sender = (conversation.FirstUser.Id == item.Sender.Id) 
                ? conversation.FirstUser 
                : conversation.SecondUser;

            conversation.Messages.Add(item);
            chatContext.SaveChanges();
        }

        public IEnumerable<Message> GetByConversation(int id)
        {
            var messages = chatContext.Conversations.Find(id).Messages
                .Select(m => new Message()
                                 {
                                     Content = m.Content,
                                     Date = m.Date,
                                     Id = m.Id,
                                     Sender = m.Sender
                                 });

            return messages;
        }
    }
}
