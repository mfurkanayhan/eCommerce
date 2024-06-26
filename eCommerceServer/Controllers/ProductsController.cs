using eCommerceServer.Context;
using eCommerceServer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceServer.Controllers;
[Route("api/[controller]/[action]")]
[ApiController]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        ApplicationDbContext context = new();
        List<Product> products = context.Products.ToList();
        return Ok(products);
    }
}
