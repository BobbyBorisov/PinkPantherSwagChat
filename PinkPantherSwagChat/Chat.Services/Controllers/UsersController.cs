using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using Chat.DataLayer;
using Chat.Models;
using Chat.Repositories;

namespace Chat.Services.Controllers
{
    public class UsersController : ApiController
    {
        private UsersRepository usersRepository;

        public UsersController()
        {
            var context = new ChatDatabaseContext();
            this.usersRepository = new UsersRepository(context);
        }

        [HttpGet]
        public IQueryable<User> All()
        {
            return usersRepository.All();
        }

        [HttpGet]
        public User GetById(int id)
        {
            return usersRepository.Get(id);
        }

        [HttpPost]
        [ActionName("register")]
        public void Register([FromBody]User value)
        {
            usersRepository.Add(value);
        }

        [HttpPost]
        [ActionName("login")]
        public HttpResponseMessage Login([FromBody]User value)
        {
            bool validUser = usersRepository.CheckLogin(value.Username, value.PasswordHash);
            if (validUser)
            {
                return Request.CreateResponse(HttpStatusCode.OK, value);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid username or password");
            }
        }

        [HttpPost]
        [ActionName("byusername")]
        public User GetByUsername([FromBody]User userData)
        {
            var user = usersRepository.GetByUsername(userData.Username);
            return user;
        }
    }
}
