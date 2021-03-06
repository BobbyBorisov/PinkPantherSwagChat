﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Models
{
    public class Message
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Content { get; set; }

        public virtual Conversation Conversation { get; set; }
        public virtual User Sender { get; set; }
    }
}
