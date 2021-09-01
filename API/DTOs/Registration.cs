using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace API.DTOs
{
    public class Registration
    {
        [Required]
        public string DisplayName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]

        /* regular expression does not take into account the policy RequiredUniqueChars = 6 */
        [RegularExpression("(?=.*\\d)(?=.*[a-z]).{8,100}$", ErrorMessage = "Password too weak.")]
        public string Password { get; set; }
        public string UserName { get; set; }
    }
}