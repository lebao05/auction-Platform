using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Product.Commands.AddToBlackList
{
    public class BlackListDto
    {
        public Guid Id { get; set; }
        public Guid SellerId { get; set; }
        public string BidderName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
