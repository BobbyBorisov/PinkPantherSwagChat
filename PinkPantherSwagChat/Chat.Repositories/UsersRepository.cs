using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chat.DataLayer;
using Chat.Models;

namespace Chat.Repositories
{
    public class UsersRepository : EfRepository<User>
    {
        private ChatDatabaseContext chatContext;

        public UsersRepository(ChatDatabaseContext context) : base(context)
        {
            this.chatContext = context;
        }

        public bool CheckLogin(string username, string passwordHash)
        {
            if(chatContext.Users.Any(u => u.Username == username && u.PasswordHash == passwordHash))
            {
                return true;
            }

            return false;
        }
    }
}
