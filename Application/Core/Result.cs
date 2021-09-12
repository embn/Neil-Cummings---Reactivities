using System;

namespace Application.Core
{
    public abstract class AbstractResult<T, U>
    {
        public bool IsSuccess { get; protected set; }
        public T Value { get; protected set; }
        public U Error { get; protected set; }
    }
 

    public class Result<T> : AbstractResult<T, String>
    {
        public static Result<T> Success(T value) => new Result<T> { IsSuccess = true, Value = value };
        public static Result<T> Failure(string error) => new Result<T> { IsSuccess = false, Error = error };
    }

    public class Result<T, U> : AbstractResult<T, U>
    {
        public static Result<T, U> Success(T value) => new Result<T, U> { IsSuccess = true, Value = value };
        public static Result<T, U> Failure(U error) => new Result<T, U> { IsSuccess = false, Error = error };
    }
}