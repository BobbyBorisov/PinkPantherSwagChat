using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Chat.DataLayer;
using Chat.Models;
using Chat.Repositories;

namespace Chat.Services.Controllers
{
    public class MessagesController : ApiController
    {
        private MessagesRepository messagesRepository;

        public MessagesController()
        {
            var context = new ChatDatabaseContext();
            messagesRepository = new MessagesRepository(context);
        }

        [HttpGet]
        public IQueryable<Message> Get()
        {
            return messagesRepository.All();
        }

        [HttpGet]
        public Message Get(int id)
        {
            return messagesRepository.Get(id);
        }

        [HttpPost]
        [ActionName("send")]
        public void Post([FromBody]Message value)
        {
            value.Conversation.Messages = new Collection<Message>();
            messagesRepository.Add(value);
        }

        [HttpGet]
        [ActionName("byconversation")]
        public IEnumerable<Message> GetMessagesByConversations(int id)
        {
            return messagesRepository.GetByConversation(id);
        }
    }
}
