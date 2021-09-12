using System;
using System.Linq;

namespace Application.Validation
{
    public class StringRules
    {
        public static Func<string, bool> NotEndWithWhiteSpace = x => !string.IsNullOrEmpty(x) && !char.IsWhiteSpace(x[0]);
        public static Func<string, bool> ContainNonLetter = x => x.Any(c => !char.IsLetter(c));
        public static Func<string, bool> ContainUpperAndLowerCase = x => x.Any(char.IsLower) && x.Any(char.IsUpper);
        public static Func<string, bool> NotStartWithWhiteSpace = x => !string.IsNullOrEmpty(x) && !char.IsWhiteSpace(x.First());
        public static Func<string, int, bool> HaveUniqueCharacters = (x, y) => x.Distinct().Count() >= y;
    }
}