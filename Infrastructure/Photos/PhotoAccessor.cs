using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        { 
            var account = new Account(
                config.Value.Cloudname,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            cloudinary = new Cloudinary(account);
        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length < 1)
            {
                return null;
            }
            await using Stream stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.Name, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill")
            };
            ImageUploadResult uploadResult = await cloudinary.UploadAsync(uploadParams);
            if (uploadResult.Error != null)
            {
                throw new Exception(uploadResult.Error.Message);
            }
            return new PhotoUploadResult 
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.ToString()
            };
        }
        public async Task<bool> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            DeletionResult result = await cloudinary.DestroyAsync(deleteParams); 

            return result.StatusCode == HttpStatusCode.OK;
        }
    }
}