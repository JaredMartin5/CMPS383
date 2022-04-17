﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Controllers;
[Route("api/file")]
[ApiController]
public class FileController : Controller
{
    private readonly DataContext dataContext;

    public FileController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [HttpPost("updatefile"), Authorize(Roles = RoleNames.AdminOrPublisher)]
    public ActionResult UpdateFile(IFormFile file, [FromForm] int productId)
    {
        var product = dataContext.Set<Product>().First(x => x.Id == productId);
        if (product == null)
            return BadRequest();

        // delete product file
        //https://stackoverflow.com/questions/1288718/how-to-delete-all-files-and-folders-in-a-directory
        string delPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//{product.FileName}");
        FileInfo delFile = new FileInfo(delPath);
        if (delFile.Exists)
            delFile.Delete();

        // attempt to add the new file
        //https://sankhadip.medium.com/how-to-upload-files-in-net-core-web-api-and-react-36a8fbf5c9e8
        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}", file.FileName);
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}"));
            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            product.FileName = file.FileName;
            dataContext.SaveChanges();
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("download/{productId}/{fileName}"), Authorize]
    public IActionResult DownloadFile(int productId, string fileName)
    {
        var product = dataContext.Set<Product>().First(x => x.Id == productId);
        if (product == null)
            return NotFound("Product not found");
        if (User.IsInRole(RoleNames.User) && product.Status == Product.StatusType.Inactive)
            return Unauthorized("Product is inactive");
        int? userId = User.GetCurrentUserId();
        // Check if user has item in library
        if (User.IsInRole(RoleNames.User) && dataContext.Set<ProductUser>().First(x => x.UserId == userId && x.ProductId == productId) == null)
            return BadRequest("User does not have item in library");
        // Check if publisher owns item
        if ((User.IsInRole(RoleNames.Publisher) || User.IsInRole(RoleNames.PendingPublisher)) && dataContext.Set<Product>().First(x => x.PublisherId == userId) == null)
            return BadRequest("Publisher does not own item");

        string path = Path.Combine(Directory.GetCurrentDirectory(), $@"ProductFiles//{productId}//", fileName);
        byte[] bytes = System.IO.File.ReadAllBytes(path);
        return File(bytes, "application/octet-stream", fileName);
    }

    [HttpGet("icon/{productId}/")]
    public IActionResult DownloadIcon(int productId)
    {
        int CacheAgeSeconds = 60 * 60 * 24; // 1 day
        Response.Headers[HeaderNames.CacheControl] = $"public,max-age={CacheAgeSeconds}";

        try
        {
            var iconName = dataContext.Set<Product>().First(x => x.Id == productId).IconName;
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//", iconName);
            byte[] bytes = System.IO.File.ReadAllBytes(path);
            return File(bytes, "image/*", iconName);
        }
        catch (Exception)
        {
            return NotFound();
        }

    }

    [HttpGet("picture/{productId}/{fileName}")]
    public FileResult DownloadPicture(int productId, string fileName)
    {
        int CacheAgeSeconds = 60 * 60 * 24; // 1 day
        Response.Headers[HeaderNames.CacheControl] = $"public,max-age={CacheAgeSeconds}";
        string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//Pictures", fileName);
        byte[] bytes = System.IO.File.ReadAllBytes(path);
        return File(bytes, "image/*", fileName);
    }

}

