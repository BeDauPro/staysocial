using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.DTOs.Reaction
{
    public class CreateReactionDto
    {
        public int ApartmentId { get; set; }
        public ReactionType Type { get; set; }
    }

}

