using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Contracts.Product
{
    public sealed record AddCommentRequest(Guid ProductId,Guid? ParentId,string Content);
}
