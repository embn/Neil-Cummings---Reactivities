using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator mediator;
        public ChatHub(IMediator mediator)
        {
            this.mediator = mediator;
        }
        //Client is able to invoke methods so naming is significant
        public async Task SendComment(Create.Command command)
        {
            var comment = await mediator.Send(command);
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("RecieveComment", comment.Value);
        }
        public override async Task OnConnectedAsync()
        {  
            //Whenever a user connects, join them to group, and send them the comment list
            string activityId = Context.GetHttpContext().Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var result = await mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}