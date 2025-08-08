using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs.Reaction;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace staysocial_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReactionsController : ControllerBase
    {
        private readonly IReactionService _reactionService;
        private readonly UserManager<AppUser> _userManager;

        public ReactionsController(IReactionService reactionService, UserManager<AppUser> userManager)
        {
            _reactionService = reactionService;
            _userManager = userManager;
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleReaction(CreateReactionDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            await _reactionService.ToggleReactionAsync(user.Id, dto);
            return Ok(new { message = "Reaction updated successfully" });
        }

        [HttpGet("{apartmentId}/count")]
        public async Task<IActionResult> GetReactionCount(int apartmentId)
        {
            var (likes, dislikes) = await _reactionService.GetReactionCountAsync(apartmentId);
            return Ok(new { likes, dislikes });
        }
    }

}

