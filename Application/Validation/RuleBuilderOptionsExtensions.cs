using System;
using FluentValidation;

namespace Application.Validation
{
    public static class RuleBuilderOptionsExtensions
    {
        public static IRuleBuilderOptions<T, string> MinimumUniqueCharacters<T>(this IRuleBuilder<T, string> ruleBuilder, int requiredUniqueChars)
        {
            Func<string, int, bool> haveUniqueCharacters = delegate(string str, int requiredUniqueChars) {
                string table = string.Empty;
                foreach (char c in str)
                {
                    if (!table.Contains(c))
                        table += c;
                    if (table.Length >= requiredUniqueChars)
                        return true;
                }
                return false;
            };
            return ruleBuilder.Must(x => haveUniqueCharacters(x, requiredUniqueChars));
        }
    }
}